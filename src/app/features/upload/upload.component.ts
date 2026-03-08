import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OutfitService } from '../../core/services/outfit.service';
import { LucideAngularModule, Upload, CheckCircle, X, Camera, Sparkles } from 'lucide-angular';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[#F7F7F5] pt-20 pb-16">
      <div class="max-w-2xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

        <!-- Header -->
        <div class="text-center space-y-3 mb-12 animate-fade-in">
          <p class="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Step 1 of 1</p>
          <h1 class="text-3xl sm:text-4xl luxury-font text-black">Analyze Your <span class="italic text-[#D4AF37]">Style</span></h1>
          <p class="text-sm text-gray-400 font-light">Upload a clear photo of yourself for the most accurate skin tone analysis.</p>
        </div>

        <!-- Upload Zone -->
        <div class="bg-white border-2 border-dashed border-[#E8E8E4] hover:border-[#D4AF37] transition-colors duration-300 p-10 sm:p-14 text-center cursor-pointer relative animate-slide-up"
          [class.border-[#D4AF37]]="preview"
          (click)="fileInput.click()"
          (dragover)="$event.preventDefault()"
          (drop)="onDrop($event)">
          <input #fileInput type="file" accept="image/*" (change)="onFile($event)" class="hidden">

          <!-- Preview -->
          <div *ngIf="preview" class="space-y-5">
            <img [src]="preview" class="w-40 h-52 sm:w-52 sm:h-72 object-cover mx-auto shadow-xl">
            <div class="flex items-center justify-center gap-2 text-[#D4AF37]">
              <lucide-angular [img]="CheckIcon" class="w-4 h-4"></lucide-angular>
              <span class="text-[10px] uppercase tracking-widest font-bold">Photo Ready</span>
            </div>
            <p class="text-[10px] text-gray-400 uppercase tracking-widest">{{ fileName }}</p>
            <button (click)="$event.stopPropagation(); preview = null; selectedFile = null" class="text-[9px] uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">
              Remove
            </button>
          </div>

          <!-- Placeholder -->
          <div *ngIf="!preview" class="space-y-4">
            <div class="w-16 h-16 bg-[#F7F7F5] border border-[#E8E8E4] rounded-full flex items-center justify-center mx-auto">
              <lucide-angular [img]="CameraIcon" class="w-7 h-7 text-[#D4AF37]"></lucide-angular>
            </div>
            <div>
              <p class="text-base font-bold text-black mb-1">Drop your photo here</p>
              <p class="text-sm text-gray-400 font-light">or click to browse</p>
            </div>
            <p class="text-[9px] uppercase tracking-widest text-gray-300">JPG, PNG, WEBP — Max 10MB</p>
          </div>
        </div>

        <!-- Tips -->
        <div class="grid grid-cols-3 gap-3 mt-6">
          <div *ngFor="let tip of tips" class="bg-white border border-[#E8E8E4] p-4 text-center">
            <p class="text-[9px] uppercase tracking-widest text-gray-400 leading-relaxed">{{ tip }}</p>
          </div>
        </div>

        <!-- Error -->
        <div *ngIf="error" class="mt-4 bg-red-50 border border-red-100 px-4 py-3">
          <p class="text-xs text-red-600">{{ error }}</p>
        </div>

        <!-- Analyze Button -->
        <button (click)="analyze()" [disabled]="!selectedFile || isLoading"
          class="btn-luxury w-full mt-8 disabled:opacity-40 disabled:cursor-not-allowed text-sm">
          <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
          <lucide-angular *ngIf="!isLoading" [img]="SparklesIcon" class="w-4 h-4"></lucide-angular>
          <span>{{ isLoading ? 'Analyzing Your Look...' : 'Analyze My Style' }}</span>
        </button>

        <!-- Loading overlay -->
        <div *ngIf="isLoading" class="mt-6 bg-white border border-[#E8E8E4] px-6 py-5">
          <div class="flex items-center gap-4">
            <div class="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping flex-shrink-0"></div>
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-black">AI is working...</p>
              <p class="text-[10px] text-gray-400 mt-0.5">Detecting skin tone and matching outfits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UploadComponent {
  private outfitService = inject(OutfitService);
  private router = inject(Router);

  readonly CameraIcon = Camera;
  readonly CheckIcon = CheckCircle;
  readonly SparklesIcon = Sparkles;
  readonly UploadIcon = Upload;

  preview: string | null = null;
  selectedFile: File | null = null;
  fileName = '';
  isLoading = false;
  error = '';

  tips = ['Good lighting', 'Face visible', 'Natural setting'];

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
    this.fileName = file.name;
    const reader = new FileReader();
    reader.onload = () => this.preview = reader.result as string;
    reader.readAsDataURL(file);
  }

  analyze() {
    if (!this.selectedFile) return;
    this.isLoading = true;
    this.error = '';
    this.outfitService.analyzeStyle(this.selectedFile).subscribe({
      next: (result) => {
        localStorage.setItem('latest_recommendations', JSON.stringify(result));
        this.router.navigate(['/recommendations']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.error = err.error?.detail || 'Analysis failed. Please try again.';
      }
    });
  }
}
