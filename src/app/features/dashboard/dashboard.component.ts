import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LucideAngularModule, Camera, Shirt, Star, ArrowRight, TrendingUp, ShieldCheck } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[#F7F7F5] pt-20">

      <!-- Hero Banner -->
      <div class="bg-black text-white py-14 sm:py-20 px-5 sm:px-8 relative overflow-hidden">
        <div class="absolute inset-0 opacity-[0.04]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:60px 60px"></div>
        <div class="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-[#D4AF37]/10 to-transparent pointer-events-none"></div>
        <div class="max-w-7xl mx-auto relative z-10">
          <p class="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-4">Your Showroom</p>
          <h1 class="text-3xl sm:text-4xl md:text-5xl luxury-font text-white">
            Welcome back,<br>
            <span class="text-[#D4AF37] italic">{{ userName }}</span>
          </h1>
          <p class="text-sm text-white/40 mt-4 font-light">Your personal AI stylist is ready.</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          <a routerLink="/upload" class="group bg-white border border-[#E8E8E4] p-7 hover:border-black hover:shadow-lg transition-all duration-300 animate-fade-in">
            <div class="flex items-start justify-between mb-6">
              <div class="w-12 h-12 bg-black flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
                <lucide-angular [img]="CameraIcon" class="w-5 h-5 text-white group-hover:text-black"></lucide-angular>
              </div>
              <lucide-angular [img]="ArrowIcon" class="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all"></lucide-angular>
            </div>
            <h3 class="text-base font-bold uppercase tracking-widest text-black mb-1.5">New Analysis</h3>
            <p class="text-sm text-gray-400 font-light">Upload a photo and get AI-powered outfit recommendations.</p>
          </a>

          <a routerLink="/recommendations" class="group bg-white border border-[#E8E8E4] p-7 hover:border-black hover:shadow-lg transition-all duration-300 animate-fade-in" style="animation-delay:80ms">
            <div class="flex items-start justify-between mb-6">
              <div class="w-12 h-12 bg-[#F7F7F5] border border-[#E8E8E4] flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-colors">
                <lucide-angular [img]="ShirtIcon" class="w-5 h-5 text-gray-600 group-hover:text-black"></lucide-angular>
              </div>
              <lucide-angular [img]="ArrowIcon" class="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all"></lucide-angular>
            </div>
            <h3 class="text-base font-bold uppercase tracking-widest text-black mb-1.5">My Looks</h3>
            <p class="text-sm text-gray-400 font-light">Browse your latest curated outfit recommendations.</p>
          </a>

          <div class="group bg-white border border-[#E8E8E4] p-7 animate-fade-in" style="animation-delay:160ms">
            <div class="flex items-start justify-between mb-6">
              <div class="w-12 h-12 bg-[#F7F7F5] border border-[#E8E8E4] flex items-center justify-center">
                <lucide-angular [img]="TrendingIcon" class="w-5 h-5 text-[#D4AF37]"></lucide-angular>
              </div>
            </div>
            <h3 class="text-base font-bold uppercase tracking-widest text-black mb-1.5">Style Score</h3>
            <p class="text-sm text-gray-400 font-light">Complete your first analysis to unlock your style score.</p>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <div *ngFor="let stat of stats; let i = index" class="bg-white border border-[#E8E8E4] p-5 animate-fade-in" [style.animation-delay]="i*60+'ms'">
            <p class="text-2xl sm:text-3xl font-black text-black">{{ stat.value }}</p>
            <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private authService = inject(AuthService);
  readonly CameraIcon = Camera;
  readonly ShirtIcon = Shirt;
  readonly StarIcon = Star;
  readonly ArrowIcon = ArrowRight;
  readonly TrendingIcon = TrendingUp;
  readonly ShieldIcon = ShieldCheck;

  get userName() {
    return this.authService.currentUser?.name || 'Fashionista';
  }

  stats = [
    { value: '0', label: 'Analyses Done' },
    { value: '500+', label: 'Outfit Catalog' },
    { value: '12', label: 'Skin Tones' },
    { value: '98%', label: 'Match Rate' }
  ];
}
