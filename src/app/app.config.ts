import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  ErrorHandler,
  Injectable,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  Router,
} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  handleError(error: any): void {
    console.error('Global error caught:', error);

    // Only navigate to error page in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Generate error ID for tracking
      const errorId = this.generateErrorId();

      // Extract meaningful error information
      const errorMessage = this.extractErrorMessage(error);

      // Navigate to generic error page
      this.router
        .navigate(['/error'], {
          queryParams: {
            type: 'generic',
            title: 'Unexpected Error',
            message: errorMessage,
            retry: 'true',
            id: errorId,
          },
          replaceUrl: true,
        })
        .catch(() => {
          // Fallback if routing fails
          console.error('Failed to navigate to error page');
        });
    }
  }

  private extractErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'An unexpected error occurred in the application.';
  }

  private generateErrorId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `JS-${timestamp}-${random}`.toUpperCase();
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      withPreloading(PreloadAllModules),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),

    // Global error handling
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
};
