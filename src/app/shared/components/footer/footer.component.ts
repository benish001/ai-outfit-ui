import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <footer *ngIf="!isAuthPage()" class="bg-[var(--brand-dark)] text-white">
      <div class="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          <!-- Brand -->
          <div class="lg:col-span-2 space-y-5">
            <div class="flex items-center gap-1.5 uppercase font-black tracking-widest leading-none">
              <span class="text-xl">SkinTone</span>
              <span class="text-xl luxury-font italic text-[var(--brand-gold)]">AI</span>
            </div>
            <p class="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed max-w-sm">
              Discover your perfect palette. SkinTone AI elevates your wardrobe through intelligent color science and complexion analysis.
            </p>
            <div class="flex gap-4">
              <div *ngFor="let s of socials" class="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)] transition-colors cursor-pointer text-sm font-bold">{{ s }}</div>
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
          <p class="text-[9px] uppercase tracking-widest text-white/20">© 2024 SkinTone AI Advisor. Curated with Intelligence.</p>
          <p class="text-[9px] uppercase tracking-widest text-white/20">Powered by <span class="text-[var(--brand-gold)]">♦</span> AI</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  private router = inject(Router);
  socials = ['X', 'In', 'Ig'];
  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Sign In', path: '/login' },
    { label: 'Register', path: '/register' },
    { label: 'Dashboard', path: '/dashboard' },
  ];
  companyLinks = ['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'];

  isAuthPage() {
    return this.router.url.includes('/login') || this.router.url.includes('/register');
  }
}
