import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ExternalLink, RefreshCw, ShoppingBag, Sparkles, Search, Loader2, SlidersHorizontal, Camera } from 'lucide-angular';
import { ActivatedRoute } from '@angular/router';
import { OutfitService } from '../../core/services/outfit.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#F8F8F6] pt-16 page-content">

      <!-- Skin Tone Profile Banner -->
      <div *ngIf="analysisResult" class="bg-black text-white animate-fade-in">
        <div class="max-w-7xl mx-auto px-5 sm:px-8 py-5">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 flex-shrink-0">
              <img *ngIf="analysisResult.photo?.url" [src]="analysisResult.photo?.url" class="w-full h-full object-cover">
              <div *ngIf="!analysisResult.photo?.url" class="w-full h-full bg-[#D4AF37]/20 flex items-center justify-center">
                <lucide-angular [img]="CameraIcon" class="w-6 h-6 text-[#D4AF37]"></lucide-angular>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[9px] uppercase tracking-[0.3em] font-bold text-white">Style Profile</span>
                <span class="w-1 h-1 rounded-full bg-[#D4AF37]"></span>
                <span class="text-[9px] uppercase tracking-[0.3em] font-bold text-[#D4AF37]">{{ analysisResult.gender }}</span>
              </div>
              <p class="text-sm font-bold text-white mt-0.5 truncate">
                {{ analysisResult.skin_tone }}
                <span class="text-white/40 font-normal text-xs ml-2">· {{ trendingOutfits.length }} matches found</span>
              </p>
            </div>
            <!-- Color dots -->
            <div class="flex gap-1.5 flex-shrink-0">
              <div *ngFor="let color of (analysisResult.recommended_colors || []).slice(0, 5)"
                class="w-5 h-5 rounded-full border-2 border-white/20"
                [style.background]="color.toLowerCase().replace(' ', '')"
                [title]="color">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Header + Search -->
      <div class="sticky top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-[#EDEDE9]">
        <div class="max-w-7xl mx-auto px-5 sm:px-8">
          <!-- Title row -->
          <div class="flex items-center justify-between py-4">
            <h1 class="text-2xl luxury-font text-black">Style <span class="italic text-[#D4AF37]">Explorer</span></h1>
            <div class="flex items-center gap-2">
              <button (click)="forceRefresh()" [disabled]="isLoading" class="w-9 h-9 bg-[#F8F8F6] border border-[#EDEDE9] rounded-xl flex items-center justify-center hover:border-black transition-colors disabled:opacity-40">
                <lucide-angular [img]="RefreshIcon" class="w-4 h-4 text-gray-400 hover:text-black" [class.animate-spin]="isLoading"></lucide-angular>
              </button>
            </div>
          </div>

          <!-- Search bar -->
          <div class="relative mb-3">
            <lucide-angular [img]="SearchIcon" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A96]"></lucide-angular>
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="searchExternal()"
              placeholder="Search: Denim, Saree, Sneakers..."
              class="w-full bg-[#F8F8F6] border border-[#EDEDE9] rounded-xl pl-12 pr-28 py-3.5 text-sm text-black placeholder-[#9A9A96] focus:outline-none focus:border-black transition-all">
            
            <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button *ngIf="searchQuery || searchResults.length > 0" (click)="clearSearch()" 
                class="p-2 text-gray-400 hover:text-black transition-colors">
                <lucide-angular [img]="RefreshIcon" class="w-4 h-4 rotate-45"></lucide-angular>
              </button>
              <button (click)="searchExternal()" [disabled]="isSearching || !searchQuery"
                class="bg-black text-white text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-40">
                <span *ngIf="!isSearching">Search</span>
                <lucide-angular *ngIf="isSearching" [img]="LoaderIcon" class="w-3 h-3 animate-spin"></lucide-angular>
              </button>
            </div>
          </div>

          <!-- Category Pill Filters -->
          <div class="flex gap-2 overflow-x-auto no-scrollbar pb-3">
            <button *ngFor="let cat of categories"
              (click)="setActiveCategory(cat)"
              class="pill-filter flex-shrink-0"
              [class.active]="activeCategory === cat">
              {{ cat }}
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-6" id="top-of-grid">

        <!-- Loading Skeleton -->
        <div *ngIf="isLoading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div *ngFor="let _ of [1,2,3,4,5,6,7,8]" class="animate-fade-in">
            <div class="skeleton rounded-2xl mb-3" style="aspect-ratio:3/4;"></div>
            <div class="skeleton h-4 rounded-xl w-3/4 mb-2"></div>
            <div class="skeleton h-3 rounded-xl w-1/2"></div>
          </div>
        </div>

        <!-- Search Results -->
        <div *ngIf="searchResults.length > 0 && !isLoading" id="search-results" class="mb-10 animate-fade-in">
          <div class="flex items-center justify-between mb-5">
            <div>
              <p class="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-1">Live Search</p>
              <h2 class="text-xl font-bold text-black">Results for "{{ lastSearchQuery }}"</h2>
            </div>
            <button (click)="clearSearch()" class="text-[10px] uppercase tracking-widest text-[#9A9A96] hover:text-black transition-colors flex items-center gap-2 bg-[#F8F8F6] border border-[#EDEDE9] rounded-xl px-3 py-2">
              ✕ Clear
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div *ngFor="let outfit of filteredSearchResults; let i = index"
              class="group animate-fade-in-up"
              [style.animation-delay]="i * 40 + 'ms'">
              <div class="relative rounded-2xl overflow-hidden bg-white border border-[#EDEDE9] mb-3"
                style="aspect-ratio:3/4;">
                <img [src]="outfit.image_url" [alt]="outfit.name"
                  loading="lazy"
                  (error)="handleImageError($event)"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                <!-- Action overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                  <button (click)="buyNow(outfit.affiliate_link)"
                    class="w-full bg-white text-black py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-[#D4AF37] transition-all">
                    Buy Now
                  </button>
                </div>
                <!-- Brand tag -->
                <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-[9px] font-bold uppercase tracking-wider border border-white/20 shadow-sm">
                  {{ outfit.brand || 'Premium' }}
                </div>
              </div>
              <div class="px-1">
                <h3 class="text-[11px] font-bold uppercase tracking-wider text-black truncate" [title]="outfit.name">{{ outfit.name }}</h3>
                <p class="text-sm font-black text-black mt-0.5">{{ outfit.price | currency:'INR':'symbol':'1.0-0' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Product Feed -->
        <div *ngIf="!isLoading && groupedProducts.length > 0" class="space-y-12">
          <div *ngFor="let group of groupedProducts; let groupIdx = index"
            class=""> <!-- Removed animation from group -->

            <!-- Section Header -->
            <div class="flex items-center gap-4 mb-6">
              <div>
                <div *ngIf="group.name === 'Dresses & Outfits'" class="flex items-center gap-1.5 mb-1">
                  <lucide-angular [img]="SparklesIcon" class="w-3 h-3 text-[#D4AF37]"></lucide-angular>
                  <p class="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Matched to Your Tone</p>
                </div>
                <h2 class="text-xl font-bold text-black">{{ group.name }}</h2>
              </div>
              <div class="flex-1 h-px bg-[#EDEDE9]"></div>
              <span class="text-[10px] uppercase tracking-widest text-[#9A9A96] font-semibold">{{ group.items.length }}</span>
            </div>

            <!-- Product Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6 items-start">
              <div *ngFor="let outfit of group.items; let i = index"
                class="group flex flex-col"> <!-- Removed animate-fade-in-up -->

                <!-- Image container: fixed aspect-ratio, never collapses -->
                <div class="relative rounded-2xl overflow-hidden bg-[#F0EEE9] border border-[#EDEDE9] transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex-shrink-0"
                  style="aspect-ratio:3/4; width:100%;">
                  <img [src]="outfit.image_url" [alt]="outfit.name"
                    loading="lazy"
                    (error)="handleImageError($event)"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">

                  <!-- Style match badge -->
                  <div *ngIf="isMainOutfit(outfit.category, outfit.name)"
                    class="absolute top-0 right-0 bg-[#D4AF37] text-black text-[8px] uppercase tracking-widest px-2.5 py-1.5 font-black rounded-bl-xl">
                    ✦ Match
                  </div>

                  <!-- Hover overlay with CTA -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-4 gap-3">
                    <div>
                      <p class="text-[9px] text-[#D4AF37] uppercase tracking-widest font-bold">{{ outfit.brand || 'Premium' }}</p>
                      <p class="text-[11px] text-white font-semibold leading-snug line-clamp-2">{{ outfit.name }}</p>
                    </div>
                    <button (click)="buyNow(outfit.affiliate_link)"
                      class="w-full bg-white text-black py-2.5 text-[10px] uppercase tracking-widest font-black rounded-xl hover:bg-[#D4AF37] transition-all active:scale-95">
                      Buy Now
                    </button>
                  </div>

                  <!-- Category badge (bottom) -->
                  <div *ngIf="getCleanCategory(outfit.category)"
                    class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white border border-white/10">
                    {{ getCleanCategory(outfit.category) }}
                  </div>
                </div>

                <!-- Card text: always below image, fixed height area -->
                <div class="px-1 pt-2">
                  <h3 class="text-[11px] font-bold uppercase tracking-wider text-black line-clamp-2 leading-tight" [title]="outfit.name">{{ outfit.name }}</h3>
                  <div class="flex items-center justify-between mt-1.5">
                    <span class="text-sm font-black text-black">{{ outfit.price | currency:'INR':'symbol':'1.0-0' }}</span>
                    <span class="text-[9px] uppercase tracking-widest text-[#9A9A96] font-semibold truncate ml-2">{{ outfit.color }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- End of list -->
          <div class="text-center py-12 border-t border-[#EDEDE9]">
            <p class="text-[10px] uppercase tracking-[0.4em] text-[#9A9A96] font-semibold">End of Curated Selection</p>
          </div>
        </div>

        <!-- Empty State (No products in active category) -->
        <div *ngIf="!isLoading && groupedProducts.length === 0 && (activeCategory !== 'All' || (trendingOutfits.length === 0 && searchResults.length === 0))" 
          class="flex flex-col items-center justify-center py-24 space-y-6 animate-fade-in">
          <div class="w-24 h-24 bg-white border border-[#EDEDE9] rounded-3xl flex items-center justify-center shadow-sm">
            <lucide-angular [img]="BagIcon" class="w-10 h-10 text-[#EDEDE9]"></lucide-angular>
          </div>
          <div class="text-center space-y-2 max-w-xs">
            <h3 class="text-xl luxury-font text-[#9A9A96]">
              {{ activeCategory === 'All' ? 'Discovering New Trends' : 'No ' + activeCategory + ' Found' }}
            </h3>
            <p class="text-[11px] uppercase tracking-widest text-[#9A9A96]/60 leading-relaxed">
              {{ activeCategory === 'All' 
                  ? 'Our AI is syncing the latest fashion from premium catalogs.' 
                  : 'We couldn\'t find any items in this category. Try refreshing or searching for something else.' }}
            </p>
          </div>
          <div class="flex gap-3">
            <a *ngIf="activeCategory === 'All'" routerLink="/upload" class="btn-primary text-[10px] px-6 py-3">
              <lucide-angular [img]="CameraIcon" class="w-4 h-4"></lucide-angular>
              Analyze Your Style
            </a>
            <button (click)="forceRefresh()" class="btn-outline text-[10px] px-6 py-3">Refresh Catalog</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class RecommendationsComponent implements OnInit {
  private outfitService = inject(OutfitService);
  private route = inject(ActivatedRoute);

  readonly RefreshIcon = RefreshCw;
  readonly LinkIcon = ExternalLink;
  readonly BagIcon = ShoppingBag;
  readonly SparklesIcon = Sparkles;
  readonly SearchIcon = Search;
  readonly LoaderIcon = Loader2;
  readonly CameraIcon = Camera;

  trendingOutfits: any[] = [];
  searchResults: any[] = [];
  searchQuery: string = '';
  lastSearchQuery: string = '';
  isSearching: boolean = false;
  isLoading: boolean = false;
  dataLoaded: boolean = false;
  analysisResult: any = null;

  categories: string[] = ['All', 'Dress'];
  activeCategory: string = 'All';

  ngOnInit() {
    this.loadAnalysisResult();
    this.loadTrendingOutfits();
    
    // Switch to category passed via query params (e.g., from Dashboard)
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        const cat = params['category'];
        // Map common dashboard IDs to internal category names if needed
        this.activeCategory = cat;
        // Trigger scroll after data is likely rendered
        setTimeout(() => this.setActiveCategory(cat), 500);
      }
    });
  }

  loadAnalysisResult() {
    const stored = localStorage.getItem('latest_recommendations');
    if (stored) {
      this.analysisResult = JSON.parse(stored);
      if (this.analysisResult.recommended_outfits?.length) {
        // Normalize legacy data: old API used 'image', new API uses 'image_url'
        this.trendingOutfits = this.analysisResult.recommended_outfits.map((o: any) => ({
          ...o,
          image_url: o.image_url || o.image || null
        }));
        this.dataLoaded = true; // AI results loaded - skip background trending fetch
        this.updateDynamicCategories();
      }
    }
  }

  get primaryOutfits() {
    let outfits = [...this.trendingOutfits];
    // Only keyword-filter if these are general trending items (not AI-personalized matches)
    if (this.analysisResult?.gender && !this.analysisResult?.recommended_outfits?.length) {
      const g = this.analysisResult.gender.toLowerCase();
      if (g === 'male') {
        outfits = outfits.filter(o => {
          const cat = (o.category || '').toLowerCase();
          const name = (o.name || '').toLowerCase();
          return (cat.includes('men') || name.includes('men')) &&
            !cat.includes('women') && !name.includes('women');
        });
      } else if (g === 'female') {
        outfits = outfits.filter(o => {
          const cat = (o.category || '').toLowerCase();
          const name = (o.name || '').toLowerCase();
          return cat.includes('women') || name.includes('women') || this.isDress(o.category);
        });
      }
    }
    return outfits.filter(o => this.isMainOutfit(o.category));
  }

  get secondaryItems() {
    return this.trendingOutfits.filter(o => !this.isMainOutfit(o.category));
  }

  isMainOutfit(category: string, name: string = ''): boolean {
    if (!category && !name) return true;
    const clean = this.getCleanCategory(category, name);
    // Clothing items are main outfits. Accessories, beauty, etc. are not.
    const clothingCategories = ['Dress', 'Top', 'Bottom', 'Outerwear', 'Activewear'];
    if (clean) return clothingCategories.includes(clean);
    
    // Fallback: if we can't categorize it, but it doesn't match known accessories, assume it's an outfit
    return true; 
  }

  isDress(category: string): boolean {
    if (!category) return false;
    const cat = category.toLowerCase();
    return cat.includes('dress') || cat.includes('saree') || cat.includes('kurta');
  }

  get filteredTrending() {
    let outfits = [...this.trendingOutfits];
    // Only apply keyword-based gender filter when NOT using AI-personalized results
    // (AI recommendations are already gender-matched server-side)
    if (this.analysisResult?.gender && !this.analysisResult?.recommended_outfits?.length) {
      const g = this.analysisResult.gender.toLowerCase();
      if (g === 'male') {
        outfits = outfits.filter(o => {
          const cat = (o.category || '').toLowerCase();
          const name = (o.name || '').toLowerCase();
          return (cat.includes('men') || name.includes('men')) &&
            !cat.includes('women') && !name.includes('women');
        });
      } else if (g === 'female') {
        outfits = outfits.filter(o => {
          const cat = (o.category || '').toLowerCase();
          const name = (o.name || '').toLowerCase();
          return cat.includes('women') || name.includes('women') || this.isDress(o.category);
        });
      }
    }
    if (this.activeCategory === 'All') return outfits;
    return outfits.filter(o => this.getCleanCategory(o.category, o.name) === this.activeCategory);
  }

  get filteredSearchResults() {
    let results = [...this.searchResults];
    if (this.analysisResult?.gender) {
      const g = this.analysisResult.gender.toLowerCase();
      if (g === 'male') {
        results = results.filter(o => {
          const name = (o.name || '').toLowerCase();
          return name.includes('men') && !name.includes('women') && !name.includes('saree') && !name.includes('dress');
        });
      } else if (g === 'female') {
        results = results.filter(o => {
          const name = (o.name || '').toLowerCase();
          return name.includes('women') || name.includes('girl') || name.includes('saree') || name.includes('dress');
        });
      }
    }
    return results;
  }

  get groupedProducts() {
    const outfits = this.filteredTrending;
    const groups: { [key: string]: any[] } = {};
    outfits.forEach(p => {
      let groupName = 'Dresses & Outfits';
      if (!this.isMainOutfit(p.category, p.name)) {
        groupName = this.getCleanCategory(p.category, p.name) || 'Accessories';
      }
      
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(p);
    });
    
    // Sort so Dresses & Outfits is always first, then others alphabetically
    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'Dresses & Outfits') return -1;
        if (b === 'Dresses & Outfits') return 1;
        return a.localeCompare(b);
      })
      .map(key => ({
        name: key,
        items: groups[key]
      }));
  }

  updateDynamicCategories() {
    const cats = new Set<string>(['All', 'Dress']);
    this.trendingOutfits.forEach(o => {
      const clean = this.getCleanCategory(o.category, o.name);
      if (clean && clean !== 'Dress') {
        cats.add(clean);
      }
    });
    this.categories = Array.from(cats);
  }

  setActiveCategory(category: string) {
    this.activeCategory = category;
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }

  searchExternal() {
    if (!this.searchQuery || this.isSearching) return;
    this.isSearching = true;
    this.lastSearchQuery = this.searchQuery;
    this.searchResults = [];
    let refinedQuery = this.searchQuery;
    if (this.analysisResult?.gender && this.analysisResult.gender.toLowerCase() !== 'universal') {
      refinedQuery = `${this.analysisResult.gender} ${this.searchQuery}`;
    }
    this.outfitService.searchExternalProducts(refinedQuery, 'amazon', 12).subscribe({
      next: (data) => {
        this.searchResults = data;
        this.isSearching = false;
        this.searchQuery = '';
        setTimeout(() => {
          const el = document.getElementById('search-results');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      },
      error: () => { this.isSearching = false; }
    });
  }
  
  clearSearch() {
    this.searchResults = [];
    this.searchQuery = '';
    this.isSearching = false;
    this.lastSearchQuery = '';
  }

  loadTrendingOutfits() {
    // Guard: don't re-fetch if already loading or data already loaded
    if (this.isLoading || this.dataLoaded) return;
    this.isLoading = true;
    console.log('Fetching fresh trending outfits...');
    this.outfitService.getTrendingOutfits(100).subscribe({
      next: (data) => {
        console.log('Successfully loaded', data.length, 'outfits');
        this.isLoading = false;
        this.dataLoaded = true;
        // Use AI-personalized results if available, otherwise fall back to trending
        if (!this.analysisResult?.recommended_outfits?.length) {
          this.trendingOutfits = data;
        }
        this.updateDynamicCategories();
      },
      error: () => { this.isLoading = false; }
    });
  }

  forceRefresh() {
    // Explicit user action - clear cache and reload fresh trending data
    if (this.isLoading) return;
    this.dataLoaded = false;
    this.analysisResult = null;
    this.trendingOutfits = [];
    localStorage.removeItem('latest_recommendations');
    this.loadTrendingOutfits();
  }

  getCleanCategory(category: string, name: string = ''): string {
    const cat = (category || '').toLowerCase();
    const nm = (name || '').toLowerCase();
    const combined = `${cat} ${nm}`;
    
    const has = (keywords: string[], wholeWord = false) => {
      return keywords.some(k => {
        if (wholeWord) {
          return new RegExp(`\\b${k}\\b`, 'i').test(combined);
        }
        return combined.includes(k.toLowerCase());
      });
    };

    // Priority 1: Accessories & Beauty (Short/Dangerous keywords must use wholeWord=true)
    if (has(['shoe', 'chappal', 'sandal', 'heel', 'sneaker', 'boot', 'jutti', 'mojari', 'flat', 'slipper', 'loafer', 'slide', 'flip flap'], true)) return 'Footwear';
    if (has(['jewelry', 'necklace', 'earring', 'bracelet', 'bangle', 'pendant', 'brooch', 'ring', 'pin', 'bindi', 'tikka', 'mangalsutra'], true)) return 'Jewelry';
    if (has(['hair', 'clip', 'scrunchie', 'tiara', 'comb', 'scrunchy'], false) || has(['band', 'bow'], true)) return 'Hair Accessories';
    if (has(['lipstick', 'serum', 'mask', 'cream', 'lotion', 'palette', 'perfume', 'skincare', 'makeup', 'cosmetic', 'beauty', 'eyeliner', 'kajal', 'face wash'], false)) return 'Beauty';
    if (has(['watch', 'belt', 'wallet', 'purse', 'clutch'], true)) return 'Accessories';
    if (has(['bag', 'backpack', 'handbag', 'tote'], true)) return 'Bag';

    // Priority 2: Clothing categories (Substring matching is generally fine here)
    if (has(['dress', 'saree', 'kurta', 'suit', 'gown', 'lehenga', 'anarkali'], false)) return 'Dress';
    if (has(['jean', 'denim', 'trouser', 'pant', 'legging', 'jegging', 'short', 'skirt', 'palazzo', 'dhoti'], false)) return 'Bottom';
    if (has(['top', 'shirt', 'blouse', 'tee', 't-shirt', 'kurti', 'tunic', 'crop top'], false)) return 'Top';
    if (has(['jacket', 'coat', 'blazer', 'shrug', 'sweater', 'hoodie', 'cardigan', 'overcoat', 'windbreaker'], false)) return 'Outerwear';
    if (has(['gym', 'sport', 'workout', 'active', 'track', 'yoga', 'sweatpant', 'hoodie'], false)) return 'Activewear';
    
    return '';
  }

  handleImageError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';
    event.target.classList.add('opacity-60');
  }

  buyNow(link: string) { if (link) window.open(link, '_blank'); }
}
