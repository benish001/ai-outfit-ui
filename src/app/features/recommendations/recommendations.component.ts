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
    <div class="min-h-screen bg-[#F7F7F5] pt-20 pb-16">

      <!-- Header -->
      <div class="bg-white border-b border-[#E8E8E4] py-10 sm:py-14">
        <div class="max-w-7xl mx-auto px-5 sm:px-8">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div class="space-y-4 w-full max-w-2xl">
              <div class="space-y-2">
                <p class="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Live Discovery</p>
                <h1 class="text-3xl sm:text-4xl luxury-font text-black">Style <span class="italic text-[#D4AF37]">Explorer</span></h1>
              </div>

              <!-- Search Box -->
              <div class="relative group mt-6">
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery" 
                  (keyup.enter)="searchExternal()"
                  placeholder="Search live fashion (e.g. Denim Jacket, Summer Dress)..." 
                  class="w-full bg-[#F7F7F5] border border-[#E8E8E4] px-12 py-4 text-xs tracking-wider text-black focus:border-[#D4AF37] focus:ring-0 transition-all outline-none">
                <lucide-angular [img]="SearchIcon" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors"></lucide-angular>
                <button 
                  (click)="searchExternal()"
                  [disabled]="isSearching || !searchQuery"
                  class="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white text-[9px] uppercase tracking-widest px-4 py-2 hover:bg-[#D4AF37] transition-all disabled:opacity-50">
                  <span *ngIf="!isSearching">Search</span>
                  <lucide-angular *ngIf="isSearching" [img]="LoaderIcon" class="w-3 h-3 animate-spin mx-2"></lucide-angular>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

        <!-- Search Results -->
        <div *ngIf="searchResults.length > 0" class="mb-20">
          <div class="flex items-center justify-between mb-8">
            <div>
              <p class="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-2">Live Discovery</p>
              <h2 class="text-2xl luxury-font text-black">Results for <span class="italic text-[#D4AF37]">{{ lastSearchQuery }}</span></h2>
            </div>
            <button (click)="searchResults = []" class="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Clear Results</button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <div *ngFor="let outfit of searchResults; let i = index"
              class="group animate-fade-in"
              [style.animation-delay]="i * 40 + 'ms'">

              <div class="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                <img [src]="outfit.image_url" [alt]="outfit.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">

                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <button (click)="buyNow(outfit.affiliate_link)"
                    class="btn-gold w-full text-[9px] py-3">
                    <lucide-angular [img]="LinkIcon" class="w-3.5 h-3.5"></lucide-angular>
                    Buy Now
                  </button>
                </div>

                <div class="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-[8px] uppercase tracking-widest text-black font-bold border border-[#E8E8E4]">
                  {{ outfit.brand || 'Live Search' }}
                </div>
              </div>

              <div class="space-y-1">
                <h3 class="text-[11px] font-bold uppercase tracking-wide text-black truncate group-hover:text-[#D4AF37] transition-colors">{{ outfit.name }}</h3>
                <div class="flex items-center justify-between">
                  <span class="text-[9px] uppercase tracking-widest text-gray-400">External</span>
                  <span class="text-[11px] font-black text-black">{{ outfit.price | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="trendingOutfits.length > 0">
          <div class="border-t border-[#E8E8E4] pt-14 mb-10 text-center">
            <p class="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-2">Daily Discoveries</p>
            <h2 class="text-2xl luxury-font text-black">Trending <span class="italic text-[#D4AF37]">Now</span></h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <div *ngFor="let outfit of trendingOutfits; let i = index"
              class="group animate-fade-in"
              [style.animation-delay]="i * 40 + 'ms'">

              <div class="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                <img [src]="outfit.image_url" [alt]="outfit.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">

                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <button (click)="buyNow(outfit.affiliate_link)"
                    class="btn-gold w-full text-[9px] py-3">
                    <lucide-angular [img]="LinkIcon" class="w-3.5 h-3.5"></lucide-angular>
                    Buy Now
                  </button>
                </div>

                <div class="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-[8px] uppercase tracking-widest text-black font-bold border border-[#E8E8E4]">
                  {{ outfit.brand || 'Trending' }}
                </div>
              </div>

              <div class="space-y-1">
                <h3 class="text-[11px] font-bold uppercase tracking-wide text-black truncate group-hover:text-[#D4AF37] transition-colors">{{ outfit.name }}</h3>
                <div class="flex items-center justify-between">
                  <span class="text-[9px] uppercase tracking-widest text-gray-400">{{ outfit.category }}</span>
                  <span class="text-[11px] font-black text-black">{{ outfit.price | currency:'INR':'symbol':'1.0-0' }}</span>
                </div>
              </div>
            </div>
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

  trendingOutfits: any[] = [];
  searchResults: any[] = [];
  searchQuery: string = '';
  lastSearchQuery: string = '';
  isSearching: boolean = false;

  ngOnInit() {
    this.loadTrendingOutfits();
  }

  searchExternal() {
    if (!this.searchQuery || this.isSearching) return;

    this.isSearching = true;
    this.lastSearchQuery = this.searchQuery;
    this.searchResults = [];

    this.outfitService.searchExternalProducts(this.searchQuery, 'amazon', 10).subscribe({
      next: (data) => {
        this.searchResults = data;
        this.isSearching = false;
        this.searchQuery = '';
      },
      error: () => {
        this.isSearching = false;
        alert('Search failed. Please try again.');
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
