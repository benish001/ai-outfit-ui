import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LucideAngularModule, ArrowRight, Sparkles, Camera } from 'lucide-angular';

@Component({
  selector: 'app-register',
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
        <div class="p-6 sm:p-8">
          <!-- Logo -->
          <div class="flex flex-col items-center gap-2 mb-6">
            <div class="w-10 h-10 bg-[var(--brand-dark)] rounded-2xl flex items-center justify-center shadow-lg">
              <lucide-angular [img]="SparklesIcon" class="w-4 h-4 text-[var(--brand-gold)]"></lucide-angular>
            </div>
            <div class="text-center">
              <span class="text-base font-black tracking-[0.25em] uppercase text-[var(--brand-dark)]">SkinTone</span>
              <span class="text-base luxury-font italic text-[var(--brand-gold)] ml-1">AI</span>
            </div>
          </div>

          <!-- Heading -->
          <div class="text-center space-y-1 mb-5">
            <h1 class="text-xl luxury-font text-[var(--brand-dark)]">Create Account</h1>
            <p class="text-[8px] uppercase tracking-[0.3em] text-[var(--muted)] font-bold">Join the Elite Fashion Community</p>
          </div>

          <!-- Form -->
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            
            <!-- Photo Upload Area -->
            <div class="space-y-1.5">
              <label class="text-[9px] font-black tracking-[0.2em] uppercase text-[var(--muted)] px-1">Profile Photo</label>
              <div class="relative group cursor-pointer" (click)="fileInput.click()">
                <div class="w-full h-20 bg-[var(--surface)] border-2 border-dashed border-[var(--border)] rounded-[var(--radius-md)] flex items-center px-4 gap-4 group-hover:border-[var(--brand-gold)] transition-all overflow-hidden">
                  <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-[var(--border)] shadow-sm overflow-hidden flex-shrink-0">
                    <img *ngIf="photoPreview" [src]="photoPreview" class="w-full h-full object-cover">
                    <lucide-angular *ngIf="!photoPreview" [img]="CameraIcon" class="w-5 h-5 text-[var(--muted)]"></lucide-angular>
                  </div>
                  <div>
                    <p class="text-[10px] font-black uppercase tracking-wider text-[var(--brand-dark)]">{{ photoFile ? photoFile.name : 'Upload Avatar' }}</p>
                    <p class="text-[8px] text-[var(--muted)] uppercase tracking-widest mt-0.5">{{ photoPreview ? 'Click to change' : 'Select a professional look' }}</p>
                  </div>
                </div>
                <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*">
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[9px] font-black tracking-[0.2em] uppercase text-[var(--muted)] px-1">Full Name</label>
              <input type="text" formControlName="name" placeholder="E.g. Alexander McQueen" 
                class="w-full bg-[var(--surface)] border-2 border-transparent rounded-[var(--radius-md)] px-5 py-3 text-sm focus:border-[var(--brand-gold)] focus:bg-white transition-all outline-none">
            </div>

            <div class="space-y-1">
              <label class="text-[9px] font-black tracking-[0.2em] uppercase text-[var(--muted)] px-1">Email Address</label>
              <input type="email" formControlName="email" placeholder="your@email.com" 
                class="w-full bg-[var(--surface)] border-2 border-transparent rounded-[var(--radius-md)] px-5 py-3 text-sm focus:border-[var(--brand-gold)] focus:bg-white transition-all outline-none">
            </div>

            <div class="space-y-1">
              <label class="text-[9px] font-black tracking-[0.2em] uppercase text-[var(--muted)] px-1">Password</label>
              <input type="password" formControlName="password" placeholder="Min. 6 characters" 
                class="w-full bg-[var(--surface)] border-2 border-transparent rounded-[var(--radius-md)] px-5 py-2.5 text-sm focus:border-[var(--brand-gold)] focus:bg-white transition-all outline-none">
              
              <!-- Strength indicators -->
              <div *ngIf="registerForm.get('password')?.value" class="flex gap-1.5 mt-2 px-1">
                <div *ngFor="let i of [1,2,3,4]" class="h-1 flex-1 rounded-full bg-[var(--border)] transition-all overflow-hidden">
                   <div class="h-full bg-[var(--brand-gold)] transition-all duration-300" [style.width.%]="pwStrength >= i ? 100 : 0"></div>
                </div>
              </div>
            </div>

            <div *ngIf="error" class="bg-red-50 border border-red-100 rounded-xl px-4 py-3 animate-fade-in">
              <p class="text-[10px] font-bold text-red-600 uppercase tracking-widest text-center">{{ error }}</p>
            </div>

            <button type="submit" [disabled]="registerForm.invalid || isLoading" 
              class="w-full bg-[var(--brand-dark)] text-white rounded-[var(--radius-md)] py-4 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[var(--brand-dark-soft)] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3">
              <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
              <span>{{ isLoading ? 'Processing...' : 'Create My Account' }}</span>
              <lucide-angular *ngIf="!isLoading" [img]="ArrowIcon" class="w-4 h-4"></lucide-angular>
            </button>
          </form>

          <!-- Footer Link -->
          <p class="text-center text-[9px] text-[var(--muted)] uppercase tracking-widest mt-5">
            Already registered? 
            <a routerLink="/login" class="text-[var(--brand-dark)] font-black hover:text-[var(--brand-gold)] transition-colors underline decoration-[var(--brand-gold)] underline-offset-4 ml-1">Sign In</a>
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  readonly ArrowIcon = ArrowRight;
  readonly SparklesIcon = Sparkles;
  readonly CameraIcon = Camera;

  isLoading = false;
  error = '';
  photoFile: File | null = null;
  photoPreview: string | null = null;

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.photoFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

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

      const formData = new FormData();
      formData.append('name', this.registerForm.get('name')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      if (this.photoFile) {
        formData.append('photo', this.photoFile);
      }

      this.authService.register(formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Account Created!', detail: 'Welcome to SkinToneAI!' });
          
          // Auto-login after registration
          const email = this.registerForm.get('email')?.value;
          const password = this.registerForm.get('password')?.value;
          
          this.authService.login({ email, password }).subscribe({
            next: () => {
              this.isLoading = false;
              this.router.navigate(['/upload']);
            },
            error: () => {
              this.isLoading = false;
              this.router.navigate(['/login']);
            }
          });
        },
        error: (err: any) => { 
          this.isLoading = false; 
          this.error = err.error?.detail || 'Registration failed.'; 
        }
      });
    }
  }
}
