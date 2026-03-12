import { Component, inject, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, Home, Upload, Sparkles, User, ShieldCheck, X, Settings, LogOut } from 'lucide-angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <!-- TOP NAV (desktop only, or non-logged-in mobile) -->
    <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      [class.bg-white]="isScrolled"
      [class.shadow-sm]="isScrolled"
      [class.border-b]="isScrolled"
      [class.border-[#EDEDE9]]="isScrolled"
      [class.bg-transparent]="!isScrolled">

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-18">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-1.5 group flex-shrink-0">
            <div class="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
              <lucide-angular [img]="SparklesIcon" class="w-3.5 h-3.5 text-[#D4AF37]"></lucide-angular>
            </div>
            <span class="text-base font-black tracking-[0.15em] uppercase text-black">AI</span>
            <span class="text-base luxury-font italic text-[#D4AF37]">Outfit</span>
          </a>

          <!-- Desktop Nav (only when logged in) -->
          <nav class="hidden md:flex items-center gap-6" *ngIf="authService.user$ | async as user">
            <a routerLink="/dashboard" routerLinkActive="text-black font-bold" class="text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">Home</a>
            <a routerLink="/upload" routerLinkActive="text-black font-bold" class="text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">Analyze</a>
            <a routerLink="/recommendations" routerLinkActive="text-black font-bold" class="text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">My Looks</a>
            <a *ngIf="user.is_admin" routerLink="/admin" class="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] hover:text-black transition-colors flex items-center gap-1.5 font-bold">
              <lucide-angular [img]="ShieldIcon" class="w-3 h-3"></lucide-angular>Admin
            </a>
          </nav>

          <!-- Guest desktop nav -->
          <nav class="hidden md:flex items-center gap-4" *ngIf="!(authService.user$ | async)">
            <a routerLink="/login" class="text-[11px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors font-medium">Sign In</a>
            <a routerLink="/register" class="btn-primary text-[10px] px-5 py-2.5">Join Free</a>
          </nav>

          <!-- Right side: User avatar (desktop) -->
          <ng-container *ngIf="authService.user$ | async as user">
            <!-- Desktop profile dropdown -->
            <div class="relative group hidden md:block">
              <button class="flex items-center gap-2.5 py-1.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 border-2 border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B] text-xs font-black uppercase">
                  {{ (user.name || user.email).charAt(0) }}
                </div>
                <span class="text-[11px] uppercase tracking-wider text-gray-700 hidden lg:block max-w-[100px] truncate font-semibold">{{ user.name || (user.email || '').split('@')[0] }}</span>
              </button>
              <!-- Dropdown -->
              <div class="absolute right-0 top-full mt-2 hidden group-hover:block bg-white border border-[#EDEDE9] shadow-2xl rounded-2xl min-w-[220px] py-2 z-50 overflow-hidden">
                <div class="px-4 py-3 border-b border-[#EDEDE9]">
                  <p class="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">Signed in as</p>
                  <p class="text-sm text-black font-semibold truncate mt-0.5">{{ user.email }}</p>
                </div>
                <a routerLink="/dashboard" class="flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                  <lucide-angular [img]="HomeIcon" class="w-4 h-4"></lucide-angular>Dashboard
                </a>
                <a routerLink="/upload" class="flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                  <lucide-angular [img]="UploadIcon" class="w-4 h-4"></lucide-angular>New Analysis
                </a>
                <a routerLink="/recommendations" class="flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                  <lucide-angular [img]="SparklesIcon" class="w-4 h-4"></lucide-angular>My Looks
                </a>
                <div class="border-t border-[#EDEDE9] mt-1 pt-1">
                  <button (click)="authService.logout()" class="w-full flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors">
                    <lucide-angular [img]="LogOutIcon" class="w-4 h-4"></lucide-angular>Sign Out
                  </button>
                </div>
              </div>
            </div>
          </ng-container>

          <!-- Mobile hamburger for guest -->
          <ng-container *ngIf="!(authService.user$ | async)">
            <button (click)="toggleMenu()" class="md:hidden p-2 text-black rounded-lg hover:bg-gray-100 transition-colors">
              <div class="w-5 h-4 flex flex-col justify-between">
                <span class="block h-0.5 bg-black rounded-full transition-all"></span>
                <span class="block h-0.5 bg-black rounded-full transition-all w-3/4"></span>
                <span class="block h-0.5 bg-black rounded-full transition-all"></span>
              </div>
            </button>
          </ng-container>
        </div>
      </div>

      <!-- Mobile Guest Menu -->
      <div *ngIf="menuOpen() && !(authService.user$ | async)"
        class="fixed inset-0 z-[100] md:hidden bg-black/50 backdrop-blur-sm animate-fade-in"
        (click)="toggleMenu()">
        <div class="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl animate-slide-left flex flex-col p-8"
          (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-10">
            <div class="flex items-center gap-1.5">
              <div class="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
                <lucide-angular [img]="SparklesIcon" class="w-3.5 h-3.5 text-[#D4AF37]"></lucide-angular>
              </div>
              <span class="font-black tracking-widest text-black">AI</span>
              <span class="luxury-font italic text-[#D4AF37]">Outfit</span>
            </div>
            <button (click)="toggleMenu()" class="p-2 text-gray-400 hover:text-black rounded-xl border border-[#EDEDE9] transition-colors">
              <lucide-angular [img]="CloseIcon" class="w-4 h-4"></lucide-angular>
            </button>
          </div>
          <div class="space-y-4 flex-1">
            <a routerLink="/login" (click)="toggleMenu()" class="block w-full py-4 text-center rounded-xl border border-[#EDEDE9] text-[11px] uppercase tracking-widest font-bold hover:border-black transition-all">Sign In</a>
            <a routerLink="/register" (click)="toggleMenu()" class="block w-full py-4 text-center rounded-xl bg-black text-white text-[11px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-black transition-all">Join Free</a>
          </div>
          <p class="text-[9px] text-gray-300 uppercase tracking-widest text-center">© 2024 AI Outfit Advisor</p>
        </div>
      </div>
    </header>
    <!-- BOTTOM TAB BAR (mobile, logged-in users only) -->
    <ng-container *ngIf="authService.user$ | async as user">
      <nav class="bottom-tab-bar md:hidden">
        
        <!-- Home -->
        <a routerLink="/dashboard" routerLinkActive="active" class="tab-item">
          <div class="h-12 flex items-center justify-center">
            <lucide-angular [img]="HomeIcon" class="tab-icon w-5 h-5"></lucide-angular>
          </div>
          <span class="tab-label">Home</span>
        </a>

        <!-- Analyze (Center Action) -->
        <a routerLink="/upload" #rlaUpload="routerLinkActive" routerLinkActive="active" class="tab-item">
          <div class="h-12 flex items-center justify-center">
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm"
             >
              <lucide-angular [img]="UploadIcon" class="w-5 h-5 transition-colors duration-300"
               ></lucide-angular>
            </div>
          </div>
          <span class="tab-label">Analyze</span>
        </a>

        <!-- Looks -->
        <a routerLink="/recommendations" routerLinkActive="active" class="tab-item">
          <div class="h-12 flex items-center justify-center">
            <lucide-angular [img]="SparklesIcon" class="tab-icon w-5 h-5"></lucide-angular>
          </div>
          <span class="tab-label">Looks</span>
        </a>

        <!-- Profile -->
        <a routerLink="/dashboard" class="tab-item"> <!-- Mock profile points to dashboard for now -->
          <div class="h-12 flex items-center justify-center">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B] text-xs font-black">
              {{ (user.name || user.email)?.charAt(0)?.toUpperCase() }}
            </div>
          </div>
          <span class="tab-label">Profile</span>
        </a>

      </nav>
    </ng-container>
  `
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  menuOpen = signal(false);
  isScrolled = false;
  currentRoute = '/dashboard';

  readonly HomeIcon = Home;
  readonly UploadIcon = Upload;
  readonly SparklesIcon = Sparkles;
  readonly UserIcon = User;
  readonly ShieldIcon = ShieldCheck;
  readonly CloseIcon = X;
  readonly SettingsIcon = Settings;
  readonly LogOutIcon = LogOut;

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.currentRoute = e.urlAfterRedirects || e.url;
      this.menuOpen.set(false);
    });
  }

  toggleMenu() { this.menuOpen.update(v => !v); }

  @HostListener('window:scroll', [])
  onScroll() { this.isScrolled = window.scrollY > 30; }
}
