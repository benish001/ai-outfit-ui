import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OutfitService } from '../../core/services/outfit.service';
import { LucideAngularModule, Camera, Shirt, ArrowRight, TrendingUp, Sparkles, ShoppingBag, Zap, Heart, ShieldCheck, History, User, Clock, Star } from 'lucide-angular';

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
              <div class="space-y-1.5">
                <p class="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Detected Identity</p>
                <h3 class="text-xl font-bold text-white">{{ latestProfile.skin_tone }}</h3>
                <div class="flex gap-1.5 pt-1">
                  <div *ngFor="let color of getSkinTonePalette(latestProfile)" 
                    class="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm transition-transform hover:scale-110" 
                    [style.background]="color"
                    [title]="color"></div>
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
        
        <!-- NEW: Daily Flash Deals (High-Impact Scroller) -->
        <section *ngIf="flashDeals.length > 0" class="animate-slide-up">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center shadow-lg shadow-rose-200">
                <lucide-angular [img]="ClockIcon" class="w-6 h-6 text-white animate-pulse"></lucide-angular>
              </div>
              <div>
                <h2 class="text-2xl luxury-font text-black mb-1">Flash Deals</h2>
                <div class="flex items-center gap-2">
                  <span class="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <p class="text-[10px] uppercase tracking-[0.2em] text-red-500 font-black">Limited Time Offers • 08h 24m</p>
                </div>
              </div>
            </div>
            <a routerLink="/recommendations" class="hidden sm:flex text-[11px] font-black uppercase tracking-widest text-[#A0A09B] hover:text-black transition-colors items-center gap-2">
              View All Deals <lucide-angular [img]="ArrowIcon" class="w-3.5 h-3.5"></lucide-angular>
            </a>
          </div>
          
          <div class="flex gap-6 overflow-x-auto pb-8 -mx-5 px-5 no-scrollbar snap-x">
            <div *ngFor="let deal of flashDeals" 
              class="flex-shrink-0 w-72 snap-center group relative bg-white rounded-3xl border border-[#EDEDE9] overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              
              <div class="aspect-[4/5] relative overflow-hidden bg-[#F8F8F6]">
                <img [src]="deal.image_url" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                
                <!-- Floating Discount Badge -->
                <div class="absolute top-4 left-4 bg-red-600 text-white text-[11px] font-black px-3 py-2 rounded-xl shadow-xl border border-white/20 transform -rotate-1">
                  {{ deal.discount_percent }}% OFF
                </div>

                <!-- Star Rating Badge -->
                <div *ngIf="deal.rating" class="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/20 shadow-lg group-hover:bg-white transition-colors">
                  <lucide-angular [img]="StarIcon" class="w-3 h-3 text-orange-400 fill-orange-400"></lucide-angular>
                  <span class="text-[10px] font-black text-black">{{ deal.rating }}</span>
                </div>
                
                <!-- Deal Type Badge -->
                <div class="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 flex items-center justify-between group-hover:bg-black/60 transition-colors">
                  <span class="text-[9px] text-white font-black uppercase tracking-[0.2em]">Flash Offer</span>
                  <div class="flex gap-1">
                     <span class="w-1 h-3 rounded-full bg-red-500"></span>
                     <span class="w-1 h-3 rounded-full bg-red-500/40"></span>
                     <span class="w-1 h-3 rounded-full bg-red-500/20"></span>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                   <p class="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.2em]">{{ deal.brand || 'Premium' }}</p>
                   <p *ngIf="deal.review_count" class="text-[9px] text-[#9A9A96] font-bold">{{ deal.review_count | number:'1.0-0' }} reviews</p>
                </div>
                <h3 class="text-xs font-bold text-black truncate mb-4">{{ deal.name }}</h3>
                
                <div class="flex items-center justify-between">
                  <div class="space-y-1">
                    <p class="text-xs text-[#9A9A96] line-through font-medium">{{ (deal.original_price || (deal.price * 1.5)) | currency:'INR':'symbol':'1.0-0' }}</p>
                    <p class="text-xl font-black text-black tracking-tight">{{ deal.price | currency:'INR':'symbol':'1.0-0' }}</p>
                  </div>
                  <button (click)="buyNow(deal.affiliate_link)" 
                    class="bg-black text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-xl shadow-black/5 active:scale-95">
                    Buy Now
                  </button>
                </div>
              </div>
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
  readonly ClockIcon = Clock;
  readonly StarIcon = Star;

  latestProfile: any = null;
  flashDeals: any[] = [];
  trendingOutfits: any[] = [];
  isLoading = true;

  ngOnInit() {
    // One-time clear to ensure metadata fixes (Saree) are reflected immediately
    const fixApplied = localStorage.getItem('metadata_fix_v2');
    if (!fixApplied) {
      localStorage.removeItem('latest_recommendations');
      localStorage.setItem('metadata_fix_v2', 'true');
    }
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;


    // Fetch latest analysis
    this.outfitService.getLatestRecommendation().subscribe({
      next: (profile) => {
        this.latestProfile = profile;
        const gender = profile?.gender;

        // Fetch trending items for specific gender to populate deals
        this.outfitService.getTrendingOutfits(0, 15, gender).subscribe({
          next: (data) => {
            this.trendingOutfits = data;
            // Identify Flash Deals (items with discounts)
            const realDeals = data.filter(i => i.discount_percent && i.discount_percent >= 10);

            if (realDeals.length >= 3) {
              this.flashDeals = realDeals.slice(0, 20); // Show more deals to match user's scale request
            } else {
              // Fallback for demo/initial state: augment some trending items to look like deals
              this.flashDeals = data.slice(0, 5).map((item, idx) => ({
                ...item,
                discount_percent: [25, 40, 15, 30, 50][idx % 5],
                original_price: Math.round(item.price * (1 + [0.25, 0.40, 0.15, 0.30, 0.50][idx % 5])),
                rating: (4 + Math.random()).toFixed(1),
                review_count: Math.floor(Math.random() * 2000) + 500,
                is_deal: "Deal of the Day"
              }));
            }
          }
        });

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

  getBadgeColor(colorStr: string): string {
    if (!colorStr) return 'transparent';
    if (colorStr.includes('&')) {
      const colors = colorStr.split('&').map(c => c.trim().toLowerCase().replace(' ', ''));
      return `linear-gradient(to right, ${colors[0]}, ${colors[1] || colors[0]})`;
    }
    return colorStr.toLowerCase().replace(' ', '');
  }

  getSkinTonePalette(profile: any): string[] {
    if (!profile) return [];

    const tone = (profile.skin_tone || 'Medium').toLowerCase();

    // Define professional skin tone gradients for a luxury feel
    if (tone.includes('fair') || tone.includes('light')) {
      return ['#F9E4D4', '#F3D1BB', '#E7BDA2']; // Light Cream to Peach
    } else if (tone.includes('medium') || tone.includes('tan')) {
      return ['#D2B48C', '#BC8F8F', '#A0522D']; // Tan to Sienna
    } else if (tone.includes('deep') || tone.includes('dark')) {
      return ['#704139', '#532F29', '#3D221E']; // Warm Brown to Ebony
    } else {
      // Default / Warm Neutral
      return ['#E5C29B', '#D4A373', '#9C6644'];
    }
  }
}
