import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OutfitService } from '../../core/services/outfit.service';
import { LucideAngularModule, Upload, CheckCircle, X, Camera, Sparkles, Zap, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[var(--surface)] pt-12 page-content">
      <div class="max-w-lg mx-auto px-6 py-6">

        <!-- Progress Steps -->
        <div class="flex items-center justify-center gap-4 mb-8 scale-90">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-[var(--brand-dark)] flex items-center justify-center text-white text-[10px] font-black shadow-lg">1</div>
            <span class="text-[9px] uppercase tracking-widest font-black text-[var(--brand-dark)]">Upload</span>
          </div>
          <div class="w-8 h-px bg-[var(--border)]"></div>
          <div class="flex items-center gap-2.5 opacity-40">
            <div class="w-8 h-8 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center text-[10px] font-black text-[var(--brand-dark)]">2</div>
            <span class="text-[9px] uppercase tracking-widest font-bold text-[var(--brand-dark)]">Discover</span>
          </div>
        </div>

        <!-- Header -->
        <div class="text-center space-y-2 mb-8 animate-fade-in">
          <h1 class="text-3xl sm:text-4xl luxury-font text-[var(--brand-dark)] leading-tight">
            Your Style<br>
            <span class="italic text-[var(--brand-gold)]">Profile</span>
          </h1>
          <p class="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] font-medium max-w-[280px] mx-auto">Analyze your complexion to curate your perfect palette</p>
        </div>

        <!-- Upload Zone -->
        <div class="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] transition-all duration-700 cursor-pointer relative overflow-hidden animate-slide-up mb-6 shadow-sm hover:shadow-md"
          [class.border-[var(--brand-gold)]]="preview"
          (click)="fileInput.click()"
          (dragover)="$event.preventDefault()"
          (drop)="onDrop($event)">
          <input #fileInput type="file" accept="image/*" (change)="onFile($event)" class="hidden">

          <!-- Preview -->
          <div *ngIf="preview" class="relative">
            <img [src]="preview" class="w-full rounded-[var(--radius-lg)]" style="aspect-ratio:1/1; object-fit:cover;">
            <div class="absolute inset-0 bg-gradient-to-t from-[var(--brand-dark)]/80 via-transparent to-transparent flex flex-col justify-end p-5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
                  <lucide-angular [img]="CheckIcon" class="w-3.5 h-3.5 text-[var(--brand-gold)]"></lucide-angular>
                  <span class="text-[10px] uppercase tracking-widest font-black text-white">Analysis Ready</span>
                </div>
                <button (click)="$event.stopPropagation(); preview = null; selectedFile = null"
                  class="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-red-500 transition-all">
                  <lucide-angular [img]="CloseIcon" class="w-4 h-4"></lucide-angular>
                </button>
              </div>
            </div>
          </div>

          <!-- Placeholder -->
          <div *ngIf="!preview" class="flex flex-col items-center justify-center py-12 px-6 space-y-5">
            <div class="w-20 h-20 bg-[var(--brand-gold-light)] rounded-[24px] flex items-center justify-center shadow-inner transition-transform duration-500">
              <lucide-angular [img]="CameraIcon" class="w-8 h-8 text-[var(--brand-gold)]"></lucide-angular>
            </div>
            <div class="text-center space-y-1.5">
              <p class="text-base font-bold text-[var(--brand-dark)]">Upload Photo</p>
              <p class="text-[10px] uppercase tracking-widest text-[var(--muted)] font-medium">Tap to start</p>
            </div>
            <div class="flex flex-wrap gap-2 justify-center max-w-[240px]">
              <span *ngFor="let tip of tips" class="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface)] rounded-lg text-[9px] font-bold uppercase tracking-wider text-[var(--muted)] border border-[var(--border)]">
                {{ tip }}
              </span>
            </div>
          </div>
        </div>

        <!-- Gender Selection -->
        <div class="space-y-5 mb-8">
          <div class="flex items-center gap-4">
            <div class="h-px flex-1 bg-[#EDEDE9]"></div>
            <p class="text-[10px] uppercase tracking-[0.3em] text-[#9A9A96] font-bold">Style Preference</p>
            <div class="h-px flex-1 bg-[#EDEDE9]"></div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button *ngFor="let g of genders"
              (click)="selectedGender = g.value"
              class="relative flex items-center gap-4 px-5 py-4 rounded-[var(--radius-md)] border-2 transition-all duration-300"
              [class.border-[var(--brand-dark)]]="selectedGender === g.value"
              [class.bg-[var(--brand-dark)]]="selectedGender === g.value"
              [class.border-[var(--border)]]="selectedGender !== g.value"
              [class.bg-white]="selectedGender !== g.value"
              [class.shadow-md]="selectedGender === g.value">
              <span class="text-2xl">{{ g.emoji }}</span>
              <span class="text-[11px] uppercase tracking-[0.2em] font-black"
                [class.text-white]="selectedGender === g.value"
                [class.text-[var(--brand-dark)]]="selectedGender !== g.value">
                {{ g.label }}
              </span>
            </button>
          </div>
        </div>

        <button (click)="analyze()" [disabled]="!selectedFile || isLoading"
          class="w-full relative overflow-hidden rounded-[var(--radius-md)] py-4 text-[11px] uppercase tracking-[0.3em] font-black transition-all duration-500 disabled:opacity-30 disabled:grayscale"
          [class.bg-[var(--brand-dark)]]="selectedFile && !isLoading"
          [class.text-white]="selectedFile && !isLoading"
          [class.hover:bg-[var(--brand-dark-soft)]]="selectedFile && !isLoading"
          [class.bg-[var(--border)]]="!selectedFile"
          [class.text-[var(--muted)]]="!selectedFile">
          <span class="relative z-10 flex items-center justify-center gap-3">
            <lucide-angular *ngIf="!isLoading" [img]="SparklesIcon" class="w-4 h-4"></lucide-angular>
            <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
            {{ isLoading ? 'Analyzing...' : 'Generate Styles' }}
          </span>
        </button>

        <!-- Error -->
        <div *ngIf="error" class="mt-4 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          <p class="text-xs text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- AI Analysis Overlay (full screen) -->
    <div *ngIf="isLoading" class="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center">
      <!-- Background particles -->
      <div class="absolute inset-0 opacity-[0.05]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:30px 30px"></div>

      <!-- Pulsing rings -->
      <div class="relative mb-12">
        <div class="w-32 h-32 rounded-full border border-[#D4AF37]/20 flex items-center justify-center">
          <div class="w-24 h-24 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
            <div class="w-16 h-16 rounded-full border-2 border-t-[#D4AF37] border-r-[#D4AF37]/30 border-b-[#D4AF37]/10 border-l-transparent animate-spin flex items-center justify-center">
              <lucide-angular [img]="SparklesIcon" class="w-6 h-6 text-[#D4AF37] animate-pulse"></lucide-angular>
            </div>
          </div>
        </div>
        <!-- Orbit dot -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-3 h-3 rounded-full bg-[#D4AF37] animate-spin-slow" style="transform-origin: 0 66px;"></div>
      </div>

      <div class="text-center space-y-4 px-8">
        <h3 class="text-3xl luxury-font text-white italic">Crafting Your<br>Profile</h3>
        <div class="space-y-2">
          <p class="text-[11px] uppercase tracking-[0.4em] text-[#9A9A96] animate-pulse">{{ loadingStep }}</p>
        </div>
        <!-- Step pills -->
        <div class="flex items-center justify-center gap-2 pt-4">
          <div *ngFor="let s of loadingSteps; let i = index"
            class="w-2 h-2 rounded-full transition-all duration-500"
            [class.bg-[#D4AF37]]="currentStepIndex >= i"
            [class.bg-white/20]="currentStepIndex < i">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes orbit {
      from { transform: rotate(0deg) translateX(66px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(66px) rotate(-360deg); }
    }
  `]
})
export class UploadComponent {
  private outfitService = inject(OutfitService);
  private router = inject(Router);

  readonly CameraIcon = Camera;
  readonly CheckIcon = CheckCircle;
  readonly CloseIcon = X;
  readonly SparklesIcon = Sparkles;
  readonly ZapIcon = Zap;

  preview: string | null = null;
  selectedFile: File | null = null;
  selectedGender: string | null = null;
  isLoading = false;
  error = '';

  tips = ['Good lighting', 'Face visible', 'Natural setting'];
  genders = [
    { label: 'Male', value: 'Male', emoji: '👨' },
    { label: 'Female', value: 'Female', emoji: '👩' }
  ];

  loadingSteps = ['Detecting face', 'Analyzing skin tone', 'Curating outfits'];
  currentStepIndex = 0;
  get loadingStep() { return this.loadingSteps[this.currentStepIndex] ?? ''; }

  onFile(event: any) {
    const file = event.target.files[0];
    if (file) this.setFile(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  setFile(file: File) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => this.preview = reader.result as string;
    reader.readAsDataURL(file);
  }

  analyze() {
    if (!this.selectedFile) return;
    this.isLoading = true;
    this.error = '';
    this.currentStepIndex = 0;

    // Cycle through loading steps
    const stepInterval = setInterval(() => {
      this.currentStepIndex = Math.min(this.currentStepIndex + 1, this.loadingSteps.length - 1);
    }, 2000);

    this.outfitService.analyzeStyle(this.selectedFile, this.selectedGender || undefined).subscribe({
      next: (result) => {
        clearInterval(stepInterval);
        localStorage.setItem('latest_recommendations', JSON.stringify(result));
        this.router.navigate(['/recommendations']);
      },
      error: (err: any) => {
        clearInterval(stepInterval);
        this.isLoading = false;
        this.error = err.error?.detail || 'Analysis failed. Please try again.';
      }
    });
  }
}
