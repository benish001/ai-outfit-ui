import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <footer class="bg-black text-white">
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          <!-- Brand -->
          <div class="lg:col-span-2 space-y-5">
            <div class="flex items-center gap-1">
              <span class="text-xl font-black tracking-[0.2em] uppercase text-white">Outfit</span>
              <span class="text-xl luxury-font italic text-[#D4AF37]">Tone</span>
            </div>
            <p class="text-sm text-white/40 font-light leading-relaxed max-w-sm">
              OutfitTone is your AI-powered fashion assistant that synchronizes your clothing choices with your unique skin tone for a curated, premium look.
            </p>
            <div class="flex gap-4">
              <div *ngFor="let s of socials" class="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors cursor-pointer text-sm font-bold">{{ s }}</div>
            </div>
          </div>

          <!-- Links -->
          <div class="space-y-4">
            <h4 class="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30">Navigate</h4>
            <ul class="space-y-3">
              <li *ngFor="let link of navLinks">
                <a [routerLink]="link.path" class="text-[11px] uppercase tracking-widest text-white/50 hover:text-white transition-colors">{{ link.label }}</a>
              </li>
            </ul>
          </div>

          <!-- Info -->
          <div class="space-y-4">
            <h4 class="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30">Company</h4>
            <ul class="space-y-3">
              <li *ngFor="let link of companyLinks">
                <a href="#" class="text-[11px] uppercase tracking-widest text-white/50 hover:text-white transition-colors">{{ link }}</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-[9px] uppercase tracking-widest text-white/25">© 2024 AI Outfit Advisor. All rights reserved.</p>
          <p class="text-[9px] uppercase tracking-widest text-white/25">Built with <span class="text-[#D4AF37]">♦</span> AI</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  socials = ['X', 'In', 'Ig'];
  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Sign In', path: '/login' },
    { label: 'Register', path: '/register' },
    { label: 'Dashboard', path: '/dashboard' },
  ];
  companyLinks = ['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'];
}
