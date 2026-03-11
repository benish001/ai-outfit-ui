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
    <div class="min-h-screen bg-[#F8F8F6] pt-16 page-content">
      <div class="max-w-lg mx-auto px-5 py-10">

        <!-- Progress Steps -->
        <div class="flex items-center justify-center gap-3 mb-12">
          <div class="flex flex-col items-center gap-1.5">
            <div class="w-9 h-9 rounded-full bg-black border-2 border-black flex items-center justify-center text-white text-[11px] font-black">1</div>
            <span class="text-[9px] uppercase tracking-widest font-black text-black">Upload</span>
          </div>
          <div class="flex-1 h-px bg-[#EDEDE9] max-w-[60px]"></div>
          <div class="flex flex-col items-center gap-1.5">
            <div class="w-9 h-9 rounded-full border-2 border-[#EDEDE9] flex items-center justify-center text-[11px] font-black text-[#9A9A96]">2</div>
            <span class="text-[9px] uppercase tracking-widest font-bold text-[#9A9A96]">Discover</span>
          </div>
        </div>

        <!-- Header -->
        <div class="text-center space-y-3 mb-10 animate-fade-in">
          <h1 class="text-3xl sm:text-4xl luxury-font text-black leading-tight">
            Your Style<br>
            <span class="italic text-[#D4AF37]">Profile</span>
          </h1>
          <p class="text-[11px] uppercase tracking-[0.2em] text-[#9A9A96] font-light max-w-xs mx-auto">Our AI scans your complexion and curates the perfect palette</p>
        </div>

        <!-- Upload Zone -->
        <div class="bg-white border-2 border-dashed rounded-2xl transition-all duration-700 cursor-pointer relative overflow-hidden animate-slide-up mb-8"
          [class.border-[#D4AF37]]="preview"
          [class.border-[#EDEDE9]]="!preview"
          [class.shadow-xl]="preview"
          (click)="fileInput.click()"
          (dragover)="$event.preventDefault()"
          (drop)="onDrop($event)">
          <input #fileInput type="file" accept="image/*" (change)="onFile($event)" class="hidden">

          <!-- Preview state -->
          <div *ngIf="preview" class="relative">
            <img [src]="preview" class="w-full rounded-2xl" style="aspect-ratio:4/5; object-fit:cover;">
            <!-- Overlay controls -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl flex flex-col justify-end p-5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2">
                  <lucide-angular [img]="CheckIcon" class="w-3 h-3 text-green-500"></lucide-angular>
                  <span class="text-[10px] uppercase tracking-widest font-black text-black">Image Ready</span>
                </div>
                <button (click)="$event.stopPropagation(); preview = null; selectedFile = null"
                  class="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all">
                  <lucide-angular [img]="CloseIcon" class="w-4 h-4"></lucide-angular>
                </button>
              </div>
            </div>
          </div>

          <!-- Placeholder state -->
          <div *ngIf="!preview" class="flex flex-col items-center justify-center py-16 px-6 space-y-6">
            <div class="w-24 h-24 bg-[#F9F3E3] rounded-3xl flex items-center justify-center transition-transform duration-500 hover:scale-110">
              <lucide-angular [img]="CameraIcon" class="w-10 h-10 text-[#D4AF37]"></lucide-angular>
            </div>
            <div class="text-center space-y-2">
              <p class="text-lg font-bold text-black">Upload a Portrait</p>
              <p class="text-[11px] uppercase tracking-widest text-[#9A9A96]">Drag & Drop or Tap to Browse</p>
            </div>
            <div class="flex flex-wrap gap-2 justify-center">
              <span *ngFor="let tip of tips" class="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F8F6] rounded-full text-[9px] font-semibold uppercase tracking-wider text-[#9A9A96]">
                <lucide-angular [img]="CheckIcon" class="w-3 h-3 text-[#D4AF37]"></lucide-angular>
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
              class="relative flex flex-col items-center gap-3 py-6 rounded-2xl border-2 transition-all duration-300"
              [class.border-black]="selectedGender === g.value"
              [class.bg-black]="selectedGender === g.value"
              [class.border-[#EDEDE9]]="selectedGender !== g.value"
              [class.bg-white]="selectedGender !== g.value"
              [class.shadow-lg]="selectedGender === g.value">
              <span class="text-3xl">{{ g.emoji }}</span>
              <span class="text-[11px] uppercase tracking-[0.2em] font-black transition-colors"
                [class.text-white]="selectedGender === g.value"
                [class.text-[#9A9A96]]="selectedGender !== g.value">
                {{ g.label }}
              </span>
              <!-- Checkmark -->
              <div *ngIf="selectedGender === g.value" class="absolute top-3 right-3 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <lucide-angular [img]="CheckIcon" class="w-3 h-3 text-black"></lucide-angular>
              </div>
            </button>
          </div>
        </div>

        <!-- Analyze Button -->
        <button (click)="analyze()" [disabled]="!selectedFile || isLoading"
          class="w-full relative overflow-hidden rounded-2xl py-5 text-[11px] uppercase tracking-[0.3em] font-black transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
          [class.bg-black]="selectedFile && !isLoading"
          [class.text-white]="selectedFile && !isLoading"
          [class.hover:bg-[#D4AF37]]="selectedFile && !isLoading"
          [class.bg-[#EDEDE9]]="!selectedFile"
          [class.text-[#9A9A96]]="!selectedFile">
          <span class="relative z-10 flex items-center justify-center gap-3">
            <lucide-angular *ngIf="!isLoading" [img]="SparklesIcon" class="w-5 h-5"></lucide-angular>
            <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
            {{ isLoading ? 'Processing...' : 'Generate My Look' }}
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
