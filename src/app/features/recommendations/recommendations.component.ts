import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ExternalLink, RefreshCw, ShoppingBag, Sparkles, Search, Loader2 } from 'lucide-angular';
import { OutfitService } from '../../core/services/outfit.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#FDFDFB] pb-24">

      <!-- Premium Sticky Header - Adjusted for Global Header (80px) -->
      <div class="sticky top-[80px] z-[40] bg-white/80 backdrop-blur-xl border-b border-[#E8E8E4] pt-8 pb-6 transition-all duration-500">
        <div class="max-w-7xl mx-auto px-6 sm:px-10">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="w-8 h-[1px] bg-[#D4AF37]"></span>
                <p class="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold">Curated Luxury</p>
              </div>
              <h1 class="text-4xl sm:text-5xl luxury-font text-black transition-all">Style <span class="italic text-[#D4AF37]">Explorer</span></h1>
            </div>

            <!-- Search & Actions -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1 max-w-2xl justify-end">
              <div class="relative group flex-1">
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery" 
                  (keyup.enter)="searchExternal()"
                  placeholder="Search live fashion (Denim, Saree, Evening)..." 
                  class="w-full bg-[#F7F7F5] border-0 border-b-2 border-transparent px-12 py-4 text-xs tracking-wider text-black focus:border-[#D4AF37] focus:bg-white transition-all outline-none rounded-t-lg shadow-sm group-hover:shadow-md">
                <lucide-angular [img]="SearchIcon" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors"></lucide-angular>
                <button 
                  (click)="searchExternal()"
                  [disabled]="isSearching || !searchQuery"
                  class="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white text-[9px] uppercase tracking-widest px-6 py-2.5 hover:bg-[#D4AF37] transition-all disabled:opacity-50 overflow-hidden group/btn">
                  <span *ngIf="!isSearching" class="relative z-10">Find Now</span>
                  <lucide-angular *ngIf="isSearching" [img]="LoaderIcon" class="w-3 h-3 animate-spin mx-2"></lucide-angular>
                </button>
              </div>
            </div>
          </div>

          <!-- Category Navigation -->
          <div class="flex items-center gap-8 mt-10 overflow-x-auto no-scrollbar pb-2">
            <button *ngFor="let cat of categories"
              (click)="setActiveCategory(cat)"
              [class.text-black]="activeCategory === cat"
              [class.text-gray-400]="activeCategory !== cat"
              class="relative text-[10px] uppercase tracking-[0.3em] font-bold py-2 whitespace-nowrap transition-colors hover:text-[#D4AF37] group">
              {{ cat }}
              <span class="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                [class.scale-x-100]="activeCategory === cat"></span>
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        <div id="top-of-grid" class="scroll-mt-[350px]"></div>

        <!-- Search Results Grid -->
        <div *ngIf="searchResults.length > 0" id="search-results" class="mb-24 animate-fade-in scroll-mt-[350px]">
          <div class="flex items-end justify-between mb-12 border-b border-[#E8E8E4] pb-6">
            <div>
              <p class="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-3">Instant Discovery</p>
              <h2 class="text-3xl luxury-font text-black">Results for <span class="italic text-[#D4AF37]">"{{ lastSearchQuery }}"</span></h2>
            </div>
            <button (click)="searchResults = []" class="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-2 group">
              <span class="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">×</span>
              Clear Discovery
            </button>
          </div>
          <!-- ... grid continues -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            <div *ngFor="let outfit of searchResults; let i = index"
              class="group animate-fade-in-up"
              [style.animation-delay]="i * 50 + 'ms'">

              <div class="relative aspect-[3/4] overflow-hidden bg-[#F7F7F5] mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500 rounded-sm">
                <img [src]="outfit.image_url" [alt]="outfit.name"
                  class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">

                <!-- Hover Overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5 translate-y-4 group-hover:translate-y-0">
                  <button (click)="buyNow(outfit.affiliate_link)"
                    class="w-full bg-white text-black py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#D4AF37] hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0">
                    Acquire Piece
                  </button>
                </div>

                <!-- Brand Float -->
                <div class="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-black font-black border border-[#E8E8E4] shadow-sm transform -rotate-1 group-hover:rotate-0 transition-transform">
                  {{ outfit.brand || 'Luxury' }}
                </div>
                
                <!-- Platforms -->
                <div class="absolute top-4 right-4 flex gap-1">
                  <div class="w-2 h-2 rounded-full" [class.bg-orange-500]="outfit.image_url.includes('amazon')" [class.bg-blue-500]="outfit.image_url.includes('flipkart')"></div>
                </div>
              </div>

              <div class="space-y-2 px-1">
                <p class="text-[8px] uppercase tracking-widest text-[#D4AF37] font-bold">Direct Discovery</p>
                <h3 class="text-[11px] font-medium uppercase tracking-wider text-black truncate group-hover:text-[#D4AF37] transition-colors leading-relaxed">{{ outfit.name }}</h3>
                <div class="flex items-baseline gap-2">
                  <span class="text-sm font-light text-black tracking-tighter">{{ outfit.price | currency:'INR':'symbol':'1.0-0' }}</span>
                  <span class="text-[8px] text-gray-400 line-through font-light" *ngIf="outfit.price > 0">{{ (outfit.price * 1.5) | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Product Feed -->
        <div *ngIf="filteredTrending.length > 0" id="product-feed" class="space-y-16 scroll-mt-[350px]">
          <div class="text-center space-y-4 animate-fade-in">
            <p class="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold">The Edit</p>
            <h2 class="text-4xl luxury-font text-black">{{ activeCategory }} <span class="italic text-[#D4AF37]">Essentials</span></h2>
            <div class="w-12 h-[1px] bg-gray-200 mx-auto"></div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-14">
            <div *ngFor="let outfit of filteredTrending; let i = index"
              class="group animate-fade-in-up"
              [style.animation-delay]="(i % 10) * 60 + 'ms'">

              <div class="relative aspect-[3/4] overflow-hidden bg-[#F7F7F5] mb-5 shadow-sm hover:shadow-xl transition-all duration-700">
                <img [src]="outfit.image_url" [alt]="outfit.name"
                  class="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105">

                <!-- Sale Badge -->
                <div class="absolute top-0 right-0 bg-black text-white text-[8px] uppercase tracking-widest px-4 py-2 font-bold transform translate-x-1 translate-y-1">
                  New Arrival
                </div>

                <!-- Hover Actions -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center space-y-4">
                   <div class="space-y-1 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p class="text-[8px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Limited Edition</p>
                      <h4 class="text-white text-[11px] uppercase tracking-wider font-light line-clamp-2 px-4">{{ outfit.name }}</h4>
                   </div>
                   <button (click)="buyNow(outfit.affiliate_link)"
                    class="w-full border border-white/30 hover:border-[#D4AF37] bg-white/10 backdrop-blur-md text-white py-3.5 text-[9px] uppercase tracking-[0.3em] transition-all hover:bg-[#D4AF37]">
                    Shop the Look
                  </button>
                </div>

                <div class="absolute top-4 left-4 bg-white/95 px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-black font-bold shadow-sm">
                  {{ outfit.brand || 'Premium' }}
                </div>
              </div>

              <div class="space-y-2 text-center group-hover:-translate-y-1 transition-transform duration-300">
                <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-black truncate">{{ outfit.name }}</h3>
                <div class="flex items-center justify-center gap-3">
                  <span class="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-medium">{{ outfit.category }}</span>
                  <span class="w-[3px] h-[3px] rounded-full bg-[#D4AF37]"></span>
                  <span class="text-[11px] font-black text-black">{{ outfit.price | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- End of List -->
          <div class="text-center pt-20">
            <p class="text-[9px] uppercase tracking-[0.5em] text-gray-300 font-bold">End of Curated Selection</p>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="trendingOutfits.length === 0 && searchResults.length === 0 && !isSearching" class="text-center py-40 space-y-8 animate-fade-in">
          <div class="w-24 h-24 bg-white border border-[#E8E8E4] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <lucide-angular [img]="BagIcon" class="w-8 h-8 text-gray-200"></lucide-angular>
          </div>
          <div class="max-w-md mx-auto space-y-3">
            <h3 class="text-2xl luxury-font text-gray-400">Discovering New Trends</h3>
            <p class="text-[11px] uppercase tracking-widest text-gray-300 leading-relaxed">Our AI is currently syncing the latest fashion from premium catalogs.</p>
          </div>
          <button (click)="loadTrendingOutfits()" class="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold hover:text-black transition-colors">Refresh Catalog</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    
    /* Ensure smooth transitions for category changes */
    .scroll-mt-[280px] {
      scroll-margin-top: 280px;
    }
  `]
})
export class RecommendationsComponent implements OnInit {
  private outfitService = inject(OutfitService);

  readonly RefreshIcon = RefreshCw;
  readonly LinkIcon = ExternalLink;
  readonly BagIcon = ShoppingBag;
  readonly SparklesIcon = Sparkles;
  readonly SearchIcon = Search;
  readonly LoaderIcon = Loader2;

  trendingOutfits: any[] = [];
  searchResults: any[] = [];
  searchQuery: string = '';
  lastSearchQuery: string = '';
  isSearching: boolean = false;

  categories: string[] = ['All', 'Dresses', 'Ethnic', 'Tops', 'Casual', 'Luxury'];
  activeCategory: string = 'All';

  ngOnInit() {
    this.loadTrendingOutfits();
  }

  get filteredTrending() {
    if (this.activeCategory === 'All') return this.trendingOutfits;
    return this.trendingOutfits.filter(o =>
      o.category.toLowerCase().includes(this.activeCategory.toLowerCase()) ||
      (this.activeCategory === 'Ethnic' && (o.category.toLowerCase().includes('saree') || o.category.toLowerCase().includes('kurta'))) ||
      (this.activeCategory === 'Luxury' && o.price > 5000)
    );
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

    this.outfitService.searchExternalProducts(this.searchQuery, 'amazon', 12).subscribe({
      next: (data) => {
        this.searchResults = data;
        this.isSearching = false;
        this.searchQuery = '';
        setTimeout(() => {
          const el = document.getElementById('search-results');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      },
      error: () => {
        this.isSearching = false;
        alert('Search fail. Check your connection.');
      }
    });
  }

  loadTrendingOutfits() {
    this.outfitService.getTrendingOutfits(100).subscribe({
      next: (data) => {
        this.trendingOutfits = data;
      }
    });
  }

  buyNow(link: string) { if (link) window.open(link, '_blank'); }
}
