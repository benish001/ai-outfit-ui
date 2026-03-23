import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Camera, Sparkles, ShoppingBag, ArrowRight, Star, Zap, Check } from 'lucide-angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <!-- HERO -->
    <section class="min-h-screen flex flex-col justify-center pt-16 bg-white relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06]" style="background: radial-gradient(circle, #D4AF37, transparent 70%); transform: translate(30%, -30%);"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04]" style="background: radial-gradient(circle, #D4AF37, transparent 70%); transform: translate(-30%, 30%);"></div>

      <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-20 w-full">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <!-- Left copy -->
          <div class="space-y-8 animate-fade-in">
            <!-- Label chip -->
            <div class="inline-flex items-center gap-2 bg-[#F9F3E3] border border-[#D4AF37]/30 rounded-full px-4 py-2">
              <lucide-angular [img]="SparklesIcon" class="w-3.5 h-3.5 text-[#D4AF37]"></lucide-angular>
              <span class="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-bold">AI-Powered Style</span>
            </div>

            <h1 class="text-5xl sm:text-6xl lg:text-7xl luxury-font text-black leading-[1.05]">
              Dress for<br>
              <span class="text-[#D4AF37] italic">Your Skin.</span>
            </h1>

            <p class="text-base text-[#9A9A96] max-w-md leading-relaxed font-light">
              Upload your photo, let AI analyze your skin tone, and discover outfits curated specifically for you — with direct buy links.
            </p>

            <!-- CTAs with premium feel -->
            <div class="flex flex-wrap gap-4 pt-4">
              <a routerLink="/register" class="group relative px-8 py-4 bg-black text-white rounded-2xl text-[11px] uppercase tracking-[0.3em] font-black overflow-hidden transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1">
                <span class="relative z-10 flex items-center gap-3">
                  Get Started Free
                  <lucide-angular [img]="ArrowIcon" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></lucide-angular>
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-[var(--brand-gold)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </a>
              <a routerLink="/login" class="px-8 py-4 border border-[#EDEDE9] text-black rounded-2xl text-[11px] uppercase tracking-[0.3em] font-black hover:border-black transition-all">Sign In</a>
            </div>

            <!-- Stats with Glassmorphism -->
            <div class="grid grid-cols-3 gap-4 pt-8 border-t border-[#EDEDE9]">
              <div *ngFor="let stat of stats" class="bg-white/40 backdrop-blur-md border border-[#EDEDE9] p-4 rounded-2xl hover:border-[var(--brand-gold)] transition-colors group">
                <p class="text-2xl font-black text-black group-hover:text-[var(--brand-gold)] transition-colors">{{ stat.value }}</p>
                <p class="text-[9px] uppercase tracking-widest text-[#9A9A96] mt-0.5">{{ stat.label }}</p>
              </div>
            </div>
          </div>

          <!-- Right: AI card visual -->
          <div class="relative flex items-center justify-center animate-slide-up">
            <div class="relative w-full max-w-xs mx-auto">
              <!-- Main phone mockup card -->
              <div class="bg-white border border-[#EDEDE9] rounded-3xl shadow-2xl overflow-hidden">
                <!-- App header -->
                <div class="bg-black px-6 py-5 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                      <lucide-angular [img]="SparklesIcon" class="w-3 h-3 text-black"></lucide-angular>
                    </div>
                    <span class="text-white text-xs font-black tracking-widest">SKINTONE AI</span>
                  </div>
                  <div class="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <lucide-angular [img]="BagIcon" class="w-3 h-3 text-white"></lucide-angular>
                  </div>
                </div>

                <!-- Upload zone -->
                <div class="p-6 bg-[#F8F8F6]">
                  <div class="aspect-[4/5] bg-white rounded-2xl border-2 border-dashed border-[#EDEDE9] flex flex-col items-center justify-center space-y-4">
                    <div class="w-16 h-16 bg-[#F9F3E3] rounded-2xl flex items-center justify-center animate-float">
                      <lucide-angular [img]="CameraIcon" class="w-7 h-7 text-[#D4AF37]"></lucide-angular>
                    </div>
                    <div class="text-center px-4">
                      <p class="text-xs font-bold text-black">Upload Photo</p>
                      <p class="text-[10px] text-[#9A9A96] mt-1">Tap to start analysis</p>
                    </div>
                  </div>
                </div>

                <!-- Result card -->
                <div class="px-6 pb-6">
                  <div class="bg-black rounded-2xl px-4 py-4 flex items-center justify-between">
                    <div>
                      <p class="text-[9px] text-white/40 uppercase tracking-widest">Skin Tone</p>
                      <p class="text-sm font-bold text-white mt-0.5">Warm Medium</p>
                    </div>
                    <div class="flex gap-1.5">
                      <div class="w-5 h-5 rounded-full bg-[#C68642] border-2 border-white/20"></div>
                      <div class="w-5 h-5 rounded-full bg-[#E0AC69] border-2 border-white/20"></div>
                      <div class="w-5 h-5 rounded-full bg-[#8D5524] border-2 border-white/20"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Floating badge -->
              <div class="absolute -top-4 -right-4 bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black shadow-lg">
                AI Powered ✦
              </div>

              <!-- Floating "20 matches" badge -->
              <div class="absolute -bottom-6 -right-5 bg-white border border-[#EDEDE9] rounded-2xl shadow-xl p-4 scale-90 sm:scale-100">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#F9F3E3] flex items-center justify-center">
                    <lucide-angular [img]="ZapIcon" class="w-5 h-5 text-[#D4AF37]"></lucide-angular>
                  </div>
                  <div>
                    <p class="text-xs font-black text-black">20 Matches</p>
                    <p class="text-[9px] text-[#9A9A96]">Found for your tone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="py-20 sm:py-32 bg-[#F8F8F6]">
      <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div class="text-center space-y-3 mb-16">
          <div class="inline-flex items-center gap-2 bg-white border border-[#EDEDE9] rounded-full px-4 py-2">
            <span class="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">How It Works</span>
          </div>
          <h2 class="text-3xl sm:text-4xl luxury-font text-black">Three Steps to Perfect Style</h2>
        </div>
        <div class="grid sm:grid-cols-3 gap-8">
          <div *ngFor="let step of steps; let i = index"
            class="group bg-white rounded-[32px] border border-[#EDEDE9] p-10 space-y-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-in"
            [style.animation-delay]="i * 100 + 'ms'">
            <div class="w-14 h-14 bg-[#F8F8F6] rounded-2xl flex items-center justify-center transition-colors group-hover:bg-black">
              <lucide-angular [img]="step.icon" class="w-6 h-6 text-[#D4AF37] transition-colors group-hover:text-white"></lucide-angular>
            </div>
            <div class="space-y-3">
              <h3 class="luxury-font text-2xl text-black">{{ step.title }}</h3>
              <p class="text-sm text-[#9A9A96] leading-relaxed font-light">{{ step.desc }}</p>
            </div>
            <div class="pt-4 flex items-center gap-2 text-[9px] uppercase tracking-widest font-black text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Explore Step</span>
              <lucide-angular [img]="ArrowIcon" class="w-3 h-3"></lucide-angular>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES STRIP -->
    <section class="py-10 bg-white overflow-hidden">
      <div class="flex gap-4 animate-marquee whitespace-nowrap">
        <span *ngFor="let cat of categories.concat(categories)" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F8F8F6] border border-[#EDEDE9] text-[11px] font-semibold uppercase tracking-widest text-black flex-shrink-0">
          {{ cat }}
        </span>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section class="py-20 sm:py-32 bg-[var(--brand-dark)] relative overflow-hidden">
      <div class="absolute inset-0 opacity-[0.04]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:40px 40px"></div>
      <div class="absolute top-1/2 left-1/2 w-96 h-96 rounded-full -translate-x-1/2 -translate-y-1/2" style="background: radial-gradient(circle, rgba(212,175,55,0.15), transparent 70%)"></div>
      <div class="max-w-3xl mx-auto px-5 text-center space-y-8 relative z-10">
        <h2 class="text-3xl sm:text-5xl luxury-font text-white">Ready to Find Your<br><span class="text-[var(--brand-gold)] italic">Perfect Look?</span></h2>
        <p class="text-[var(--muted)] text-sm font-light">Join thousands of fashion-forward individuals using AI to elevate their style.</p>
        <a routerLink="/register" class="btn-gold inline-flex group">
          Start for Free
          <lucide-angular [img]="ArrowIcon" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></lucide-angular>
        </a>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-[var(--brand-dark)] border-t border-white/5 py-12 px-5 text-center">
      <div class="flex items-center justify-center gap-2 mb-4">
        <div class="w-8 h-8 bg-[var(--brand-gold)] rounded-xl flex items-center justify-center">
          <lucide-angular [img]="SparklesIcon" class="w-4 h-4 text-[var(--brand-dark)]"></lucide-angular>
        </div>
        <span class="text-white font-black tracking-widest text-sm uppercase">SkinTone</span>
        <span class="luxury-font italic text-[var(--brand-gold)] text-sm">AI</span>
      </div>
      <p class="text-[9px] text-white/30 uppercase tracking-[0.3em]">© 2024 SkinToneAI · Curated with Intelligence</p>
    </footer>
  `,
  styles: [`
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    .animate-marquee { animation: marquee 20s linear infinite; }
  `]
})
export class LandingComponent {
  readonly CameraIcon = Camera;
  readonly SparklesIcon = Sparkles;
  readonly ArrowIcon = ArrowRight;
  readonly BagIcon = ShoppingBag;
  readonly StarIcon = Star;
  readonly ZapIcon = Zap;
  readonly CheckIcon = Check;

  avatarColors = ['#C68642', '#8D5524', '#E0AC69'];
  stats = [
    { value: '500+', label: 'Curated Outfits' },
    { value: '98%', label: 'Match Accuracy' },
    { value: '10s', label: 'Analysis Time' },
  ];
  steps = [
    { title: 'Upload Photo', desc: 'Take or upload a clear photo of yourself in natural lighting for best results.', icon: Camera },
    { title: 'AI Analyzes', desc: 'Our AI instantly detects your skin tone and undertones with 98% accuracy.', icon: Sparkles },
    { title: 'Shop Looks', desc: 'Browse curated outfits that complement your skin tone, with direct buy links.', icon: ShoppingBag }
  ];
  categories = ['👗 Dresses', '👟 Sneakers', '👜 Bags', '🧥 Jackets', '💄 Beauty', '🩱 Gym Wear', '⌚ Watches', '🩴 Sandals'];
}
