import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ExternalLink, RefreshCw, ShoppingBag, Sparkles, Search, Loader2, SlidersHorizontal, Camera } from 'lucide-angular';
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
              <button (click)="loadTrendingOutfits()" class="w-9 h-9 bg-[#F8F8F6] border border-[#EDEDE9] rounded-xl flex items-center justify-center hover:border-black transition-colors">
                <lucide-angular [img]="RefreshIcon" class="w-4 h-4 text-gray-400 hover:text-black" [class.animate-spin]="isLoading"></lucide-angular>
              </button>
            </div>
          </div>

          <!-- Search bar -->
          <div class="relative pb-3">
            <lucide-angular [img]="SearchIcon" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A96]"></lucide-angular>
            <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="searchExternal()"
              placeholder="Search: Denim, Saree, Sneakers..."
              class="w-full bg-[#F8F8F6] border border-[#EDEDE9] rounded-xl pl-11 pr-28 py-3 text-sm text-black placeholder-[#9A9A96] focus:outline-none focus:border-black transition-all">
            <button (click)="searchExternal()" [disabled]="isSearching || !searchQuery"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-40">
              <span *ngIf="!isSearching">Search</span>
              <lucide-angular *ngIf="isSearching" [img]="LoaderIcon" class="w-3 h-3 animate-spin"></lucide-angular>
            </button>
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
            <button (click)="searchResults = []" class="text-[10px] uppercase tracking-widest text-[#9A9A96] hover:text-black transition-colors flex items-center gap-2 bg-[#F8F8F6] border border-[#EDEDE9] rounded-xl px-3 py-2">
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
            class="animate-fade-in" [style.animation-delay]="groupIdx * 80 + 'ms'">

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
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div *ngFor="let outfit of group.items; let i = index"
                class="group animate-fade-in-up"
                [style.animation-delay]="(i % 10) * 50 + 'ms'">

                <div class="relative rounded-2xl overflow-hidden bg-white border border-[#EDEDE9] mb-3 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1"
                  style="aspect-ratio:3/4;">
                  <img [src]="outfit.image_url" [alt]="outfit.name"
                    loading="lazy"
                    (error)="handleImageError($event)"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">

                  <!-- Style match badge -->
                  <div *ngIf="isMainOutfit(outfit.category)"
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

                  <!-- Category badge (bottom) - only show for non-accessory items -->
                  <div *ngIf="getCleanCategory(outfit.category)"
                    class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white border border-white/10">
                    {{ getCleanCategory(outfit.category) }}
                  </div>
                </div>

                <!-- Card text -->
                <div class="px-1">
                  <h3 class="text-[11px] font-bold uppercase tracking-wider text-black truncate" [title]="outfit.name">{{ outfit.name }}</h3>
                  <div class="flex items-center justify-between mt-1">
                    <span class="text-sm font-black text-black">{{ outfit.price | currency:'INR':'symbol':'1.0-0' }}</span>
                    <span class="text-[9px] uppercase tracking-widest text-[#9A9A96] font-semibold">{{ outfit.color }}</span>
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

        <!-- Empty State (no data and not loading) -->
        <div *ngIf="!isLoading && trendingOutfits.length === 0 && searchResults.length === 0" class="flex flex-col items-center justify-center py-24 space-y-6 animate-fade-in">
          <div class="w-24 h-24 bg-white border border-[#EDEDE9] rounded-3xl flex items-center justify-center shadow-sm">
            <lucide-angular [img]="BagIcon" class="w-10 h-10 text-[#EDEDE9]"></lucide-angular>
          </div>
          <div class="text-center space-y-2 max-w-xs">
            <h3 class="text-xl luxury-font text-[#9A9A96]">Discovering New Trends</h3>
            <p class="text-[11px] uppercase tracking-widest text-[#9A9A96]/60 leading-relaxed">Our AI is syncing the latest fashion from premium catalogs.</p>
          </div>
          <div class="flex gap-3">
            <a routerLink="/upload" class="btn-primary text-[10px] px-6 py-3">
              <lucide-angular [img]="CameraIcon" class="w-4 h-4"></lucide-angular>
              Analyze Your Style
            </a>
            <button (click)="loadTrendingOutfits()" class="btn-outline text-[10px] px-6 py-3">Refresh</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class RecommendationsComponent implements OnInit {
  private outfitService = inject(OutfitService);

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
  analysisResult: any = null;

  categories: string[] = ['All', 'Dress'];
  activeCategory: string = 'All';

  ngOnInit() {
    this.loadAnalysisResult();
    this.loadTrendingOutfits();
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

  isMainOutfit(category: string): boolean {
    if (!category) return true;
    const cat = category.toLowerCase();
    const accessoryKeywords = ['bag', 'shoe', 'chappal', 'sandal', 'heel', 'accessory', 'jewelry', 'belt', 'watch'];
    return !accessoryKeywords.some(key => cat.includes(key));
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
    if (this.activeCategory === 'Dress') return outfits.filter(o => this.isMainOutfit(o.category));
    return outfits.filter(o => {
      const cat = (o.category || '').toLowerCase();
      return cat.includes(this.activeCategory.toLowerCase());
    });
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
      const cat = this.isMainOutfit(p.category) ? 'Dresses & Outfits' : (p.category || 'Accessories');
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return Object.keys(groups).sort((a, b) => a.includes('Dresses') ? -1 : 1).map(key => ({
      name: key,
      items: groups[key]
    }));
  }

  updateDynamicCategories() {
    const cats = new Set<string>(['All', 'Dress']);
    this.trendingOutfits.forEach(o => {
      if (!this.isMainOutfit(o.category)) {
        cats.add(o.category || 'Accessories');
      }
    });
    this.categories = Array.from(cats);
  }

  setActiveCategory(category: string) {
    this.activeCategory = category;
    setTimeout(() => {
      const el = document.getElementById('top-of-grid');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  loadTrendingOutfits() {
    // Only show loading skeleton if we have no data yet
    if (!this.trendingOutfits.length) {
      this.isLoading = true;
    }
    this.outfitService.getTrendingOutfits(100).subscribe({
      next: (data) => {
        this.isLoading = false;
        // Use AI-personalized results if available, otherwise fall back to trending
        if (!this.analysisResult?.recommended_outfits?.length) {
          this.trendingOutfits = data;
        }
        this.updateDynamicCategories();
      },
      error: () => { this.isLoading = false; }
    });
  }

  getCleanCategory(category: string): string {
    if (!category) return '';
    const cat = category.toLowerCase();
    if (cat.includes('dress') || cat.includes('kurta') || cat.includes('saree') || cat.includes('suit')) return 'Dress';
    if (cat.includes('jean') || cat.includes('denim') || cat.includes('trouser') || cat.includes('pant')) return 'Bottom';
    if (cat.includes('top') || cat.includes('shirt') || cat.includes('blouse') || cat.includes('tee') || cat.includes('t-shirt')) return 'Top';
    if (cat.includes('jacket') || cat.includes('coat') || cat.includes('blazer')) return 'Outerwear';
    if (cat.includes('shoe') || cat.includes('chappal') || cat.includes('sandal') || cat.includes('heel') || cat.includes('sneaker') || cat.includes('boot')) return 'Footwear';
    if (cat.includes('bag') || cat.includes('purse') || cat.includes('clutch')) return 'Bag';
    if (cat.includes('jewelry') || cat.includes('necklace') || cat.includes('ring') || cat.includes('earring') || cat.includes('bracelet')) return 'Jewelry';
    if (cat.includes('belt')) return 'Belt';
    if (cat.includes('watch')) return 'Watch';
    if (cat.includes('hair')) return 'Hair';
    // If it's a generic tag like Men's Fashion / Women's Fashion, don't show it
    if (cat.includes('fashion') || cat.includes('cloth') || cat.includes('apparel') || cat.includes('wear')) return '';
    return '';
  }

  handleImageError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';
    event.target.classList.add('opacity-60');
  }

  buyNow(link: string) { if (link) window.open(link, '_blank'); }
}
