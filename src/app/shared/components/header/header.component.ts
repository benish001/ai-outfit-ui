import { Component, inject, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, Menu, X, ChevronDown, Sparkles, ShieldCheck } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.bg-white]="isScrolled"
      [class.shadow-sm]="isScrolled"
      [class.border-b]="isScrolled"
      [class.border-[#E8E8E4]]="isScrolled"
      [class.bg-transparent]="!isScrolled">

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-1 group">
            <span class="text-lg sm:text-xl font-black tracking-[0.2em] uppercase text-black">AI</span>
            <span class="text-lg sm:text-xl luxury-font italic text-[#D4AF37] tracking-widest">Outfit</span>
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-8">
            <a routerLink="/" class="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors font-medium">Home</a>
            <ng-container *ngIf="authService.user$ | async as user">
              <a routerLink="/dashboard" class="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors font-medium">Dashboard</a>
              <a routerLink="/upload" class="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors font-medium">Analyze</a>
              <a *ngIf="user.is_admin" routerLink="/admin" class="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] hover:text-black transition-colors font-bold flex items-center gap-1">
                <lucide-angular [img]="ShieldIcon" class="w-3 h-3"></lucide-angular>Admin
              </a>
            </ng-container>
          </nav>

          <!-- Right Actions -->
          <div class="flex items-center gap-3 sm:gap-4">
            <ng-container *ngIf="authService.user$ | async as user; else guestNav">
              <div class="relative group hidden sm:block">
                <button class="flex items-center gap-2 py-1">
                  <div class="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#B8860B] text-xs font-bold uppercase">
                    {{ (user.name || user.email).charAt(0) }}
                  </div>
                  <span class="text-[10px] uppercase tracking-widest text-gray-700 hidden lg:block max-w-[100px] truncate">{{ user.name || (user.email || '').split('@')[0] }}</span>
                  <lucide-angular [img]="ChevronIcon" class="w-3 h-3 text-gray-400"></lucide-angular>
                </button>
                <!-- Dropdown -->
                <div class="absolute right-0 top-full mt-3 hidden group-hover:block bg-white border border-[#E8E8E4] shadow-xl min-w-[200px] py-2 z-50">
                  <div class="px-4 py-2 border-b border-[#E8E8E4]">
                    <p class="text-[9px] uppercase tracking-widest text-gray-400">Signed in as</p>
                    <p class="text-xs text-black font-medium truncate mt-0.5">{{ user.email }}</p>
                  </div>
                  <a routerLink="/dashboard" class="block px-4 py-2.5 text-[10px] uppercase tracking-widest text-gray-600 hover:bg-[#F7F7F5] hover:text-black transition-colors">Dashboard</a>
                  <a routerLink="/upload" class="block px-4 py-2.5 text-[10px] uppercase tracking-widest text-gray-600 hover:bg-[#F7F7F5] hover:text-black transition-colors">New Analysis</a>
                  <a routerLink="/recommendations" class="block px-4 py-2.5 text-[10px] uppercase tracking-widest text-gray-600 hover:bg-[#F7F7F5] hover:text-black transition-colors">Recommendations</a>
                  <div *ngIf="user.is_admin" class="border-t border-[#E8E8E4] mt-1 pt-1">
                    <a routerLink="/admin" class="block px-4 py-2.5 text-[10px] uppercase tracking-widest text-[#D4AF37] hover:bg-[#F7F7F5] transition-colors font-bold">Admin Portal</a>
                  </div>
                  <div class="border-t border-[#E8E8E4] mt-1 pt-1">
                    <button (click)="authService.logout()" class="w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors">Sign Out</button>
                  </div>
                </div>
              </div>
              <!-- Mobile avatar -->
              <button (click)="toggleMenu()" class="sm:hidden w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#B8860B] text-xs font-bold uppercase">
                {{ (user.name || user.email)?.charAt(0) }}
              </button>
            </ng-container>

            <ng-template #guestNav>
              <a routerLink="/login" class="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors font-medium">Sign In</a>
              <a routerLink="/register" class="btn-luxury text-[9px] px-5 py-2.5">Join Free</a>
            </ng-template>

            <!-- Hamburger (mobile) -->
            <button (click)="toggleMenu()" class="md:hidden p-1 text-black">
              <lucide-angular [img]="menuOpen() ? CloseIcon : MenuIcon" class="w-5 h-5"></lucide-angular>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="menuOpen()" class="md:hidden bg-white border-t border-[#E8E8E4] shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-4 space-y-1">
          <a routerLink="/" (click)="toggleMenu()" class="block py-3 text-[10px] uppercase tracking-[0.2em] text-gray-600 hover:text-black border-b border-[#F0F0EE]">Home</a>
          <ng-container *ngIf="authService.user$ | async as user">
            <a routerLink="/dashboard" (click)="toggleMenu()" class="block py-3 text-[10px] uppercase tracking-[0.2em] text-gray-600 hover:text-black border-b border-[#F0F0EE]">Dashboard</a>
            <a routerLink="/upload" (click)="toggleMenu()" class="block py-3 text-[10px] uppercase tracking-[0.2em] text-gray-600 hover:text-black border-b border-[#F0F0EE]">Analyze</a>
            <a routerLink="/recommendations" (click)="toggleMenu()" class="block py-3 text-[10px] uppercase tracking-[0.2em] text-gray-600 hover:text-black border-b border-[#F0F0EE]">Recommendations</a>
            <a *ngIf="user.is_admin" routerLink="/admin" (click)="toggleMenu()" class="block py-3 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold border-b border-[#F0F0EE]">Admin Portal</a>
            <div class="pt-2">
              <p class="text-[9px] text-gray-400 uppercase tracking-widest mb-2">{{ user.name || user.email }}</p>
              <button (click)="authService.logout()" class="text-[10px] uppercase tracking-widest text-red-500 font-medium">Sign Out</button>
            </div>
          </ng-container>
          <ng-container *ngIf="!(authService.user$ | async)">
            <a routerLink="/login" (click)="toggleMenu()" class="block py-3 text-[10px] uppercase tracking-[0.2em] text-gray-600 hover:text-black border-b border-[#F0F0EE]">Sign In</a>
            <a routerLink="/register" (click)="toggleMenu()" class="block py-3 text-[10px] uppercase tracking-[0.2em] text-black font-bold">Join Free</a>
          </ng-container>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
  menuOpen = signal(false);
  isScrolled = false;

  readonly MenuIcon = Menu;
  readonly CloseIcon = X;
  readonly ChevronIcon = ChevronDown;
  readonly SparklesIcon = Sparkles;
  readonly ShieldIcon = ShieldCheck;

  toggleMenu() { this.menuOpen.update(v => !v); }

  @HostListener('window:scroll', [])
  onScroll() { this.isScrolled = window.scrollY > 30; }
}
