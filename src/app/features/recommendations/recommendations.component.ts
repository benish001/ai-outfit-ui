import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ExternalLink, RefreshCw, ShoppingBag, Sparkles } from 'lucide-angular';
import { OutfitService } from '../../core/services/outfit.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[#F7F7F5] pt-20 pb-16">

      <!-- Header -->
      <div class="bg-white border-b border-[#E8E8E4] py-10 sm:py-14">
        <div class="max-w-7xl mx-auto px-5 sm:px-8">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div class="space-y-2">
              <p class="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Your Curated Selection</p>
              <h1 class="text-3xl sm:text-4xl luxury-font text-black">Style <span class="italic text-[#D4AF37]">Harmony</span></h1>
              <p class="text-[10px] uppercase tracking-widest text-gray-400">
                Based on your <span class="text-black font-bold">{{ skinTone }}</span> skin tone
              </p>
            </div>
            <a routerLink="/upload"
              class="self-start sm:self-auto flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 border border-[#E8E8E4] px-5 py-2.5 hover:border-black hover:text-black transition-all">
              <lucide-angular [img]="RefreshIcon" class="w-3.5 h-3.5"></lucide-angular>
              New Analysis
            </a>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

        <!-- Empty State -->
        <div *ngIf="outfits.length === 0" class="text-center py-24 space-y-7">
          <div class="w-20 h-20 bg-white border border-[#E8E8E4] rounded-full flex items-center justify-center mx-auto">
            <lucide-angular [img]="BagIcon" class="w-8 h-8 text-gray-300"></lucide-angular>
          </div>
          <div>
            <h3 class="text-xl luxury-font text-gray-400 mb-2">No Recommendations Yet</h3>
            <p class="text-[11px] uppercase tracking-widest text-gray-300">Upload your photo to get started</p>
          </div>
          <a routerLink="/upload" class="btn-luxury inline-flex">
            <lucide-angular [img]="SparklesIcon" class="w-4 h-4"></lucide-angular>
            Start Analysis
          </a>
        </div>

        <!-- Grid -->
        <div *ngIf="outfits.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <div *ngFor="let outfit of outfits; let i = index"
            class="group animate-fade-in"
            [style.animation-delay]="i * 60 + 'ms'">

            <!-- Image -->
            <div class="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
              <!-- Shimmer -->
              <div *ngIf="!outfit.base64Image" class="absolute inset-0 skeleton"></div>
              <img *ngIf="outfit.base64Image"
                [src]="outfit.base64Image" [alt]="outfit.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">

              <!-- Hover overlay -->
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <button (click)="buyNow(outfit.affiliate_link)"
                  class="btn-gold w-full text-[9px] py-3">
                  <lucide-angular [img]="LinkIcon" class="w-3.5 h-3.5"></lucide-angular>
                  Buy Now
                </button>
              </div>

              <!-- Brand pill -->
              <div class="absolute top-3 left-3 bg-white/95 px-2.5 py-1 text-[8px] uppercase tracking-widest text-black font-bold border border-[#E8E8E4]">
                {{ outfit.brand || 'Premium' }}
              </div>
            </div>

            <!-- Info -->
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
  `,
  styles: [`:host { display: block; }`]
})
export class RecommendationsComponent implements OnInit {
  private outfitService = inject(OutfitService);

  readonly RefreshIcon = RefreshCw;
  readonly LinkIcon = ExternalLink;
  readonly BagIcon = ShoppingBag;
  readonly SparklesIcon = Sparkles;

  outfits: any[] = [];
  skinTone = 'Your';

  ngOnInit() { this.loadRecommendations(); }

  loadRecommendations() {
    const data = localStorage.getItem('latest_recommendations');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.outfits = parsed.recommended_outfits || [];
        this.skinTone = parsed.skin_tone || 'Your';
        this.outfits.forEach(outfit => {
          if (outfit.blob_name && outfit.bucket_name) {
            this.outfitService.getBlobAsBase64(outfit.blob_name, outfit.bucket_name).subscribe({
              next: (b64) => outfit.base64Image = b64,
              error: () => outfit.base64Image = outfit.image_url || outfit.image || null
            });
          } else {
            outfit.base64Image = outfit.image_url || outfit.image || null;
          }
        });
      } catch { this.outfits = []; }
    }
  }

  buyNow(link: string) { if (link) window.open(link, '_blank'); }
}
