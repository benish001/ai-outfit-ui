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

    getTrendingOutfits(limit: number = 100): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/outfits/trending?limit=${limit}`);
    }

    searchExternalProducts(keyword: string, platform: string = 'amazon', limit: number = 10): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/outfits/search/products?keyword=${keyword}&platform=${platform}&limit=${limit}`);
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

    analyzeStyle(imageFile: File, gender?: string): Observable<any> {
        const formData = new FormData();
        formData.append('image', imageFile);
        if (gender) {
            formData.append('gender', gender);
        }
        return this.http.post(`${environment.apiUrl}/recommendations/analyze`, formData);
    }

    getLatestRecommendation(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/recommendations/latest`);
    }

    getUserStats(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/recommendations/stats`);
    }

    deleteOutfit(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/outfits/${id}`);
    }

}
