import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
    email: string;
    name?: string;
    id?: number;
    is_admin?: boolean;
    profile_image?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private userSubject = new BehaviorSubject<User | null>(null);
    public user$ = this.userSubject.asObservable();

    constructor() { this.loadUser(); }

    private loadUser() {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                const stored: User = JSON.parse(userJson);
                this.userSubject.next(stored);
                if (!stored.name) this.fetchMe();
            } catch { this.fetchMe(); }
        } else {
            this.fetchMe();
        }
    }

    fetchMe() {
        this.http.get<any>(`${environment.apiUrl}/auth/me`).subscribe({
            next: (res) => {
                const user: User = { 
                    email: res.email, 
                    name: res.name, 
                    id: res.id, 
                    is_admin: res.is_admin,
                    profile_image: res.profile_image 
                };
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
            },
            error: () => this.logout()
        });
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/auth/register`, userData);
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${environment.apiUrl}/auth/login`, credentials).pipe(
            tap((response: any) => this.setSession(response))
        );
    }

    private setSession(authResult: any) {
        localStorage.setItem('access_token', authResult.access_token);
        localStorage.setItem('refresh_token', authResult.refresh_token);
        const user: User = {
            email: authResult.email || '',
            name: authResult.name || '',
            id: authResult.user_id,
            is_admin: authResult.is_admin || false,
            profile_image: authResult.profile_image
        };
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        if (!user.name) this.fetchMe();
    }

    get currentUser(): User | null { return this.userSubject.value; }
    get isAdmin(): boolean { return this.userSubject.value?.is_admin === true; }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('latest_recommendations');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean { return !!localStorage.getItem('access_token'); }
    getAccessToken() { return localStorage.getItem('access_token'); }

    refreshToken(): Observable<any> {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) return throwError(() => new Error('No refresh token'));
        return this.http.post(`${environment.apiUrl}/auth/refresh`, { refresh_token: refreshToken }).pipe(
            tap((response: any) => {
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
            }),
            catchError(err => { this.logout(); return throwError(() => err); })
        );
    }
}
