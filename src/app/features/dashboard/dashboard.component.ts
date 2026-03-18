import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OutfitService } from '../../core/services/outfit.service';
import { LucideAngularModule, Camera, Shirt, ArrowRight, TrendingUp, Sparkles, ShoppingBag, Zap, Heart, ShieldCheck, History, User } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[var(--surface)] pt-16 page-content">

      <!-- Premium Hero Greeting -->
      <div class="bg-[var(--brand-dark)] text-white relative overflow-hidden">
        <!-- Decoration background -->
        <div class="absolute inset-0 opacity-[0.03]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:60px 60px"></div>
        <div class="absolute right-0 top-0 h-full w-2/3" style="background: radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.15), transparent 70%)"></div>
        
        <div class="relative z-10 px-5 sm:px-8 pt-12 pb-10 max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div class="space-y-4">
              <div class="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/20 rounded-full px-4 py-2">
                <lucide-angular [img]="SparklesIcon" class="w-3.5 h-3.5 text-[#D4AF37]"></lucide-angular>
                <span class="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Stylist Active</span>
              </div>
              <h1 class="text-4xl sm:text-5xl lg:text-6xl luxury-font text-white leading-tight">
                Welcome,<br>
                <span class="text-[#D4AF37] italic">{{ userName }}</span>
              </h1>
              <p class="text-sm text-white/50 font-light max-w-xs leading-relaxed">Your personal showroom is updated with the latest trends matching your profile.</p>
            </div>

            <!-- Profile Overview (Latest Analysis) -->
            <div *ngIf="latestProfile" class="flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-[var(--radius-lg)] backdrop-blur-md animate-fade-in shadow-2xl">
              <div class="relative">
                <div class="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40">
                  <img [src]="latestProfile.photo_url" class="w-full h-full object-cover">
                </div>
                <div class="absolute -bottom-2 -right-2 bg-[#D4AF37] text-black w-7 h-7 rounded-lg flex items-center justify-center shadow-lg">
                  <lucide-angular [img]="SparklesIcon" class="w-3.5 h-3.5"></lucide-angular>
                </div>
              </div>
              <div class="space-y-1.5">
                <p class="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Detected Identity</p>
                <h3 class="text-xl font-bold text-white">{{ latestProfile.skin_tone }}</h3>
                <div class="flex gap-1.5 pt-1">
                  <div *ngFor="let o of (latestProfile.recommended_outfits || []).slice(0, 4)" class="w-3 h-3 rounded-full border border-white/20" [style.background]="o.color"></div>
                </div>
              </div>
            </div>

            <!-- Empty State Profile (Show registered avatar if no analysis yet) -->
            <div *ngIf="!latestProfile && !isLoading" class="hidden md:flex flex-col items-center gap-4 bg-white/5 border border-white/10 p-8 rounded-[var(--radius-lg)] text-center max-w-xs animate-fade-in">
              <div class="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                 <img *ngIf="user?.profile_image" [src]="user?.profile_image" class="w-full h-full object-cover">
                 <lucide-angular *ngIf="!user?.profile_image" [img]="UserIcon" class="w-6 h-6 text-white/20"></lucide-angular>
              </div>
              <div>
                <p class="text-xs font-bold text-white/80">Analysis Pending</p>
                <p class="text-[10px] text-white/40 mt-1 uppercase tracking-widest leading-relaxed">Complete your first analysis to unlock your palette</p>
              </div>
            </div>
          </div>

          <!-- Quick Actions Grid within Hero -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            <a routerLink="/upload" class="bg-[#D4AF37] text-black p-6 rounded-[var(--radius-md)] flex items-center justify-between hover:bg-white transition-all duration-500 group shadow-xl">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center group-hover:bg-black/5">
                  <lucide-angular [img]="CameraIcon" class="w-6 h-6"></lucide-angular>
                </div>
                <div class="text-left">
                  <p class="text-[11px] font-black uppercase tracking-widest">Start Analysis</p>
                  <p class="text-[10px] opacity-70 mt-0.5">Detect skin tone & undertones</p>
                </div>
              </div>
              <lucide-angular [img]="ArrowIcon" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></lucide-angular>
            </a>

            <a routerLink="/recommendations" class="bg-white/10 border border-white/10 text-white p-6 rounded-[var(--radius-md)] flex items-center justify-between hover:bg-white hover:text-black transition-all duration-500 group shadow-lg backdrop-blur-sm">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#D4AF37]/20">
                  <lucide-angular [img]="ShirtIcon" class="w-6 h-6 group-hover:text-[#D4AF37]"></lucide-angular>
                </div>
                <div class="text-left">
                  <p class="text-[11px] font-black uppercase tracking-widest text-[#D4AF37]">My Showroom</p>
                  <p class="text-[10px] opacity-50 mt-0.5">Explore your curated looks</p>
                </div>
              </div>
              <lucide-angular [img]="ArrowIcon" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></lucide-angular>
            </a>
          </div>
        </div>
      </div>

      <!-- Main Content Container -->
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-10 space-y-12">
        
        <!-- Stats Summary Section -->
        <section>
          <div class="flex items-center gap-4 mb-6">
            <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-[#A0A09B]">Performance Stats</h2>
            <div class="flex-1 h-px bg-[#EDEDE9]"></div>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div *ngFor="let stat of displayStats; let i = index" 
              class="bg-white border border-[#F0F0EE] p-6 rounded-[var(--radius-md)] shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
              [style.animation-delay]="i * 50 + 'ms'">
              <div class="flex items-center justify-between mb-2">
                <lucide-angular [img]="stat.icon" class="w-4 h-4 text-[#D4AF37]"></lucide-angular>
                <span class="text-[9px] font-black text-[#A0A09B] uppercase tracking-widest">{{ stat.label }}</span>
              </div>
              <p class="text-3xl font-black text-[var(--brand-dark)]">{{ stat.value }}</p>
            </div>
          </div>
        </section>

        <!-- Recommended For You Section -->
        <section *ngIf="latestProfile?.recommended_outfits?.length" class="animate-slide-up">
          <div class="flex items-center justify-between mb-6">
            <div>
              <p class="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-black mb-1">Tailored for you</p>
              <h2 class="text-2xl luxury-font text-[var(--brand-dark)]">Recommended Dresses</h2>
            </div>
            <a routerLink="/recommendations" class="text-[11px] font-black uppercase tracking-widest text-[#A0A09B] hover:text-[#D4AF37] transition-colors flex items-center gap-2">
              View All <lucide-angular [img]="ArrowIcon" class="w-3.5 h-3.5"></lucide-angular>
            </a>
          </div>

          <div class="flex gap-5 overflow-x-auto no-scrollbar pb-6 -mx-5 px-5 sm:mx-0 sm:px-0">
            <div *ngFor="let outfit of latestProfile.recommended_outfits.slice(0, 6)" 
              class="flex-shrink-0 w-64 group">
              <div class="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-[#EDEDE9] mb-4 group-hover:shadow-2xl transition-all duration-500">
                <img [src]="outfit.image_url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  <button (click)="buyNow(outfit.affiliate_link)" class="w-full bg-[#D4AF37] text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-white transition-all">Buy Now</button>
                </div>
                <div class="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-white/10">
                  <span class="w-2 h-2 rounded-full" [style.background]="outfit.color"></span>
                  {{ outfit.color }}
                </div>
              </div>
              <h3 class="text-xs font-black text-[var(--brand-dark)] uppercase tracking-wider line-clamp-1 mb-1">{{ outfit.name }}</h3>
              <p class="text-[10px] text-[#A0A09B] uppercase font-bold tracking-widest">{{ outfit.brand || 'Elite Series' }}</p>
            </div>
          </div>
        </section>

        <!-- Tool Cards (Secondary Actions) -->
        <section class="grid md:grid-cols-2 gap-6">
          <div class="bg-[var(--brand-gold-light)] border border-[#D4AF37]/20 rounded-[var(--radius-lg)] p-8 flex items-center gap-8 group hover:shadow-xl transition-all duration-500">
             <div class="w-20 h-20 bg-[#D4AF37] rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500">
                <lucide-angular [img]="ZapIcon" class="w-10 h-10 text-black"></lucide-angular>
             </div>
             <div>
                <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-2">Style Knowledge</h3>
                <h2 class="text-2xl luxury-font text-black mb-3">Skin Tone Tips</h2>
                <p class="text-sm text-black/50 leading-relaxed mb-5">Discover makeup shades and dress contrasts that elevate your look.</p>
                <button class="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read Guide <lucide-angular [img]="ArrowIcon" class="w-4 h-4"></lucide-angular>
                </button>
             </div>
          </div>

          <div class="bg-white border border-[#EDEDE9] rounded-[var(--radius-lg)] p-8 flex items-center gap-8 group hover:shadow-xl transition-all duration-500">
             <div class="w-20 h-20 bg-[#1A1A1A] rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500">
                <lucide-angular [img]="TrendingIcon" class="w-10 h-10 text-[#D4AF37]"></lucide-angular>
             </div>
             <div>
                <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-[#A0A09B] mb-2">Editor's Pick</h3>
                <h2 class="text-2xl luxury-font text-black mb-3">Today's Trends</h2>
                <p class="text-sm text-[#A0A09B] leading-relaxed mb-5">See what's trending globally across our curated fashion partners.</p>
                <button [routerLink]="['/recommendations']" class="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 group-hover:gap-3 transition-all">
                  Explore Now <lucide-angular [img]="ArrowIcon" class="w-4 h-4"></lucide-angular>
                </button>
             </div>
          </div>
        </section>

      </div>
    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes float {
      0% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }
    .animate-float { animation: float 3s ease-in-out infinite; }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private outfitService = inject(OutfitService);

  readonly CameraIcon = Camera;
  readonly ShirtIcon = Shirt;
  readonly ArrowIcon = ArrowRight;
  readonly TrendingIcon = TrendingUp;
  readonly SparklesIcon = Sparkles;
  readonly BagIcon = ShoppingBag;
  readonly ZapIcon = Zap;
  readonly HeartIcon = Heart;
  readonly ShieldIcon = ShieldCheck;
  readonly HistoryIcon = History;
  readonly UserIcon = User;

  latestProfile: any = null;
  userStats: any = null;
  isLoading = true;

  displayStats = [
    { label: 'Analyses', value: '0', icon: History },
    { label: 'catalog', value: '500+', icon: ShoppingBag },
    { label: 'Profiles', value: '1', icon: User },
    { label: 'Accuracy', value: '98%', icon: Sparkles }
  ];

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Fetch stats
    this.outfitService.getUserStats().subscribe({
      next: (stats) => {
        this.userStats = stats;
        this.displayStats[0].value = stats.total_analyses.toString();
        this.displayStats[2].value = stats.unique_tones.toString();
      }
    });

    // Fetch latest analysis
    this.outfitService.getLatestRecommendation().subscribe({
      next: (profile) => {
        this.latestProfile = profile;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  get user() {
    return this.authService.currentUser;
  }

  get userName() {
    return this.user?.name || 'Fashionista';
  }

  buyNow(url: string) {
    if (url) window.open(url, '_blank');
  }
}
