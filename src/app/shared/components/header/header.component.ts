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

      <!-- Mobile Menu Overlay -->
      <div 
        *ngIf="menuOpen()" 
        class="fixed inset-0 z-[100] md:hidden bg-black/60 backdrop-blur-md transition-all duration-500 animate-fade-in"
        (click)="toggleMenu()">
        
        <div 
          class="absolute top-0 right-0 w-[280px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-500 animate-slide-left p-8"
          (click)="$event.stopPropagation()">
          
          <div class="flex items-center justify-between mb-12">
            <div class="flex items-center gap-1">
              <span class="text-xl font-black tracking-widest text-black">AI</span>
              <span class="text-xl luxury-font italic text-[#D4AF37]">Outfit</span>
            </div>
            <button (click)="toggleMenu()" class="p-2 text-gray-400 hover:text-black transition-colors rounded-full border border-gray-100">
              <lucide-angular [img]="CloseIcon" class="w-4 h-4"></lucide-angular>
            </button>
          </div>

          <div class="space-y-6">
            <a routerLink="/" (click)="toggleMenu()" class="block text-[11px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-[#D4AF37] transition-all">Home</a>
            
            <div class="h-[1px] bg-gray-50 w-full"></div>

            <ng-container *ngIf="authService.user$ | async as user; else guestMobile">
              <div class="pb-4">
                <p class="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold mb-4">Membership</p>
                <div class="space-y-6">
                  <a routerLink="/dashboard" (click)="toggleMenu()" class="block text-[12px] uppercase tracking-[0.2em] font-bold text-black flex items-center gap-3">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Dashboard
                  </a>
                  <a routerLink="/upload" (click)="toggleMenu()" class="block text-[12px] uppercase tracking-[0.2em] font-bold text-black flex items-center gap-3">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> New Analysis
                  </a>
                  <a routerLink="/recommendations" (click)="toggleMenu()" class="block text-[12px] uppercase tracking-[0.2em] font-bold text-black flex items-center gap-3">
                    <span class="w-1.5 h-1.5 rounded-full bg-gray-200"></span> Recommendations
                  </a>
                  <a *ngIf="user.is_admin" routerLink="/admin" (click)="toggleMenu()" class="block text-[12px] uppercase tracking-[0.2em] font-bold text-[#D4AF37] flex items-center gap-3">
                    <lucide-angular [img]="ShieldIcon" class="w-4 h-4"></lucide-angular> Admin Portal
                  </a>
                </div>
              </div>

              <div class="mt-auto pt-12 border-t border-gray-50">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center font-bold text-[#D4AF37]">
                    {{ (user.name || user.email).charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[10px] uppercase tracking-widest font-black text-black truncate">{{ user.name || 'Member' }}</p>
                    <p class="text-[9px] text-gray-400 truncate">{{ user.email }}</p>
                  </div>
                </div>
                <button (click)="authService.logout()" class="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-red-50 text-red-500 text-[10px] uppercase tracking-[0.2em] font-bold transition-all hover:bg-red-100">
                  Sign Out
                </button>
              </div>
            </ng-container>

            <ng-template #guestMobile>
              <div class="space-y-4 pt-4">
                <a routerLink="/login" (click)="toggleMenu()" class="block w-full py-4 text-center border border-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black hover:text-white transition-all">Sign In</a>
                <a routerLink="/register" (click)="toggleMenu()" class="block w-full py-4 text-center bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#D4AF37] transition-all">Join Club</a>
              </div>
            </ng-template>
          </div>
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
