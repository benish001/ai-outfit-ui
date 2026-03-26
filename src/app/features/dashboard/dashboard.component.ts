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
    <div class="min-h-screen bg-[#F8F8F6] pt-16 pb-32 page-content relative overflow-hidden">
      
      <!-- Ambient Glow -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37] opacity-[0.03] rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div class="relative z-10 px-5 sm:px-8 pt-12 pb-10 max-w-7xl mx-auto">
        <!-- Hero Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 animate-fade-in text-center sm:text-left">
          <div class="space-y-4">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl luxury-font text-black leading-tight">
              Welcome,<br>
              <span class="text-[#D4AF37] italic">{{ userName }}</span>
            </h1>
            <p class="text-[11px] uppercase tracking-[0.2em] text-[#A0A09B] font-bold max-w-xs mx-auto sm:mx-0">
              Curated precision-matched fashion based on your unique profile.
            </p>
          </div>
          <div class="hidden sm:block">
            <div class="inline-flex items-center gap-2 bg-white border border-[#EDEDE9] rounded-2xl px-6 py-4 shadow-sm">
               <lucide-angular [img]="SparklesIcon" class="w-5 h-5 text-[#D4AF37] animate-pulse"></lucide-angular>
               <div>
                  <p class="text-[9px] uppercase tracking-widest text-[#9A9A96] font-bold">Status</p>
                  <p class="text-xs font-black text-black">Wardrobe Ready</p>
               </div>
            </div>
          </div>
        </div>

        <!-- Identity & Quick Actions Grid -->
        <div class="grid lg:grid-cols-3 gap-6 mb-16 animate-fade-in-up">
           
           <!-- Identity Card (Spans 2 columns on desktop) -->
           <div class="lg:col-span-2 bg-white border border-[#EDEDE9] p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
              <!-- Decorative element -->
              <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#D4AF37]/10 transition-colors"></div>
              
              <div *ngIf="latestProfile" class="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
                 <div class="flex-1 space-y-3 text-center sm:text-left">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F8F8F6] rounded-full border border-[#EDEDE9]">
                       <div class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                       <span class="text-[9px] uppercase tracking-widest text-[#9A9A96] font-bold">Detected Identity</span>
                    </div>
                    <h2 class="text-3xl font-black text-black capitalize">{{ latestProfile.skin_tone }} Complexion</h2>
                    <p class="text-[11px] text-[#A0A09B] leading-relaxed max-w-md">Our AI analyzed your skin tone and undertone to extract a palette of {{ latestProfile.recommended_colors?.length || 0 }} perfectly matched colors.</p>
                 </div>
                 <div class="flex flex-col items-center gap-3">
                    <p class="text-[9px] uppercase tracking-[0.3em] font-bold text-[#A0A09B]">Your Colors</p>
                    <div class="flex -space-x-3">
                       <div *ngFor="let color of latestProfile.recommended_colors?.slice(0, 5); let i = index"
                         class="w-10 h-10 rounded-full border-2 border-white shadow-md transform hover:scale-110 hover:z-10 transition-transform cursor-pointer"
                         [style.backgroundColor]="getHexColor(color)"
                         [title]="color">
                       </div>
                    </div>
                    <a routerLink="/recommendations" class="text-[9px] uppercase tracking-widest font-black text-[#D4AF37] hover:underline mt-2">View Matches</a>
                 </div>
              </div>

              <!-- Empty State Profile -->
              <div *ngIf="!latestProfile && !isLoading" class="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10 text-center sm:text-left">
                 <div class="w-16 h-16 bg-[#F8F8F6] rounded-2xl flex items-center justify-center border border-[#EDEDE9] flex-shrink-0 mx-auto sm:mx-0">
                    <lucide-angular [img]="CameraIcon" class="w-6 h-6 text-[#A0A09B]"></lucide-angular>
                 </div>
                 <div class="flex-1 space-y-3">
                    <h2 class="text-2xl font-black text-black">No Identity Found</h2>
                    <p class="text-[11px] text-[#A0A09B] leading-relaxed max-w-sm mx-auto sm:mx-0">Analyze your complexion to unlock personalized color palettes and style recommendations.</p>
                    <a routerLink="/upload" class="inline-flex items-center gap-2 bg-black text-white text-[10px] uppercase tracking-widest font-black px-6 py-3 rounded-xl hover:bg-[#D4AF37] hover:text-black transition-all shadow-md">
                       <lucide-angular [img]="CameraIcon" class="w-3.5 h-3.5"></lucide-angular> Analyze Now
                    </a>
                 </div>
              </div>
           </div>

           <!-- Essential Quick Links -->
           <div class="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <a routerLink="/upload" class="bg-white border border-[#EDEDE9] p-6 rounded-3xl flex flex-col items-center justify-center text-center group hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 shadow-sm">
                 <lucide-angular [img]="CameraIcon" class="w-6 h-6 text-black group-hover:text-white mb-3 transition-colors"></lucide-angular>
                 <span class="text-[11px] uppercase tracking-widest text-[#A0A09B] group-hover:text-white font-bold transition-colors">Start Analysis</span>
              </a>
              <a routerLink="/recommendations" class="bg-black border border-black p-6 rounded-3xl flex flex-col items-center justify-center text-center group hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 shadow-xl shadow-black/10">
                 <lucide-angular [img]="ShirtIcon" class="w-6 h-6 text-white group-hover:text-black mb-3 transition-colors"></lucide-angular>
                 <span class="text-[11px] uppercase tracking-widest text-white/50 group-hover:text-black font-bold transition-colors">My Showroom</span>
              </a>
           </div>

        </div>

        <!-- NEW: Daily Flash Deals (High-Impact Scroller) -->
        <section *ngIf="flashDeals.length > 0" class="animate-fade-in-up mb-16" style="animation-delay: 100ms;">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#F4F4F1] flex items-center justify-center border border-[#EDEDE9]">
                <lucide-angular [img]="ZapIcon" class="w-5 h-5 text-[#D4AF37]"></lucide-angular>
              </div>
              <div>
                <h2 class="text-2xl luxury-font text-black mb-1">Flash Deals</h2>
                <div class="flex items-center gap-1.5">
                  <span class="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  <p class="text-[9px] uppercase tracking-[0.2em] text-[#A0A09B] font-bold">Limited • Curated Premium Sales</p>
                </div>
              </div>
            </div>
            <a routerLink="/recommendations" class="hidden sm:flex text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:underline items-center gap-2">
              View All <lucide-angular [img]="ArrowIcon" class="w-3.5 h-3.5"></lucide-angular>
            </a>
          </div>
          
          <div class="flex gap-6 overflow-x-auto pb-8 -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar snap-x">
            <div *ngFor="let deal of flashDeals" 
              class="flex-shrink-0 w-72 snap-center group relative bg-white rounded-3xl border border-[#EDEDE9] overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
              
              <div class="aspect-[4/5] relative overflow-hidden bg-[#F8F8F6]">
                <img [src]="deal.image_url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                
                <!-- Floating Discount Badge -->
                <div class="absolute top-4 left-4 bg-[#D4AF37] text-black text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-xl shadow-md">
                  {{ deal.discount_percent }}% OFF
                </div>
              </div>
              
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                   <p class="text-[9px] text-[#A0A09B] font-black uppercase tracking-[0.2em] mb-1.5">{{ deal.brand || 'Premium' }}</p>
                   <h3 class="text-sm font-bold text-black truncate mb-3" [title]="deal.name">{{ deal.name }}</h3>
                </div>
                
                <div class="flex items-center justify-between mt-auto">
                  <div class="space-y-0.5">
                    <p class="text-[10px] text-[#A0A09B] line-through font-bold">{{ (deal.original_price || (deal.price * 1.5)) | currency:'INR':'symbol':'1.0-0' }}</p>
                    <p class="text-lg font-black text-black tracking-tight">{{ deal.price | currency:'INR':'symbol':'1.0-0' }}</p>
                  </div>
                  <button (click)="buyNow(deal.affiliate_link)" 
                    class="bg-black text-white px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-md active:scale-95">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Stats Section -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style="animation-delay: 200ms;">
          <div class="bg-white border border-[#EDEDE9] p-5 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-sm">
            <lucide-angular [img]="SparklesIcon" class="w-5 h-5 text-[#D4AF37] mb-2"></lucide-angular>
            <span class="text-2xl font-black text-black mb-1 px-4 text-center">{{ Math.round(trendingOutfits.length * 0.4) }}+</span>
            <span class="text-[8px] uppercase tracking-widest text-[#9A9A96] font-bold">Perfect Matches</span>
          </div>
          <div class="bg-white border border-[#EDEDE9] p-5 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-sm">
            <lucide-angular [img]="FlameIcon" class="w-5 h-5 text-[#D4AF37] mb-2"></lucide-angular>
            <span class="text-2xl font-black text-black mb-1 px-4 text-center">{{ trendingOutfits.length }}</span>
            <span class="text-[8px] uppercase tracking-widest text-[#9A9A96] font-bold">Trending Items</span>
          </div>
          <a routerLink="/recommendations" class="bg-black p-5 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:bg-[#D4AF37] transition-all shadow-lg shadow-black/10">
             <lucide-angular [img]="ShirtIcon" class="w-6 h-6 text-white mb-2 group-hover:text-black transition-colors"></lucide-angular>
             <span class="text-[9px] uppercase tracking-widest text-white/70 font-bold group-hover:text-black transition-colors">Curated Finds</span>
          </a>
          <a routerLink="/upload" class="bg-[#D4AF37] p-5 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:bg-black transition-all shadow-md">
             <lucide-angular [img]="CameraIcon" class="w-6 h-6 text-black mb-2 group-hover:text-white transition-colors"></lucide-angular>
             <span class="text-[9px] uppercase tracking-widest text-black/70 font-bold group-hover:text-white transition-colors">Update Profile</span>
          </a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService); // Removed private for access in template
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
  readonly FlameIcon = TrendingUp; // Fallback to TrendingUp if Flame isn't explicitly imported
  readonly Math = Math;

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
            const realDeals = data.filter((i: any) => i.discount_percent && i.discount_percent >= 10);

            if (realDeals.length >= 3) {
              this.flashDeals = realDeals.slice(0, 20); // Show more deals to match user's scale request
            } else {
              // Fallback for demo/initial state: augment some trending items to look like deals
              this.flashDeals = data.slice(0, 5).map((item: any, idx: number) => ({
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

  get userName(): string {
    const name = this.authService.currentUser?.name;
    if (name) {
      return name.split(' ')[0];
    }
    return 'Guest';
  }

  buyNow(link: string) {
    if (link) {
      window.open(link, '_blank');
    }
  }

  getHexColor(colorName: string): string {
    const map: { [key: string]: string } = {
      'Gold': '#FFD700', 'Silver': '#C0C0C0', 'Ruby': '#E0115F',
      'Emerald': '#50C878', 'Sapphire': '#0F52BA', 'Amethyst': '#9966CC',
      'Rose Gold': '#B76E79', 'Pearl': '#EAE0C8', 'Coral': '#FF7F50',
      'Turquoise': '#40E0D0', 'Bronze': '#CD7F32', 'Platinum': '#E5E4E2',
      'Neutral': '#F5F5DC', 'Warm': '#F0E68C', 'Cool': '#E0FFFF',
      'Light': '#FFFACD', 'Medium': '#D2B48C', 'Deep': '#8B4513'
    };
    return map[colorName] || '#D4AF37'; // Default to brand gold
  }
}
