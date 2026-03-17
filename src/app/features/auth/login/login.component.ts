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
    <div class="min-h-screen flex items-center justify-center bg-[var(--surface)] p-6 relative overflow-hidden">
      <!-- Background Decorative Elements -->
      <div class="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style="background-image:linear-gradient(var(--brand-dark) 1px,transparent 1px),linear-gradient(90deg,var(--brand-dark) 1px,transparent 1px);background-size:40px 40px"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-[var(--brand-gold)] opacity-[0.05] rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--brand-dark)] opacity-[0.05] rounded-full blur-3xl"></div>

      <div class="w-full max-w-sm bg-white rounded-[var(--radius-lg)] shadow-2xl border border-[var(--border)] relative z-10 overflow-hidden animate-slide-up">
        <div class="p-8 sm:p-10">
          <!-- Logo -->
          <div class="flex flex-col items-center gap-2 mb-8">
            <div class="w-11 h-11 bg-[var(--brand-dark)] rounded-2xl flex items-center justify-center shadow-lg">
              <lucide-angular [img]="SparklesIcon" class="w-5 h-5 text-[var(--brand-gold)]"></lucide-angular>
            </div>
            <div class="text-center">
              <span class="text-lg font-black tracking-[0.25em] uppercase text-[var(--brand-dark)]">SkinTone</span>
              <span class="text-lg luxury-font italic text-[var(--brand-gold)] ml-1">AI</span>
            </div>
          </div>

          <!-- Heading -->
          <div class="text-center space-y-1 mb-6">
            <h1 class="text-2xl luxury-font text-[var(--brand-dark)]">Welcome Back</h1>
            <p class="text-[9px] uppercase tracking-[0.3em] text-[var(--muted)] font-bold">Access Your Style Profile</p>
          </div>

          <!-- Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-3.5">
            <div class="space-y-1">
              <label class="text-[9px] font-black tracking-[0.2em] uppercase text-[var(--muted)] px-1">Email Address</label>
              <div class="relative group">
                <input type="email" formControlName="email" placeholder="your@email.com" 
                  class="w-full bg-[var(--surface)] border-2 border-transparent rounded-[var(--radius-md)] px-5 py-3.5 text-sm focus:border-[var(--brand-gold)] focus:bg-white transition-all outline-none">
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[9px] font-black tracking-[0.2em] uppercase text-[var(--muted)] px-1">Password</label>
              <div class="relative group">
                <input [type]="showPw ? 'text' : 'password'" formControlName="password" placeholder="••••••••" 
                  class="w-full bg-[var(--surface)] border-2 border-transparent rounded-[var(--radius-md)] px-5 py-3.5 text-sm focus:border-[var(--brand-gold)] focus:bg-white transition-all outline-none pr-12">
                <button type="button" (click)="showPw = !showPw" class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--brand-dark)]">
                  <lucide-angular [img]="showPw ? EyeOffIcon : EyeIcon" class="w-4 h-4"></lucide-angular>
                </button>
              </div>
            </div>

            <div *ngIf="error" class="bg-red-50 border border-red-100 rounded-xl px-4 py-3 animate-fade-in">
              <p class="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center">{{ error }}</p>
            </div>

            <button type="submit" [disabled]="loginForm.invalid || isLoading" 
              class="w-full bg-[var(--brand-dark)] text-white rounded-[var(--radius-md)] py-4 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[var(--brand-dark-soft)] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3">
              <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
              <span>{{ isLoading ? 'Processing...' : 'Secure Sign In' }}</span>
              <lucide-angular *ngIf="!isLoading" [img]="ArrowIcon" class="w-4 h-4"></lucide-angular>
            </button>
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-[var(--border)]"></div>
            <span class="text-[8px] uppercase tracking-[0.3em] text-[var(--muted)] font-black">Or Join Us</span>
            <div class="flex-1 h-px bg-[var(--border)]"></div>
          </div>

          <!-- Socials (Mock) -->
          <div class="grid grid-cols-2 gap-3 mb-6">
            <button class="flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--border)] text-[9px] uppercase tracking-widest font-black text-[var(--brand-dark)] hover:bg-[var(--surface)] transition-all">
              Google
            </button>
            <button class="flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--border)] text-[9px] uppercase tracking-widest font-black text-[var(--brand-dark)] hover:bg-[var(--surface)] transition-all">
              Apple
            </button>
          </div>

          <!-- Footer Link -->
          <p class="text-center text-[9px] text-[var(--muted)] uppercase tracking-widest mt-6">
            New here? 
            <a routerLink="/register" class="text-[var(--brand-dark)] font-black hover:text-[var(--brand-gold)] transition-colors underline decoration-[var(--brand-gold)] underline-offset-4 ml-1">Create Account</a>
          </p>
        </div>
      </div>
      
      <!-- Bottom Branding -->
      <div class="absolute bottom-6 left-0 w-full text-center">
        <p class="text-[8px] uppercase tracking-[0.4em] text-[var(--muted)] opacity-50">© 2024 SkinToneAI · Luxury Fashion Curator</p>
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
