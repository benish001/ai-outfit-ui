import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LucideAngularModule, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, Toast, LucideAngularModule],
  providers: [MessageService],
  template: `
    <div class="min-h-screen flex flex-col lg:flex-row bg-[#F8F8F6]">

      <!-- Left Panel (desktop branding) -->
      <div class="hidden lg:flex flex-col w-5/12 bg-black relative overflow-hidden p-12">
        <!-- Background pattern -->
        <div class="absolute inset-0" style="background: radial-gradient(ellipse at top right, rgba(212,175,55,0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(212,175,55,0.08) 0%, transparent 60%)"></div>
        <div class="absolute inset-0 opacity-[0.03]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:40px 40px"></div>

        <!-- Logo -->
        <a routerLink="/" class="relative z-10 flex items-center gap-2">
          <div class="w-8 h-8 bg-[#D4AF37] rounded-xl flex items-center justify-center">
            <lucide-angular [img]="SparklesIcon" class="w-4 h-4 text-black"></lucide-angular>
          </div>
          <span class="text-lg font-black tracking-[0.2em] uppercase text-white">AI</span>
          <span class="text-lg luxury-font italic text-[#D4AF37]">Outfit</span>
        </a>

        <!-- Hero text -->
        <div class="relative z-10 mt-auto space-y-6">
          <div class="w-12 h-px bg-[#D4AF37]"></div>
          <h2 class="text-4xl luxury-font text-white leading-tight">
            Welcome<br>
            <span class="text-[#D4AF37] italic">Back.</span>
          </h2>
          <p class="text-sm text-white/40 font-light leading-relaxed max-w-xs">Your personal AI stylist is waiting. Continue your fashion journey.</p>
          <div class="space-y-3 pt-2">
            <div *ngFor="let f of features" class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0">
                <div class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
              </div>
              <span class="text-[11px] uppercase tracking-widest text-white/40">{{ f }}</span>
            </div>
          </div>
        </div>

        <p class="relative z-10 mt-12 text-[9px] text-white/20 uppercase tracking-widest">© 2024 AI Outfit Advisor</p>
      </div>

      <!-- Right Panel: Form -->
      <div class="flex-1 flex items-center justify-center px-5 sm:px-8 py-16 bg-white">
        <div class="w-full max-w-sm animate-fade-in space-y-8">

          <!-- Mobile Logo -->
          <a routerLink="/" class="flex lg:hidden items-center justify-center gap-2 mb-4">
            <div class="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
              <lucide-angular [img]="SparklesIcon" class="w-4 h-4 text-[#D4AF37]"></lucide-angular>
            </div>
            <span class="text-lg font-black tracking-[0.2em] uppercase text-black">AI</span>
            <span class="text-lg luxury-font italic text-[#D4AF37]">Outfit</span>
          </a>

          <!-- Heading -->
          <div class="space-y-1.5">
            <h1 class="text-3xl luxury-font text-black">Sign In</h1>
            <p class="text-[11px] uppercase tracking-[0.3em] text-[#9A9A96]">Access your style profile</p>
          </div>

          <!-- Social Login (visual) -->
          <div class="grid grid-cols-2 gap-3">
            <button class="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#EDEDE9] text-[11px] uppercase tracking-wider font-semibold text-gray-600 hover:border-gray-400 transition-all">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button class="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#EDEDE9] text-[11px] uppercase tracking-wider font-semibold text-gray-600 hover:border-gray-400 transition-all">
              <svg class="w-4 h-4 fill-black" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04-.03.07-.41 1.44-1.37 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Apple
            </button>
          </div>

          <!-- Divider -->
          <div class="flex items-center gap-3">
            <div class="flex-1 h-px bg-[#EDEDE9]"></div>
            <span class="text-[10px] uppercase tracking-widest text-[#9A9A96] font-medium">or email</span>
            <div class="flex-1 h-px bg-[#EDEDE9]"></div>
          </div>

          <!-- Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9A9A96]">Email</label>
              <input type="email" formControlName="email" placeholder="your@email.com" class="app-input">
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9A9A96]">Password</label>
              <div class="relative">
                <input [type]="showPw ? 'text' : 'password'" formControlName="password" placeholder="••••••••" class="app-input pr-12">
                <button type="button" (click)="showPw = !showPw" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors">
                  <lucide-angular [img]="showPw ? EyeOffIcon : EyeIcon" class="w-4 h-4"></lucide-angular>
                </button>
              </div>
            </div>

            <div *ngIf="error" class="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <div class="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
              <p class="text-xs text-red-600">{{ error }}</p>
            </div>

            <button type="submit" [disabled]="loginForm.invalid || isLoading" class="btn-primary w-full mt-2">
              <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
              <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
              <lucide-angular *ngIf="!isLoading" [img]="ArrowIcon" class="w-4 h-4"></lucide-angular>
            </button>
          </form>

          <!-- Sign up link -->
          <p class="text-center text-[11px] text-[#9A9A96]">
            No account?
            <a routerLink="/register" class="text-black font-bold ml-1 hover:text-[#D4AF37] transition-colors underline underline-offset-2">Create one</a>
          </p>
        </div>
      </div>
    </div>
    <p-toast></p-toast>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  readonly ArrowIcon = ArrowRight;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;
  readonly SparklesIcon = Sparkles;

  showPw = false;
  isLoading = false;
  error = '';
  features = ['AI skin tone analysis', 'Curated outfit recommendations', 'Direct buy links'];

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: () => { this.isLoading = false; this.router.navigate(['/dashboard']); },
        error: (err: any) => { this.isLoading = false; this.error = err.error?.detail || 'Login failed. Please try again.'; }
      });
    }
  }
}
