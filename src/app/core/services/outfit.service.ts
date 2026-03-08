import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OutfitService {
    private http = inject(HttpClient);

    getOutfits(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/outfits/`);
    }

    importProduct(data: { url: string, category: string, color: string, brand: string }): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/import`, data);
    }

    syncProducts(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/sync`, {});
    }

    uploadOutfit(formData: FormData): Observable<any> {
        return this.http.post(`${environment.apiUrl}/outfits/`, formData);
    }

    analyzeStyle(imageFile: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', imageFile);
        return this.http.post(`${environment.apiUrl}/outfit/analyze`, formData);
    }

    deleteOutfit(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/outfits/${id}`);
    }

    /**
     * Fetch a blob from Azure via the backend proxy and return as base64 data URL.
     * Usage: getProfileImage(blobName, bucket) -> base64 string for <img [src]="...">
     *
     * @param blobName  Full blob path e.g. "outfits/uuid_shirt.jpg"
     * @param bucket    Bucket label e.g. "azure~careai-emr-transcription"
     */
    getBlobAsBase64(blobName: string, bucket: string): Observable<string> {
        const params = new URLSearchParams({ blob_name: blobName, bucket });
        return this.http
            .get(`${environment.apiUrl}/storage/blob?${params.toString()}`, {
                responseType: 'blob'
            })
            .pipe(
                switchMap((blob: Blob) => from(this.convertBlobToBase64(blob)))
            );
    }

    private convertBlobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}
