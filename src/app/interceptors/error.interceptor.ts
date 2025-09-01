import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only handle navigation in browser environment
      if (isPlatformBrowser(platformId)) {
        handleErrorNavigation(error, router);
      }

      return throwError(() => error);
    }),
  );
};

function handleErrorNavigation(error: HttpErrorResponse, router: Router) {
  const errorId = generateErrorId();

  // Network errors (no internet connection)
  if (error.status === 0) {
    router.navigate(['/offline']);
    return;
  }

  // Handle specific status codes
  switch (error.status) {
    case 401:
      // Unauthorized - redirect to login with return URL
      const returnUrl = router.url !== '/login' ? router.url : '/';
      router.navigate(['/login'], {
        queryParams: { returnUrl },
        replaceUrl: true,
      });
      break;

    case 403:
      // Forbidden - show generic error with specific message
      router.navigate(['/error'], {
        queryParams: {
          type: '403',
          message: "You don't have permission to access this resource.",
          id: errorId,
        },
        replaceUrl: true,
      });
      break;

    case 404:
      // Not Found - let the router handle this naturally
      // Don't redirect here as it might interfere with route resolution
      break;

    case 408:
      // Request Timeout
      router.navigate(['/error'], {
        queryParams: {
          type: '408',
          retry: 'true',
          id: errorId,
        },
        replaceUrl: true,
      });
      break;

    case 429:
      // Too Many Requests
      router.navigate(['/error'], {
        queryParams: {
          type: '429',
          message: "You've made too many requests. Please wait a moment before trying again.",
          retry: 'true',
          id: errorId,
        },
        replaceUrl: true,
      });
      break;

    case 500:
      // Internal Server Error - dedicated page
      router.navigate(['/500'], {
        queryParams: {
          message: error.error?.message || 'An unexpected server error occurred.',
          id: errorId,
        },
        replaceUrl: true,
      });
      break;

    case 502:
      // Bad Gateway
      router.navigate(['/error'], {
        queryParams: {
          type: '502',
          retry: 'true',
          id: errorId,
        },
        replaceUrl: true,
      });
      break;

    case 503:
      // Service Unavailable
      router.navigate(['/error'], {
        queryParams: {
          type: '503',
          message:
            'The service is temporarily unavailable for maintenance. Please try again later.',
          retry: 'true',
          contact: 'false',
          id: errorId,
        },
        replaceUrl: true,
      });
      break;

    case 504:
      // Gateway Timeout
      router.navigate(['/error'], {
        queryParams: {
          type: '504',
          retry: 'true',
          id: errorId,
        },
        replaceUrl: true,
      });
      break;

    default:
      // For other 4xx and 5xx errors, show generic error page
      if (error.status >= 400) {
        let errorType = '500'; // Default to server error

        if (error.status >= 400 && error.status < 500) {
          errorType = error.status.toString();
        }

        router.navigate(['/error'], {
          queryParams: {
            type: errorType,
            message: error.error?.message || getDefaultErrorMessage(error.status),
            retry: shouldShowRetry(error.status) ? 'true' : 'false',
            id: errorId,
          },
          replaceUrl: true,
        });
      }
      break;
  }
}

function generateErrorId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${random}`.toUpperCase();
}

function getDefaultErrorMessage(status: number): string {
  if (status >= 500) {
    return 'A server error occurred. Please try again later.';
  } else if (status >= 400) {
    return 'There was a problem with your request. Please check and try again.';
  }
  return 'An unexpected error occurred.';
}

function shouldShowRetry(status: number): boolean {
  // Show retry for server errors and some client errors
  return status >= 500 || [408, 429].includes(status);
}
