import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Camera, Sparkles, ShoppingBag, ArrowRight, Star, Zap, Shield } from 'lucide-angular';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <!-- Hero -->
    <section class="min-h-screen flex flex-col justify-center pt-20 bg-white relative overflow-hidden">
      <!-- Subtle grid -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px);background-size:60px 60px"></div>
      <!-- Gold blob -->
      <div class="absolute top-1/4 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] rounded-full bg-[#D4AF37]/6 blur-[100px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 w-full">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <!-- Left copy -->
          <div class="space-y-8 animate-fade-in">
            <div class="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-2">
              <lucide-angular [img]="SparklesIcon" class="w-3.5 h-3.5 text-[#D4AF37]"></lucide-angular>
              <span class="text-[9px] uppercase tracking-[0.3em] text-[#B8860B] font-bold">AI-Powered Style</span>
            </div>

            <h1 class="text-5xl sm:text-6xl lg:text-7xl luxury-font text-black leading-[1.05]">
              Dress for<br>
              <span class="text-[#D4AF37] italic">Your Skin.</span>
            </h1>

            <p class="text-base text-gray-500 max-w-md leading-relaxed font-light">
              Upload your photo, let AI analyze your skin tone, and discover outfits curated specifically for you — with direct buy links.
            </p>

            <div class="flex flex-wrap gap-4">
              <a routerLink="/register" class="btn-luxury">
                Get Started Free
                <lucide-angular [img]="ArrowIcon" class="w-4 h-4"></lucide-angular>
              </a>
              <a routerLink="/login" class="btn-luxury-outline">Sign In</a>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap gap-8 pt-4 border-t border-[#E8E8E4]">
              <div>
                <p class="text-2xl font-black text-black">500+</p>
                <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-0.5">Curated Outfits</p>
              </div>
              <div>
                <p class="text-2xl font-black text-black">98%</p>
                <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-0.5">Match Accuracy</p>
              </div>
              <div>
                <p class="text-2xl font-black text-black">10s</p>
                <p class="text-[9px] uppercase tracking-widest text-gray-400 mt-0.5">Analysis Time</p>
              </div>
            </div>
          </div>

          <!-- Right visual -->
          <div class="relative flex items-center justify-center animate-slide-up">
            <div class="relative w-full max-w-sm mx-auto">
              <!-- Main card -->
              <div class="bg-white border border-[#E8E8E4] shadow-2xl p-6 space-y-4">
                <div class="aspect-square bg-[#F7F7F5] flex flex-col items-center justify-center space-y-3 border border-dashed border-[#E8E8E4]">
                  <lucide-angular [img]="CameraIcon" class="w-10 h-10 text-[#D4AF37]"></lucide-angular>
                  <p class="text-[10px] uppercase tracking-widest text-gray-400">Upload Your Photo</p>
                </div>
                <div class="space-y-2">
                  <div class="h-2 bg-[#D4AF37]/40 rounded-full w-3/4"></div>
                  <div class="h-2 bg-gray-100 rounded-full w-full"></div>
                  <div class="h-2 bg-gray-100 rounded-full w-5/6"></div>
                </div>
                <div class="btn-gold w-full text-center text-[9px]">Analyze My Skin Tone</div>
              </div>
              <!-- Floating badge -->
              <div class="absolute -top-4 -right-4 bg-black text-white px-4 py-2 text-[9px] uppercase tracking-widest font-bold">
                AI Powered ✦
              </div>
              <!-- Floating result card -->
              <div class="absolute -bottom-4 -left-6 bg-white border border-[#E8E8E4] shadow-xl p-4 min-w-[140px]">
                <p class="text-[8px] uppercase tracking-widest text-gray-400">Skin Tone</p>
                <p class="text-sm font-bold text-black mt-0.5">Warm Medium</p>
                <div class="flex gap-1 mt-2">
                  <div class="w-4 h-4 rounded-full bg-[#C68642]"></div>
                  <div class="w-4 h-4 rounded-full bg-[#8D5524]"></div>
                  <div class="w-4 h-4 rounded-full bg-[#E0AC69]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 sm:py-32 bg-[#F7F7F5]">
      <div class="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div class="text-center space-y-4 mb-16">
          <p class="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">How It Works</p>
          <h2 class="text-3xl sm:text-4xl luxury-font text-black">Three Steps to Perfect Style</h2>
        </div>
        <div class="grid sm:grid-cols-3 gap-8">
          <div *ngFor="let step of steps; let i = index" class="bg-white border border-[#E8E8E4] p-8 space-y-4 hover:shadow-md transition-shadow group animate-fade-in" [style.animation-delay]="i*100+'ms'">
            <div class="w-12 h-12 bg-black text-white flex items-center justify-center text-[10px] font-black uppercase tracking-widest group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
              {{ i + 1 }}
            </div>
            <h3 class="luxury-font text-xl text-black">{{ step.title }}</h3>
            <p class="text-sm text-gray-400 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 sm:py-32 bg-black">
      <div class="max-w-3xl mx-auto px-5 text-center space-y-8">
        <h2 class="text-3xl sm:text-4xl md:text-5xl luxury-font text-white">Ready to Find Your<br><span class="text-[#D4AF37] italic">Perfect Look?</span></h2>
        <p class="text-gray-400 text-sm font-light">Join thousands of fashion-forward individuals using AI to elevate their style.</p>
        <a routerLink="/register" class="btn-gold inline-flex">
          Start for Free
          <lucide-angular [img]="ArrowIcon" class="w-4 h-4"></lucide-angular>
        </a>
      </div>
    </section>
  `
})
export class LandingComponent {
  readonly CameraIcon = Camera;
  readonly SparklesIcon = Sparkles;
  readonly ArrowIcon = ArrowRight;
  readonly BagIcon = ShoppingBag;
  readonly StarIcon = Star;

  steps = [
    { title: 'Upload Photo', desc: 'Take or upload a clear photo of yourself in natural lighting for best results.' },
    { title: 'AI Analyzes', desc: 'Our AI instantly detects your skin tone and undertones with 98% accuracy.' },
    { title: 'Shop Looks', desc: 'Browse curated outfits that complement your skin tone, with direct buy links.' }
  ];
}
