import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, Toast, LucideAngularModule],
  providers: [MessageService],
  template: `
    <div class="min-h-screen flex">
      <!-- Left: Branding -->
      <div class="hidden lg:flex flex-col justify-between w-5/12 bg-black p-12 relative overflow-hidden">
        <div class="absolute inset-0 opacity-[0.04]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:50px 50px"></div>
        <div class="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#D4AF37]/10 blur-3xl"></div>
        <a routerLink="/" class="relative z-10 flex items-center gap-1">
          <span class="text-xl font-black tracking-[0.2em] uppercase text-white">AI</span>
          <span class="text-xl luxury-font italic text-[#D4AF37] tracking-widest">Outfit</span>
        </a>
        <div class="relative z-10 space-y-6">
          <div class="w-10 h-px bg-[#D4AF37]"></div>
          <h2 class="text-4xl luxury-font text-white leading-tight">Join the<br><span class="text-[#D4AF37] italic">Elite.</span></h2>
          <p class="text-sm text-white/40 font-light leading-relaxed">Create your free account and let AI revolutionize the way you dress.</p>
          <ul class="space-y-3">
            <li *ngFor="let f of features" class="flex items-center gap-3">
              <div class="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0"></div>
              <span class="text-[10px] uppercase tracking-widest text-white/40">{{ f }}</span>
            </li>
          </ul>
        </div>
        <p class="relative z-10 text-[9px] text-white/20 uppercase tracking-widest">© 2024 AI Outfit Advisor</p>
      </div>

      <!-- Right: Form -->
      <div class="flex-1 flex items-center justify-center px-5 sm:px-10 py-20 bg-white">
        <div class="w-full max-w-sm space-y-8 animate-fade-in">
          <a routerLink="/" class="flex lg:hidden items-center justify-center gap-1 mb-8">
            <span class="text-xl font-black tracking-[0.2em] uppercase text-black">AI</span>
            <span class="text-xl luxury-font italic text-[#D4AF37]">Outfit</span>
          </a>

          <div class="space-y-2">
            <h1 class="text-3xl luxury-font text-black">Create Account</h1>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400">Join for free today</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Full Name</label>
              <input type="text" formControlName="name" placeholder="Your Name" class="luxury-input">
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Email</label>
              <input type="email" formControlName="email" placeholder="your@email.com" class="luxury-input">
            </div>
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">Password</label>
              <input type="password" formControlName="password" placeholder="Min. 6 characters" class="luxury-input">
              <div *ngIf="registerForm.get('password')?.value" class="flex gap-1 mt-2">
                <div *ngFor="let i of [1,2,3,4]" class="h-0.5 flex-1 rounded transition-colors"
                  [class.bg-[#D4AF37]]="pwStrength >= i" [class.bg-gray-200]="pwStrength < i"></div>
              </div>
            </div>

            <div *ngIf="error" class="bg-red-50 border border-red-100 px-4 py-3">
              <p class="text-xs text-red-600">{{ error }}</p>
            </div>

            <button type="submit" [disabled]="registerForm.invalid || isLoading"
              class="btn-luxury w-full disabled:opacity-40 disabled:cursor-not-allowed">
              <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
              <span>{{ isLoading ? 'Creating...' : 'Create Account' }}</span>
              <lucide-angular *ngIf="!isLoading" [img]="ArrowIcon" class="w-4 h-4"></lucide-angular>
            </button>
          </form>

          <p class="text-center text-[10px] uppercase tracking-widest text-gray-400">
            Already have an account?
            <a routerLink="/login" class="text-black font-bold ml-2 hover:text-[#D4AF37] transition-colors">Sign In</a>
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
