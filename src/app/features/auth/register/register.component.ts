import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LucideAngularModule, ArrowRight, Sparkles } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, Toast, LucideAngularModule],
  providers: [MessageService],
  template: `
    <div class="min-h-screen flex flex-col lg:flex-row bg-[#F8F8F6]">

      <!-- Left branding panel -->
      <div class="hidden lg:flex flex-col w-5/12 bg-black relative overflow-hidden p-12">
        <div class="absolute inset-0" style="background: radial-gradient(ellipse at top right, rgba(212,175,55,0.15) 0%, transparent 60%), radial-gradient(ellipse at bottom left, rgba(212,175,55,0.08) 0%, transparent 60%)"></div>
        <div class="absolute inset-0 opacity-[0.03]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:40px 40px"></div>

        <a routerLink="/" class="relative z-10 flex items-center gap-2">
          <div class="w-8 h-8 bg-[#D4AF37] rounded-xl flex items-center justify-center">
            <lucide-angular [img]="SparklesIcon" class="w-4 h-4 text-black"></lucide-angular>
          </div>
          <span class="text-lg font-black tracking-[0.2em] uppercase text-white">AI</span>
          <span class="text-lg luxury-font italic text-[#D4AF37]">Outfit</span>
        </a>

        <div class="relative z-10 mt-auto space-y-6">
          <div class="w-12 h-px bg-[#D4AF37]"></div>
          <h2 class="text-4xl luxury-font text-white leading-tight">Join the<br><span class="text-[#D4AF37] italic">Elite.</span></h2>
          <p class="text-sm text-white/40 font-light leading-relaxed max-w-xs">Create your free account and let AI revolutionize the way you dress.</p>
          <ul class="space-y-3">
            <li *ngFor="let f of features" class="flex items-center gap-3">
              <div class="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0">
                <div class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
              </div>
              <span class="text-[11px] uppercase tracking-widest text-white/40">{{ f }}</span>
            </li>
          </ul>
        </div>
        <p class="relative z-10 mt-12 text-[9px] text-white/20 uppercase tracking-widest">© 2024 AI Outfit Advisor</p>
      </div>

      <!-- Right panel: Form -->
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

          <div class="space-y-1.5">
            <h1 class="text-3xl luxury-font text-black">Create Account</h1>
            <p class="text-[11px] uppercase tracking-[0.3em] text-[#9A9A96]">Join for free today</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9A9A96]">Full Name</label>
              <input type="text" formControlName="name" placeholder="Your Name" class="app-input">
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9A9A96]">Email</label>
              <input type="email" formControlName="email" placeholder="your@email.com" class="app-input">
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9A9A96]">Password</label>
              <input type="password" formControlName="password" placeholder="Min. 6 characters" class="app-input">
              <!-- Password strength bar -->
              <div *ngIf="registerForm.get('password')?.value" class="flex gap-1 mt-2">
                <div *ngFor="let i of [1,2,3,4]" class="h-1 flex-1 rounded-full transition-all duration-300"
                  [class.bg-[#D4AF37]]="pwStrength >= i"
                  [class.bg-[#EDEDE9]]="pwStrength < i"></div>
              </div>
              <p *ngIf="registerForm.get('password')?.value" class="text-[10px] mt-1" [class.text-green-500]="pwStrength >= 3" [class.text-amber-500]="pwStrength === 2" [class.text-red-400]="pwStrength <= 1">
                {{ ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength] }} password
              </p>
            </div>

            <div *ngIf="error" class="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <div class="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
              <p class="text-xs text-red-600">{{ error }}</p>
            </div>

            <button type="submit" [disabled]="registerForm.invalid || isLoading" class="btn-primary w-full mt-2">
              <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
              <span>{{ isLoading ? 'Creating...' : 'Create Account' }}</span>
              <lucide-angular *ngIf="!isLoading" [img]="ArrowIcon" class="w-4 h-4"></lucide-angular>
            </button>
          </form>

          <p class="text-center text-[11px] text-[#9A9A96]">
            Already have an account?
            <a routerLink="/login" class="text-black font-bold ml-1 hover:text-[#D4AF37] transition-colors underline underline-offset-2">Sign In</a>
          </p>
        </div>
      </div>
    </div>
    <p-toast></p-toast>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  readonly ArrowIcon = ArrowRight;
  readonly SparklesIcon = Sparkles;

  isLoading = false;
  error = '';
  features = ['AI skin tone analysis', '500+ curated outfits', 'Direct buy links'];

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get pwStrength(): number {
    const pw = this.registerForm.get('password')?.value || '';
    let s = 0;
    if (pw.length >= 6) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.error = '';
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Account Created!', detail: 'Please sign in.' });
          setTimeout(() => this.router.navigate(['/login']), 1800);
        },
        error: (err: any) => { this.isLoading = false; this.error = err.error?.detail || 'Registration failed.'; }
      });
    }
  }
}
