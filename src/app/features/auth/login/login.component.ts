import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LucideAngularModule, ArrowRight, Eye, EyeOff } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, Toast, LucideAngularModule],
  providers: [MessageService],
  template: `
    <div class="min-h-screen flex">
      <!-- Left: Branding -->
      <div class="hidden lg:flex flex-col justify-between w-5/12 bg-black p-12 relative overflow-hidden">
        <div class="absolute inset-0 opacity-[0.04]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:50px 50px"></div>
        <div class="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-3xl"></div>
        <a routerLink="/" class="relative z-10 flex items-center gap-1">
          <span class="text-xl font-black tracking-[0.2em] uppercase text-white">AI</span>
          <span class="text-xl luxury-font italic text-[#D4AF37] tracking-widest">Outfit</span>
        </a>
        <div class="relative z-10 space-y-6">
          <div class="w-10 h-px bg-[#D4AF37]"></div>
          <h2 class="text-4xl luxury-font text-white leading-tight">Welcome<br>Back.</h2>
          <p class="text-sm text-white/40 font-light leading-relaxed">Your personal AI stylist is waiting. Sign in to continue your fashion journey.</p>
          <div class="space-y-3">
            <div *ngFor="let f of features" class="flex items-center gap-3">
              <div class="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0"></div>
              <span class="text-[10px] uppercase tracking-widest text-white/40">{{ f }}</span>
            </div>
          </div>
        </div>
        <p class="relative z-10 text-[9px] text-white/20 uppercase tracking-widest">© 2024 AI Outfit Advisor</p>
      </div>

      <!-- Right: Form -->
      <div class="flex-1 flex items-center justify-center px-5 sm:px-10 py-20 bg-white">
        <div class="w-full max-w-sm space-y-8 animate-fade-in">
          <!-- Mobile logo -->
          <a routerLink="/" class="flex lg:hidden items-center justify-center gap-1 mb-8">
            <span class="text-xl font-black tracking-[0.2em] uppercase text-black">AI</span>
            <span class="text-xl luxury-font italic text-[#D4AF37]">Outfit</span>
          </a>

          <div class="space-y-2">
            <h1 class="text-3xl luxury-font text-black">Sign In</h1>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400">Access your account</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Email</label>
              <input type="email" formControlName="email" placeholder="your@email.com" class="luxury-input">
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Password</label>
              <div class="relative">
                <input [type]="showPw ? 'text' : 'password'" formControlName="password" placeholder="••••••••" class="luxury-input pr-10">
                <button type="button" (click)="showPw = !showPw" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                  <lucide-angular [img]="showPw ? EyeOffIcon : EyeIcon" class="w-4 h-4"></lucide-angular>
                </button>
              </div>
            </div>

            <div *ngIf="error" class="bg-red-50 border border-red-100 px-4 py-3">
              <p class="text-xs text-red-600">{{ error }}</p>
            </div>

            <button type="submit" [disabled]="loginForm.invalid || isLoading"
              class="btn-luxury w-full disabled:opacity-40 disabled:cursor-not-allowed">
              <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
              <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
              <lucide-angular *ngIf="!isLoading" [img]="ArrowIcon" class="w-4 h-4"></lucide-angular>
            </button>
          </form>

          <p class="text-center text-[10px] uppercase tracking-widest text-gray-400">
            No account?
            <a routerLink="/register" class="text-black font-bold ml-2 hover:text-[#D4AF37] transition-colors">Create one</a>
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
