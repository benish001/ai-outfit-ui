import { Component, OnInit, inject, HostListener } from '@angular/core';
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
    <div class="min-h-screen bg-[var(--surface)] pt-16 page-content">

      <!-- Skin Tone Profile Banner -->
      <div *ngIf="analysisResult" class="bg-[var(--brand-dark)] text-white animate-fade-in shadow-xl">
        <div class="max-w-7xl mx-auto px-5 sm:px-8 py-5">
          <div class="flex items-center gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[9px] uppercase tracking-[0.3em] font-bold text-white">SkinTone Profile</span>
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
            <h1 class="text-2xl luxury-font text-[var(--brand-dark)]">SkinTone <span class="italic text-[var(--brand-gold)]">AI</span></h1>
            <div class="flex items-center gap-2">
              <button (click)="forceRefresh()" [disabled]="isLoading" class="w-9 h-9 bg-[#F8F8F6] border border-[#EDEDE9] rounded-xl flex items-center justify-center hover:border-black transition-colors disabled:opacity-40">
                <lucide-angular [img]="RefreshIcon" class="w-4 h-4 text-gray-400 hover:text-black" [class.animate-spin]="isLoading"></lucide-angular>
              </button>
            </div>
          </div>

          <!-- Remaining Top padding removed for cleaner look since elements are removed -->
          <div class="pb-4"></div>
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



        <!-- Main Product Feed (Flat Grid) -->
        <div *ngIf="!isLoading && filteredTrending.length > 0" class="space-y-12">
          
          <!-- Product Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6 items-start">
            <div *ngFor="let outfit of filteredTrending; let i = index" class="group flex flex-col">
              
              <!-- Image container -->
              <div class="relative rounded-2xl overflow-hidden bg-[#F0EEE9] border border-[#EDEDE9] transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 flex-shrink-0"
                style="aspect-ratio:3/4; width:100%;">
                <img [src]="outfit.image_url" [alt]="outfit.name"
                  loading="lazy"
                  (error)="handleImageError($event)"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">

                <!-- Style match badge -->
                <div *ngIf="analysisResult?.recommended_outfits?.length && isRecommended(outfit)"
                  class="absolute top-0 right-0 bg-[var(--brand-gold)] text-[var(--brand-dark)] text-[8px] uppercase tracking-widest px-2.5 py-1.5 font-black rounded-bl-xl shadow-lg border-l border-b border-black/10">
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

              <!-- Card text -->
              <div class="px-1 pt-2">
                <h3 class="text-[11px] font-bold uppercase tracking-wider text-black line-clamp-2 leading-tight" [title]="outfit.name">{{ outfit.name }}</h3>
                <div class="flex items-center justify-between mt-1.5">
                  <span class="text-sm font-black text-black">{{ outfit.price | currency:'INR':'symbol':'1.0-0' }}</span>
                  <span class="text-[9px] uppercase tracking-widest text-[#9A9A96] font-semibold truncate ml-2">{{ outfit.color }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading More -->
          <div class="py-12 border-t border-[#EDEDE9] flex flex-col items-center justify-center gap-4">
            <div *ngIf="isNextPageLoading" class="flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-[#EDEDE9] shadow-sm animate-bounce">
              <lucide-angular [img]="LoaderIcon" class="w-4 h-4 text-[#D4AF37] animate-spin"></lucide-angular>
              <span class="text-[10px] uppercase tracking-widest font-black text-black">Curating more looks...</span>
            </div>
            <p *ngIf="!hasMore" class="text-[10px] uppercase tracking-[0.4em] text-[#9A9A96] font-semibold">End of Curated Selection</p>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && trendingOutfits.length === 0" 
          class="flex flex-col items-center justify-center py-24 space-y-6 animate-fade-in">
          <div class="w-24 h-24 bg-white border border-[#EDEDE9] rounded-3xl flex items-center justify-center shadow-sm">
            <lucide-angular [img]="BagIcon" class="w-10 h-10 text-[#EDEDE9]"></lucide-angular>
          </div>
          <div class="text-center space-y-2 max-w-xs">
            <h3 class="text-xl luxury-font text-[#9A9A96]">
              Discovering New Trends
            </h3>
            <p class="text-[11px] uppercase tracking-widest text-[#9A9A96]/60 leading-relaxed">
              Our AI is syncing the latest fashion from premium catalogs.
            </p>
          </div>
          <div class="flex gap-3">
            <a routerLink="/upload" class="bg-[var(--brand-dark)] text-white text-[10px] uppercase tracking-widest font-black px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[var(--brand-gold)] hover:text-[var(--brand-dark)] transition-all shadow-md">
              <lucide-angular [img]="CameraIcon" class="w-4 h-4"></lucide-angular>
              Analyze Your Style
            </a>
            <button (click)="forceRefresh()" class="bg-white border border-[#EDEDE9] text-[var(--brand-dark)] text-[10px] uppercase tracking-widest font-black px-6 py-3 rounded-lg hover:border-black transition-all shadow-sm">Refresh Catalog</button>
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
  isLoading: boolean = false;
  isNextPageLoading: boolean = false;
  dataLoaded: boolean = false;
  analysisResult: any = null;

  // Pagination
  skip: number = 0;
  limit: number = 40;
  hasMore: boolean = true;

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
        this.dataLoaded = true; // AI results loaded - skip background trending fetch
      }
    }
  }

  get filteredTrending() {
    return [...this.trendingOutfits].sort((a, b) => {
      const aDress = this.isDress(a.category) || this.getCleanCategory(a.category, a.name) === 'Dress';
      const bDress = this.isDress(b.category) || this.getCleanCategory(b.category, b.name) === 'Dress';
      
      if (aDress && !bDress) return -1;
      if (!aDress && bDress) return 1;
      return 0; // maintain original relative order otherwise
    });
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
    return (category || '').toLowerCase().includes('dress');
  }

  isRecommended(outfit: any): boolean {
    if (!this.analysisResult) return false;
    const colors = this.analysisResult.recommended_colors || [];
    const userGender = this.analysisResult.gender?.toLowerCase();
    const outfitGender = outfit.gender?.toLowerCase();

    // Gender mismatch check (if both have gender info)
    if (userGender && outfitGender && outfitGender !== 'unisex' && userGender !== outfitGender) {
      return false;
    }

    // Heuristic fallback for non-gendered items
    const nameLower = outfit.name.toLowerCase();
    if (userGender === 'male' && (nameLower.includes('women') || nameLower.includes('lady') || outfit.category === 'Dress')) {
      return false;
    }

    const combinedString = `${outfit.name} ${outfit.category}`.toLowerCase();
    return colors.some((c: string) => combinedString.includes(c.toLowerCase()));
  }



  loadTrendingOutfits(isNextPage: boolean = false) {
    // Guard: don't re-fetch if already loading or no more data
    if (this.isLoading || this.isNextPageLoading || (isNextPage && !this.hasMore)) return;
    
    if (isNextPage) {
      this.isNextPageLoading = true;
    } else {
      this.isLoading = true;
    }

    console.log(`Fetching trending outfits (skip=${this.skip}, limit=${this.limit})...`);
    this.outfitService.getTrendingOutfits(this.skip, this.limit, this.analysisResult?.gender).subscribe({
      next: (data) => {
        console.log('Successfully loaded', data.length, 'outfits');
        
        // Filter out items that are already in trendingOutfits (by ID or image_url)
        const newItems = data.filter(item => 
          !this.trendingOutfits.some(existing => (existing.id && item.id && existing.id === item.id) || (existing.image_url === item.image_url))
        );

        if (isNextPage || this.trendingOutfits.length > 0) {
          this.trendingOutfits = [...this.trendingOutfits, ...newItems];
          this.isNextPageLoading = false;
        } else {
          this.trendingOutfits = data;
        }
        
        this.isLoading = false;
        this.dataLoaded = true;

        // Update pagination counter (based on what we actually fetched from server)
        this.skip += data.length;
        
        // If we got fewer items than requested, we've reached the end
        if (data.length < this.limit) {
          this.hasMore = false;
        }

        // Safety: if we didn't add any new items because of deduplication, 
        // but the server says there are more, we should fetch the next page immediately
        // to avoid getting stuck in a scroll loop
        if (newItems.length === 0 && this.hasMore && isNextPage) {
           this.loadTrendingOutfits(true);
        }
      },
      error: () => { 
        this.isLoading = false;
        this.isNextPageLoading = false;
      }
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.hasMore || this.isLoading || this.isNextPageLoading) return;

    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    const max = document.documentElement.scrollHeight;
    
    // Load next page when 400px from bottom (slightly earlier for 40 items)
    if (pos > max - 400) {
      this.loadTrendingOutfits(true);
    }
  }

  forceRefresh() {
    // Explicit user action - clear cache and reload fresh trending data
    if (this.isLoading || this.isNextPageLoading) return;
    this.dataLoaded = false;
    this.analysisResult = null;
    this.trendingOutfits = [];
    this.skip = 0;
    this.hasMore = true;
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

    // Priority 1: High-precision categories (Use wholeWord=true for short common strings like 'comb', 'pin', 'band')
    if (has(['gym', 'sport', 'workout', 'active', 'track', 'yoga', 'sweatpant', 'hoodie', 'resistance'], false)) return 'Activewear';
    if (has(['shoe', 'chappal', 'sandal', 'heel', 'sneaker', 'boot', 'jutti', 'mojari', 'flat', 'slipper', 'loafer', 'slide', 'flip flap'], true)) return 'Footwear';
    if (has(['lipstick', 'serum', 'mask', 'cream', 'lotion', 'palette', 'perfume', 'skincare', 'makeup', 'cosmetic', 'beauty', 'eyeliner', 'kajal', 'face wash'], false)) return 'Beauty';
    if (has(['watch'], true)) return 'Accessories';
    if (has(['hair', 'clip', 'scrunchie', 'tiara', 'scrunchy', 'hairpin'], false) || has(['comb', 'band', 'bow'], true)) return 'Hair Accessories';
    if (has(['jewelry'], false)) return 'Jewelry';
    if (has(['necklace', 'earring', 'bracelet', 'bangle', 'pendant', 'brooch', 'ring', 'bindi', 'tikka', 'mangalsutra'], true)) return 'Jewelry';
    if (has(['belt', 'wallet', 'purse', 'clutch', 'pin'], true)) return 'Accessories';
    if (has(['bag', 'backpack', 'handbag', 'tote'], true)) return 'Bag';

    // Priority 2: Clothing categories
    if (has(['bathrobe', 'robe', 'nightwear', 'sleepwear', 'pajama'], false)) return 'Loungewear';
    if (has(['dress', 'saree', 'kurta', 'suit', 'gown', 'lehenga', 'anarkali'], false)) return 'Dress';
    if (has(['jean', 'denim', 'trouser', 'pant', 'legging', 'jegging', 'short', 'skirt', 'palazzo', 'dhoti'], false)) return 'Bottom';
    if (has(['top', 'shirt', 'blouse', 'tee', 't-shirt', 'kurti', 'tunic', 'crop top'], false)) return 'Top';
    if (has(['jacket', 'coat', 'blazer', 'shrug', 'sweater', 'hoodie', 'cardigan', 'overcoat', 'windbreaker'], false)) return 'Outerwear';
    
    return '';
  }

  handleImageError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';
    event.target.classList.add('opacity-60');
  }

  buyNow(link: string) { if (link) window.open(link, '_blank'); }
}
