import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule, Camera, Shirt, ArrowRight, TrendingUp, Sparkles, ShoppingBag, Zap } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[#F8F8F6] pt-16 page-content">

      <!-- Hero Greeting Card -->
      <div class="bg-black text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-[0.04]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:40px 40px"></div>
        <div class="absolute right-0 top-0 h-full w-1/2" style="background: radial-gradient(ellipse at right, rgba(212,175,55,0.12), transparent 70%)"></div>
        
        <div class="relative z-10 px-5 sm:px-8 pt-10 pb-8 max-w-7xl mx-auto">
          <div class="flex items-start justify-between">
            <div class="space-y-3">
              <div class="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full px-3 py-1.5">
                <div class="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></div>
                <span class="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Your Showroom</span>
              </div>
              <h1 class="text-3xl sm:text-4xl luxury-font text-white">
                Welcome,<br>
                <span class="text-[#D4AF37] italic">{{ userName }}</span>
              </h1>
              <p class="text-sm text-white/40 font-light">Your personal AI stylist is ready.</p>
            </div>
            <!-- Skin tone preview -->
            <div class="hidden sm:flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-4">
              <p class="text-[9px] uppercase tracking-widest text-white/40">Palette</p>
              <div class="flex gap-2">
                <div class="w-6 h-6 rounded-full bg-[#C68642] border-2 border-white/20"></div>
                <div class="w-6 h-6 rounded-full bg-[#8D5524] border-2 border-white/20"></div>
                <div class="w-6 h-6 rounded-full bg-[#E0AC69] border-2 border-white/20"></div>
              </div>
            </div>
          </div>

          <!-- Quick Start CTA -->
          <a routerLink="/upload" class="mt-8 flex items-center justify-between w-full bg-[#D4AF37] text-black rounded-2xl px-6 py-4 font-bold hover:bg-white transition-all duration-300 group">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                <lucide-angular [img]="CameraIcon" class="w-5 h-5 text-[#D4AF37] group-hover:text-black transition-colors"></lucide-angular>
              </div>
              <div class="text-left">
                <p class="text-[11px] uppercase tracking-widest font-black">Start New Analysis</p>
                <p class="text-[10px] font-normal opacity-70 mt-0.5">Upload a photo to get started</p>
              </div>
            </div>
            <lucide-angular [img]="ArrowIcon" class="w-5 h-5"></lucide-angular>
          </a>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div *ngFor="let stat of stats; let i = index"
            class="bg-white rounded-2xl border border-[#EDEDE9] p-5 animate-fade-in"
            [style.animation-delay]="i * 60 + 'ms'">
            <p class="text-2xl sm:text-3xl font-black text-black">{{ stat.value }}</p>
            <p class="text-[9px] uppercase tracking-widest text-[#9A9A96] mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="max-w-7xl mx-auto px-5 sm:px-8 pb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold uppercase tracking-widest text-black">Quick Actions</h2>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <a routerLink="/upload"
            class="group bg-white border border-[#EDEDE9] rounded-2xl p-5 hover:border-black hover:shadow-lg transition-all duration-300 animate-fade-in">
            <div class="flex items-start justify-between mb-4">
              <div class="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                <lucide-angular [img]="CameraIcon" class="w-5 h-5 text-white group-hover:text-black transition-colors"></lucide-angular>
              </div>
              <lucide-angular [img]="ArrowIcon" class="w-4 h-4 text-gray-200 group-hover:text-black group-hover:translate-x-1 transition-all"></lucide-angular>
            </div>
            <h3 class="text-sm font-bold uppercase tracking-wider text-black">Analyze</h3>
            <p class="text-[10px] text-[#9A9A96] mt-1 leading-relaxed">Get AI outfit recommendations</p>
          </a>

          <a routerLink="/recommendations"
            class="group bg-white border border-[#EDEDE9] rounded-2xl p-5 hover:border-black hover:shadow-lg transition-all duration-300 animate-fade-in" style="animation-delay:80ms">
            <div class="flex items-start justify-between mb-4">
              <div class="w-10 h-10 bg-[#F9F3E3] rounded-xl flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                <lucide-angular [img]="SparklesIcon" class="w-5 h-5 text-[#D4AF37] group-hover:text-black transition-colors"></lucide-angular>
              </div>
              <lucide-angular [img]="ArrowIcon" class="w-4 h-4 text-gray-200 group-hover:text-black group-hover:translate-x-1 transition-all"></lucide-angular>
            </div>
            <h3 class="text-sm font-bold uppercase tracking-wider text-black">My Looks</h3>
            <p class="text-[10px] text-[#9A9A96] mt-1 leading-relaxed">Browse your curated outfits</p>
          </a>

          <div class="col-span-2 bg-[#F9F3E3] border border-[#D4AF37]/20 rounded-2xl p-5 animate-fade-in" style="animation-delay:160ms">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                  <lucide-angular [img]="ZapIcon" class="w-5 h-5 text-black"></lucide-angular>
                </div>
                <div>
                  <h3 class="text-sm font-bold uppercase tracking-wider text-black">Pro Tip</h3>
                  <p class="text-[10px] text-[#9A9A96] mt-0.5 max-w-xs leading-relaxed">Use natural daylight photos for the most accurate skin tone analysis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trending Categories -->
      <div class="max-w-7xl mx-auto px-5 sm:px-8 pb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold uppercase tracking-widest text-black">Explore Categories</h2>
        </div>
        <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          <a *ngFor="let cat of categories" [routerLink]="['/recommendations']"
            class="flex-shrink-0 flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-[#EDEDE9] hover:border-black transition-all duration-300 min-w-[80px]">
            <span class="text-2xl">{{ cat.emoji }}</span>
            <span class="text-[10px] font-semibold uppercase tracking-wider text-center">{{ cat.name }}</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private authService = inject(AuthService);
  readonly CameraIcon = Camera;
  readonly ShirtIcon = Shirt;
  readonly ArrowIcon = ArrowRight;
  readonly TrendingIcon = TrendingUp;
  readonly SparklesIcon = Sparkles;
  readonly BagIcon = ShoppingBag;
  readonly ZapIcon = Zap;

  get userName() {
    return this.authService.currentUser?.name || 'Fashionista';
  }

  stats = [
    { value: '0', label: 'Analyses Done' },
    { value: '500+', label: 'Outfit Catalog' },
    { value: '12', label: 'Skin Tones' },
    { value: '98%', label: 'Match Rate' }
  ];

  categories = [
    { emoji: '👗', name: 'Dresses' },
    { emoji: '👟', name: 'Shoes' },
    { emoji: '👜', name: 'Bags' },
    { emoji: '🧥', name: 'Jackets' },
    { emoji: '💄', name: 'Beauty' },
    { emoji: '🏋️', name: 'Gym' },
  ];
}
