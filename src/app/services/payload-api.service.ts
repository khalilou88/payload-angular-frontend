import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import {
  Page,
  Post,
  Media,
  Category,
  Header,
  Footer,
  PayloadResponse,
  User,
  AuthResponse,
  SearchResult,
} from '../types/payload.types';

@Injectable({
  providedIn: 'root',
})
export class PayloadApiService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private readonly baseUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkAuthStatus();
    }
  }

  // Auth Methods
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/users/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (response.token && isPlatformBrowser(this.platformId)) {
            localStorage.setItem('payload-token', response.token);
            this.currentUserSubject.next(response.user || null);
          }
        }),
        catchError(this.handleError),
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/users/logout`,
        {},
        {
          headers: this.getAuthHeaders(),
        },
      )
      .pipe(
        tap(() => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('payload-token');
          }
          this.currentUserSubject.next(null);
        }),
        catchError(this.handleError),
      );
  }

  register(userData: { email: string; password: string; name?: string }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/users`, userData)
      .pipe(catchError(this.handleError));
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/users/forgot-password`, { email })
      .pipe(catchError(this.handleError));
  }

  resetPassword(token: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/users/reset-password`, {
        token,
        password,
      })
      .pipe(
        tap((response) => {
          if (response.token && isPlatformBrowser(this.platformId)) {
            localStorage.setItem('payload-token', response.token);
            this.currentUserSubject.next(response.user || null);
          }
        }),
        catchError(this.handleError),
      );
  }

  checkAuthStatus(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('payload-token');
    if (token) {
      this.http
        .get<{ user: User }>(`${this.baseUrl}/users/me`, {
          headers: this.getAuthHeaders(),
        })
        .subscribe({
          next: (response) => {
            this.currentUserSubject.next(response.user);
          },
          error: () => {
            localStorage.removeItem('payload-token');
            this.currentUserSubject.next(null);
          },
        });
    }
  }

  // Pages Methods
  getPages(params?: any): Observable<PayloadResponse<Page>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http
      .get<PayloadResponse<Page>>(`${this.baseUrl}/pages`, {
        params: httpParams,
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getPageBySlug(slug: string, draft = false): Observable<Page | null> {
    let params = new HttpParams().set('where[slug][equals]', slug).set('limit', '1');

    if (draft) {
      params = params.set('draft', 'true');
    }

    return this.http
      .get<PayloadResponse<Page>>(`${this.baseUrl}/pages`, {
        params,
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => (response.docs.length > 0 ? response.docs[0] : null)),
        catchError(this.handleError),
      );
  }

  getPageById(id: string, draft = false): Observable<Page> {
    let params = new HttpParams();
    if (draft) {
      params = params.set('draft', 'true');
    }

    return this.http
      .get<Page>(`${this.baseUrl}/pages/${id}`, {
        params,
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // Posts Methods
  getPosts(params?: any): Observable<PayloadResponse<Post>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          params[key].forEach((value: any) => {
            httpParams = httpParams.append(key, value);
          });
        } else {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http
      .get<PayloadResponse<Post>>(`${this.baseUrl}/posts`, {
        params: httpParams,
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getPostBySlug(slug: string, draft = false): Observable<Post | null> {
    let params = new HttpParams().set('where[slug][equals]', slug).set('limit', '1');

    if (draft) {
      params = params.set('draft', 'true');
    }

    return this.http
      .get<PayloadResponse<Post>>(`${this.baseUrl}/posts`, {
        params,
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => (response.docs.length > 0 ? response.docs[0] : null)),
        catchError(this.handleError),
      );
  }

  getPostById(id: string, draft = false): Observable<Post> {
    let params = new HttpParams();
    if (draft) {
      params = params.set('draft', 'true');
    }

    return this.http
      .get<Post>(`${this.baseUrl}/posts/${id}`, {
        params,
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // Categories Methods
  getCategories(): Observable<PayloadResponse<Category>> {
    return this.http
      .get<PayloadResponse<Category>>(`${this.baseUrl}/categories`)
      .pipe(catchError(this.handleError));
  }

  getCategoryBySlug(slug: string): Observable<Category | null> {
    const params = new HttpParams().set('where[slug][equals]', slug).set('limit', '1');

    return this.http.get<PayloadResponse<Category>>(`${this.baseUrl}/categories`, { params }).pipe(
      map((response) => (response.docs.length > 0 ? response.docs[0] : null)),
      catchError(this.handleError),
    );
  }

  // Media Methods
  getMedia(params?: any): Observable<PayloadResponse<Media>> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http
      .get<PayloadResponse<Media>>(`${this.baseUrl}/media`, {
        params: httpParams,
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // Globals Methods
  getHeader(): Observable<Header> {
    return this.http
      .get<Header>(`${this.baseUrl}/globals/header`)
      .pipe(catchError(this.handleError));
  }

  getFooter(): Observable<Footer> {
    return this.http
      .get<Footer>(`${this.baseUrl}/globals/footer`)
      .pipe(catchError(this.handleError));
  }

  // Search Methods
  search(query: string): Observable<SearchResult[]> {
    const params = new HttpParams().set('query', query);

    return this.http.get<{ docs: SearchResult[] }>(`${this.baseUrl}/search`, { params }).pipe(
      map((response) => response.docs),
      catchError(this.handleError),
    );
  }

  // Revalidation Methods
  revalidatePage(slug: string): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/revalidate`,
        { slug },
        {
          headers: this.getAuthHeaders(),
        },
      )
      .pipe(catchError(this.handleError));
  }

  revalidatePost(slug: string): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/revalidate`,
        { slug: `blog/${slug}` },
        {
          headers: this.getAuthHeaders(),
        },
      )
      .pipe(catchError(this.handleError));
  }

  // Preview Methods
  getPreview(collection: string, id: string): Observable<Page | Post> {
    const params = new HttpParams().set('collection', collection).set('id', id);

    return this.http
      .get<Page | Post>(`${this.baseUrl}/preview`, {
        params,
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  // Helper Methods
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('payload-token');
      if (token) {
        headers = headers.set('Authorization', `JWT ${token}`);
      }
    }

    return headers;
  }

  private handleError(error: any): Observable<never> {
    console.error('Payload API Error:', error);
    return throwError(() => error);
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Profile Management Methods
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http
      .patch<User>(`${this.baseUrl}/users/me`, userData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((user) => {
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError),
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        `${this.baseUrl}/users/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: this.getAuthHeaders(),
        },
      )
      .pipe(catchError(this.handleError));
  }

  // File Upload Method
  uploadFile(file: File, alt?: string): Observable<Media> {
    const formData = new FormData();
    formData.append('file', file);
    if (alt) {
      formData.append('alt', alt);
    }

    return this.http
      .post<Media>(`${this.baseUrl}/media`, formData, {
        headers: this.getAuthHeaders().delete('Content-Type'), // Let browser set content-type for FormData
      })
      .pipe(catchError(this.handleError));
  }
}
