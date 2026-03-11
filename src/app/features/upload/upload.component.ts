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
    <div class="min-h-screen bg-[#FDFDFB] pt-28 pb-16">
      <div class="max-w-xl mx-auto px-6">

        <!-- Progress Steps -->
        <div class="flex items-center justify-between mb-16 max-w-xs mx-auto">
          <div class="flex flex-col items-center gap-2">
            <div class="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold">1</div>
            <span class="text-[8px] uppercase tracking-widest font-black text-black">Upload</span>
          </div>
          <div class="flex-1 h-[1px] bg-gray-100 mx-4"></div>
          <div class="flex flex-col items-center gap-2">
            <div class="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-300">2</div>
            <span class="text-[8px] uppercase tracking-widest font-bold text-gray-300">Discover</span>
          </div>
        </div>

        <!-- Header -->
        <div class="text-center space-y-4 mb-12 animate-fade-in">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl luxury-font text-black leading-tight">Your Personal <br> <span class="italic text-[#D4AF37]">Style Profile</span></h1>
          <p class="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-light max-w-sm mx-auto">A quick scan of your complexion lets our AI suggest a perfectly curated palette.</p>
        </div>

        <!-- Upload Zone -->
        <div class="bg-[#F7F7F5]/50 border-2 border-dashed border-gray-100 hover:border-[#D4AF37] transition-all duration-700 p-8 sm:p-12 text-center cursor-pointer relative animate-slide-up rounded-2xl group"
          [class.border-[#D4AF37]]="preview"
          [class.bg-white]="preview"
          (click)="fileInput.click()"
          (dragover)="$event.preventDefault()"
          (drop)="onDrop($event)">
          <input #fileInput type="file" accept="image/*" (change)="onFile($event)" class="hidden">

          <!-- Preview -->
          <div *ngIf="preview" class="space-y-6">
            <div class="relative inline-block group/preview">
              <img [src]="preview" class="w-48 h-64 sm:w-60 sm:h-80 object-cover mx-auto shadow-2xl rounded-sm transition-transform duration-700 group-hover/preview:scale-[1.02]">
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity"></div>
            </div>
            
            <div class="flex flex-col items-center gap-3">
              <div class="flex items-center gap-3 px-4 py-2 bg-black text-white rounded-full">
                <lucide-angular [img]="CheckIcon" class="w-3 h-3 text-[#D4AF37]"></lucide-angular>
                <span class="text-[9px] uppercase tracking-[0.3em] font-bold">Image Locked</span>
              </div>
              <button (click)="$event.stopPropagation(); preview = null; selectedFile = null" 
                class="text-[9px] uppercase tracking-[0.4em] text-gray-400 hover:text-red-500 transition-all font-bold">
                Change Selection
              </button>
            </div>
          </div>

          <!-- Placeholder -->
          <div *ngIf="!preview" class="space-y-6">
            <div class="w-20 h-20 bg-white border border-gray-100 rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform duration-500">
              <lucide-angular [img]="CameraIcon" class="w-8 h-8 text-black"></lucide-angular>
            </div>
            <div class="space-y-2">
              <p class="text-lg font-bold text-black">Upload a Portrait</p>
              <p class="text-[10px] uppercase tracking-widest text-gray-400">Drag & Drop or Click to Browse</p>
            </div>
          </div>
        </div>

        <!-- Gender Selection -->
        <div class="mt-12 space-y-6">
          <div class="flex items-center gap-4">
            <div class="h-[1px] flex-1 bg-gray-50"></div>
            <p class="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-black">Preferences</p>
            <div class="h-[1px] flex-1 bg-gray-50"></div>
          </div>
          
          <div class="flex gap-4">
             <button *ngFor="let g of ['Male', 'Female']" 
               (click)="selectedGender = g"
               [class.bg-black]="selectedGender === g"
               [class.text-white]="selectedGender === g"
               [class.border-black]="selectedGender === g"
               [class.bg-white]="selectedGender !== g"
               [class.text-gray-400]="selectedGender !== g"
               [class.border-gray-100]="selectedGender !== g"
               [class.shadow-md]="selectedGender === g"
               class="flex-1 py-5 border rounded-xl text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-500">
               {{ g }}
             </button>
          </div>
        </div>

        <!-- Action -->
        <div class="mt-12">
          <button (click)="analyze()" [disabled]="!selectedFile || isLoading"
            class="w-full relative overflow-hidden bg-black disabled:bg-gray-100 text-white disabled:text-gray-300 py-6 rounded-2xl text-[10px] uppercase tracking-[0.4em] font-black transition-all duration-500 hover:bg-[#D4AF37] hover:text-black group">
            <div class="relative z-10 flex items-center justify-center gap-3">
               <lucide-angular *ngIf="!isLoading" [img]="SparklesIcon" class="w-4 h-4"></lucide-angular>
               <i *ngIf="isLoading" class="pi pi-spin pi-spinner mr-2"></i>
               <span>{{ isLoading ? 'Processing...' : 'Generate My Look' }}</span>
            </div>
          </button>
          
          <!-- Tip Banner -->
          <div *ngIf="!isLoading" class="mt-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100 animate-fade-in text-center">
             <p class="text-[9px] uppercase tracking-[0.2em] text-gray-400 leading-relaxed italic">
               <lucide-angular [img]="CheckIcon" class="w-3 h-3 inline mr-2 text-[#D4AF37]"></lucide-angular>
               Pro Tip: Use natural daylight for the most accurate results
             </p>
          </div>
        </div>

        <!-- Full Page Analysis Overlay -->
        <div *ngIf="isLoading" class="fixed inset-0 z-[200] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
           <div class="w-24 h-[1px] bg-gray-100 mb-12"></div>
           <div class="relative w-40 h-40 mb-12">
              <div class="absolute inset-0 border border-gray-100 rounded-full"></div>
              <div class="absolute inset-0 border-t-2 border-[#D4AF37] rounded-full animate-spin"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                 <lucide-angular [img]="SparklesIcon" class="w-8 h-8 text-[#D4AF37] animate-pulse"></lucide-angular>
              </div>
           </div>
           <div class="text-center space-y-4">
              <h3 class="text-2xl luxury-font text-black italic">Crafting Your Profile</h3>
              <p class="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold animate-pulse">Scanning Skin Tone...</p>
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
  selectedGender: string | null = null;
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
    this.outfitService.analyzeStyle(this.selectedFile, this.selectedGender || undefined).subscribe({
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
