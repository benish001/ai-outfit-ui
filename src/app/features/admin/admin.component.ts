import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OutfitService } from '../../core/services/outfit.service';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LucideAngularModule, Plus, Trash2, ExternalLink, X, ShieldCheck, Package, Sparkles } from 'lucide-angular';

@Component({
   selector: 'app-admin',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule, InputText, InputNumber, Select, TableModule, Toast, LucideAngularModule],
   providers: [MessageService],
   template: `
    <div class="min-h-screen bg-[#F7F7F5] pt-20 pb-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <!-- Page Header -->
        <div class="bg-white border border-[#E8E8E4] px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 animate-fade-in">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2 mb-2">
              <lucide-angular [img]="ShieldIcon" class="w-4 h-4 text-[#D4AF37]"></lucide-angular>
              <span class="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Admin Portal</span>
            </div>
            <h1 class="text-2xl sm:text-3xl luxury-font text-black">Catalog <span class="text-[#D4AF37] italic">Manager</span></h1>
            <p class="text-[10px] uppercase tracking-widest text-gray-400">{{ outfits.length }} outfits in catalog</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button (click)="triggerSync()" [disabled]="isLoading"
              class="flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white hover:bg-gray-800 transition-all disabled:opacity-50">
              <lucide-angular [img]="SparklesIcon" class="w-4 h-4 text-[#D4AF37]"></lucide-angular>
              {{ isLoading ? 'Generating...' : 'Trigger Daily Sync' }}
            </button>
            <button (click)="toggleImportMode()"
              class="flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
              [class.btn-luxury]="showImport"
              [class.btn-luxury-outline]="!showImport">
              <lucide-angular [img]="PlusIcon" class="w-4 h-4"></lucide-angular>
              {{ showImport ? 'Manual Add' : 'Import from URL' }}
            </button>
            <button (click)="toggleAddMode()"
              class="flex items-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
              [class.btn-luxury]="!showForm && !showImport"
              [class.btn-luxury-outline]="showForm || showImport">
              <lucide-angular [img]="showForm ? CloseIcon : PlusIcon" class="w-4 h-4"></lucide-angular>
              {{ showForm ? 'Cancel' : 'Add Outfit' }}
            </button>
          </div>
        </div>

        <!-- Import from URL Form -->
        <div *ngIf="showImport" class="bg-white border border-[#E8E8E4] shadow-sm animate-slide-up">
          <div class="px-6 sm:px-10 py-6 border-b border-[#E8E8E4]">
            <h2 class="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-400">Import from Amazon / Flipkart</h2>
          </div>
          <form [formGroup]="importForm" (ngSubmit)="onImportSubmit()" class="px-6 sm:px-10 py-8 space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="sm:col-span-2 space-y-1.5">
                <label class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Product URL *</label>
                <input pInputText formControlName="url" placeholder="Paste Amazon or Flipkart URL" class="luxury-input w-full">
              </div>
              <div class="space-y-1.5">
                <label class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Category *</label>
                <p-select [options]="categories" formControlName="category" placeholder="Select" styleClass="w-full"></p-select>
              </div>
              <div class="space-y-1.5">
                <label class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Color *</label>
                <p-select [options]="colors" formControlName="color" placeholder="Select" styleClass="w-full"></p-select>
              </div>
              <div class="space-y-1.5">
                <label class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Brand</label>
                <input pInputText formControlName="brand" placeholder="Auto-detected if empty" class="luxury-input w-full">
              </div>
            </div>
            <div class="flex justify-end">
              <button type="submit" [disabled]="importForm.invalid || isLoading" class="btn-luxury px-10 disabled:opacity-40">
                <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
                <span>{{ isLoading ? 'Importing...' : 'Fetch & Import' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Add Form -->
        <div *ngIf="showForm" class="bg-white border border-[#E8E8E4] shadow-sm animate-slide-up">
          <div class="px-6 sm:px-10 py-6 border-b border-[#E8E8E4]">
            <h2 class="text-[11px] uppercase tracking-[0.3em] font-bold text-gray-400">New Outfit Details</h2>
          </div>
          <form [formGroup]="outfitForm" (ngSubmit)="onSubmit()" class="px-6 sm:px-10 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <div class="space-y-1.5">
              <label class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Outfit Name *</label>
              <input pInputText formControlName="name" placeholder="e.g. Classic White Shirt" class="luxury-input w-full">
            </div>

            <div class="space-y-1.5">
              <label class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Category *</label>
              <p-select [options]="categories" formControlName="category" placeholder="Select" styleClass="w-full"></p-select>
            </div>

            <div class="space-y-1.5">
              <label class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Color *</label>
              <p-select [options]="colors" formControlName="color" placeholder="Select" styleClass="w-full"></p-select>
            </div>

            <div class="space-y-1.5">
              <label class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Brand *</label>
              <input pInputText formControlName="brand" placeholder="e.g. H&M" class="luxury-input w-full">
            </div>

            <div class="space-y-1.5">
              <label class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Price (INR) *</label>
              <p-inputNumber formControlName="price" mode="currency" currency="INR" locale="en-IN" styleClass="w-full" inputStyleClass="luxury-input w-full"></p-inputNumber>
            </div>

            <div class="space-y-1.5">
              <label class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Affiliate Link *</label>
              <input pInputText formControlName="affiliate_link" placeholder="https://..." class="luxury-input w-full">
            </div>

            <!-- Image Upload -->
            <div class="sm:col-span-2 lg:col-span-3 space-y-3">
              <label class="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400">Outfit Image *</label>
              <div class="flex items-center gap-5">
                <div class="w-24 h-32 bg-[#F7F7F5] border border-dashed border-[#E8E8E4] flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img *ngIf="imagePreview" [src]="imagePreview" class="w-full h-full object-cover">
                  <lucide-angular *ngIf="!imagePreview" [img]="PlusIcon" class="w-5 h-5 text-gray-300"></lucide-angular>
                </div>
                <div>
                  <input type="file" accept="image/*" (change)="onFileSelected($event)" class="hidden" #imgInput>
                  <button type="button" (click)="imgInput.click()" class="btn-luxury-outline text-[9px] px-5 py-2.5">
                    Choose Image
                  </button>
                  <p *ngIf="imagePreview" class="text-[9px] text-gray-400 mt-2 uppercase tracking-widest">Image selected ✓</p>
                </div>
              </div>
            </div>

            <!-- Submit -->
            <div class="sm:col-span-2 lg:col-span-3 pt-4 border-t border-[#E8E8E4] flex justify-end">
              <button type="submit" [disabled]="outfitForm.invalid || isLoading" class="btn-luxury px-10 disabled:opacity-40">
                <i *ngIf="isLoading" class="pi pi-spin pi-spinner"></i>
                <span>{{ isLoading ? 'Saving...' : 'Save Outfit' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Table -->
        <div class="bg-white border border-[#E8E8E4] overflow-hidden animate-fade-in">
          <div class="px-6 sm:px-10 py-5 border-b border-[#E8E8E4] flex items-center gap-2">
            <lucide-angular [img]="PackageIcon" class="w-4 h-4 text-gray-400"></lucide-angular>
            <h2 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Outfit Catalog</h2>
          </div>

          <!-- Mobile Cards -->
          <div class="block sm:hidden divide-y divide-[#F0F0EE]">
            <div *ngFor="let outfit of outfits" class="px-5 py-4 flex items-center gap-4">
              <img [src]="outfit.base64Image || outfit.image_url" class="w-12 h-16 object-cover flex-shrink-0 bg-gray-100">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold uppercase tracking-wide text-black truncate">{{ outfit.name }}</p>
                <p class="text-[10px] text-gray-400 uppercase tracking-widest">{{ outfit.category }} · {{ outfit.brand }}</p>
                <p class="text-[11px] font-black text-black mt-1">{{ outfit.price | currency:'INR':'symbol':'1.0-0' }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <a [href]="outfit.affiliate_link" target="_blank" class="text-gray-400 hover:text-[#D4AF37]">
                  <lucide-angular [img]="LinkIcon" class="w-4 h-4"></lucide-angular>
                </a>
                <button (click)="onDelete(outfit.id)" class="text-gray-300 hover:text-red-500">
                  <lucide-angular [img]="TrashIcon" class="w-4 h-4"></lucide-angular>
                </button>
              </div>
            </div>
            <div *ngIf="outfits.length === 0" class="px-5 py-16 text-center">
              <p class="text-[10px] uppercase tracking-widest text-gray-300">No outfits yet. Add your first one above.</p>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden sm:block overflow-x-auto">
            <p-table [value]="outfits" [rows]="15" [paginator]="true" styleClass="p-datatable-sm">
              <ng-template pTemplate="header">
                <tr>
                  <th style="width:80px">Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Color</th>
                  <th>Price</th>
                  <th style="width:100px" class="text-center">Actions</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-outfit>
                <tr>
                  <td>
                    <img [src]="outfit.base64Image || outfit.image_url"
                      class="w-10 h-14 object-cover bg-gray-100"
                      (error)="$any($event.target).style.display='none'">
                  </td>
                  <td class="font-bold text-xs uppercase tracking-wide text-black">{{ outfit.name }}</td>
                  <td class="text-xs text-gray-500 uppercase tracking-widest">{{ outfit.category }}</td>
                  <td class="text-xs text-gray-500 uppercase tracking-widest">{{ outfit.brand }}</td>
                  <td class="text-xs text-gray-500 uppercase tracking-widest">{{ outfit.color }}</td>
                  <td class="text-xs font-black text-black">{{ outfit.price | currency:'INR':'symbol':'1.0-0' }}</td>
                  <td>
                    <div class="flex items-center justify-center gap-4">
                      <a [href]="outfit.affiliate_link" target="_blank" class="text-gray-400 hover:text-[#D4AF37] transition-colors">
                        <lucide-angular [img]="LinkIcon" class="w-4 h-4"></lucide-angular>
                      </a>
                      <button (click)="onDelete(outfit.id)" class="text-gray-300 hover:text-red-500 transition-colors">
                        <lucide-angular [img]="TrashIcon" class="w-4 h-4"></lucide-angular>
                      </button>
                    </div>
                  </td>
                </tr>
              </ng-template>
              <ng-template pTemplate="emptymessage">
                <tr><td colspan="7" class="text-center py-16 text-[10px] uppercase tracking-widest text-gray-300">No outfits in catalog yet.</td></tr>
              </ng-template>
            </p-table>
          </div>
        </div>
      </div>
    </div>
    <p-toast></p-toast>
  `
})
export class AdminComponent implements OnInit {
   private fb = inject(FormBuilder);
   private outfitService = inject(OutfitService);
   private messageService = inject(MessageService);

   readonly PlusIcon = Plus;
   readonly TrashIcon = Trash2;
   readonly LinkIcon = ExternalLink;
   readonly CloseIcon = X;
   readonly ShieldIcon = ShieldCheck;
   readonly PackageIcon = Package;
   readonly SparklesIcon = Sparkles;

   showForm = false;
   showImport = false;
   isLoading = false;
   outfits: any[] = [];
   selectedFile: File | null = null;
   imagePreview: string | null = null;

   categories = ['Shirts', 'T-Shirts', 'Trousers', 'Dresses', 'Suits', 'Jackets', 'Skirts', 'Accessories'];
   colors = ['White', 'Black', 'Blue', 'Navy', 'Gray', 'Beige', 'Brown', 'Red', 'Pink', 'Green', 'Olive', 'Maroon', 'Yellow', 'Light Blue'];

   outfitForm: FormGroup = this.fb.group({
      name: ['', Validators.required],
      category: ['Shirts', Validators.required],
      color: ['White', Validators.required],
      brand: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      affiliate_link: ['', Validators.required]
   });

   importForm: FormGroup = this.fb.group({
      url: ['', [Validators.required, Validators.pattern('https?://.*')]],
      category: ['Shirts', Validators.required],
      color: ['White', Validators.required],
      brand: ['']
   });

   ngOnInit() { this.loadOutfits(); }

   toggleImportMode() {
      this.showImport = !this.showImport;
      if (this.showImport) this.showForm = false;
   }

   toggleAddMode() {
      this.showForm = !this.showForm;
      if (this.showForm) this.showImport = false;
   }

   loadOutfits() {
      this.outfitService.getOutfits().subscribe({
         next: (data: any[]) => {
            this.outfits = data;
            this.outfits.forEach(outfit => {
               if (outfit.blob_name && outfit.bucket_name) {
                  this.outfitService.getBlobAsBase64(outfit.blob_name, outfit.bucket_name).subscribe({
                     next: (b64) => outfit.base64Image = b64,
                     error: () => outfit.base64Image = outfit.image_url
                  });
               } else {
                  outfit.base64Image = outfit.image_url;
               }
            });
         },
         error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load outfits' })
      });
   }

   onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
         this.selectedFile = file;
         const reader = new FileReader();
         reader.onload = () => this.imagePreview = reader.result as string;
         reader.readAsDataURL(file);
      }
   }

   onSubmit() {
      if (this.outfitForm.valid && this.selectedFile) {
         this.isLoading = true;
         const formData = new FormData();
         Object.keys(this.outfitForm.value).forEach(k => formData.append(k, this.outfitForm.value[k]));
         formData.append('image', this.selectedFile);
         this.outfitService.uploadOutfit(formData).subscribe({
            next: () => {
               this.isLoading = false;
               this.showForm = false;
               this.outfitForm.reset({ category: 'Shirts', color: 'White', price: 0 });
               this.imagePreview = null;
               this.selectedFile = null;
               this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Outfit added to catalog' });
               this.loadOutfits();
            },
            error: () => { this.isLoading = false; this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save outfit' }); }
         });
      } else if (!this.selectedFile) {
         this.messageService.add({ severity: 'warn', summary: 'Missing Image', detail: 'Please select an image file' });
      }
   }

   onImportSubmit() {
      if (this.importForm.valid) {
         this.isLoading = true;
         this.outfitService.importProduct(this.importForm.value).subscribe({
            next: () => {
               this.isLoading = false;
               this.showImport = false;
               this.importForm.reset({ category: 'Shirts', color: 'White' });
               this.messageService.add({ severity: 'success', summary: 'Imported', detail: 'Product fetched and added to catalog' });
               this.loadOutfits();
            },
            error: (err) => {
               this.isLoading = false;
               this.messageService.add({ severity: 'error', summary: 'Import Failed', detail: err.error?.detail || 'Could not import product' });
            }
         });
      }
   }

   triggerSync() {
      this.isLoading = true;
      this.outfitService.syncProducts().subscribe({
         next: (res) => {
            this.isLoading = false;
            this.messageService.add({
               severity: 'success',
               summary: 'Sync Started',
               detail: 'Auto-import job is running in the background'
            });
            // Reload outfits after a short delay
            setTimeout(() => this.loadOutfits(), 5000);
         },
         error: (err) => {
            this.isLoading = false;
            this.messageService.add({
               severity: 'error',
               summary: 'Sync Failed',
               detail: err.error?.detail || 'Could not start sync'
            });
         }
      });
   }

   onDelete(id: number) {
      if (confirm('Remove this outfit from the catalog?')) {
         this.outfitService.deleteOutfit(id).subscribe({
            next: () => { this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Outfit removed' }); this.loadOutfits(); }
         });
      }
   }
}
