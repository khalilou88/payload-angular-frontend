import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { DatePipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-offline',
  imports: [RouterModule, DatePipe],
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
          <!-- Offline Icon -->
          <div
            class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-8"
          >
            <svg
              class="h-12 w-12 text-orange-600 dark:text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12v.01M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
              />
            </svg>
          </div>

          <!-- Connection Status -->
          <div class="mb-4">
            @if (isOnline()) {
              <div
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
              >
                <div class="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Connected
              </div>
            } @else {
              <div
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
              >
                <div class="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                Offline
              </div>
            }
          </div>

          <!-- Error Message -->
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">You're Offline</h1>

          <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            It looks like you've lost your internet connection. Check your network settings and try
            again.
          </p>

          <!-- Network Troubleshooting -->
          <div
            class="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-md p-6 mb-8 text-left"
          >
            <h3 class="text-lg font-medium text-blue-900 dark:text-blue-100 mb-4">
              Troubleshooting Steps
            </h3>
            <ul class="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li class="flex items-start">
                <span class="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></span>
                Check your Wi-Fi or ethernet connection
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></span>
                Try refreshing the page
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></span>
                Check if other websites are working
              </li>
              <li class="flex items-start">
                <span class="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></span>
                Restart your router or modem
              </li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              (click)="checkConnection()"
              [disabled]="isCheckingConnection()"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              @if (isCheckingConnection()) {
                <div
                  class="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                ></div>
                Checking...
              } @else {
                <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Check Connection
              }
            </button>

            <button
              (click)="tryAgain()"
              class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>

            <button
              (click)="goHome()"
              class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Homepage
            </button>
          </div>

          <!-- Last Connection Info -->
          @if (lastConnectionTime()) {
            <div class="mt-8 text-center">
              <p class="text-xs text-gray-400 dark:text-gray-500">
                Last connected: {{ lastConnectionTime() | date: 'short' }}
              </p>
            </div>
          }

          <!-- Auto-retry Info -->
          @if (isAutoRetrying()) {
            <div class="mt-6 text-center">
              <div
                class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <div class="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Auto-retrying connection...
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineComponent implements OnInit {
  private router = inject(Router);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  isOnline = signal(true);
  isCheckingConnection = signal(false);
  isAutoRetrying = signal(false);
  lastConnectionTime = signal<Date | null>(null);

  private autoRetryInterval?: number;
  private connectionCheckTimeout?: number;

  ngOnInit() {
    this.setupSEO();
    this.initializeConnectionStatus();
    this.startAutoRetry();
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'Offline - Connection Lost',
      description: 'You are currently offline. Check your internet connection and try again.',
      noIndex: true,
    });
  }

  private initializeConnectionStatus() {
    if (isPlatformBrowser(this.platformId)) {
      // Set initial online status
      this.isOnline.set(navigator.onLine);

      // Listen for online/offline events
      window.addEventListener('online', () => {
        this.isOnline.set(true);
        this.lastConnectionTime.set(new Date());
        this.stopAutoRetry();

        // Automatically redirect back when connection is restored
        setTimeout(() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            this.router.navigate(['/']);
          }
        }, 2000);
      });

      window.addEventListener('offline', () => {
        this.isOnline.set(false);
        this.startAutoRetry();
      });

      // Set last connection time if we're currently online
      if (navigator.onLine) {
        this.lastConnectionTime.set(new Date());
      }
    }
  }

  private startAutoRetry() {
    if (isPlatformBrowser(this.platformId) && !this.autoRetryInterval) {
      this.isAutoRetrying.set(true);

      this.autoRetryInterval = window.setInterval(() => {
        this.checkConnection(false);
      }, 5000); // Check every 5 seconds
    }
  }

  private stopAutoRetry() {
    if (this.autoRetryInterval) {
      clearInterval(this.autoRetryInterval);
      this.autoRetryInterval = undefined;
      this.isAutoRetrying.set(false);
    }
  }

  checkConnection(manual = true) {
    if (manual) {
      this.isCheckingConnection.set(true);
    }

    if (isPlatformBrowser(this.platformId)) {
      // Clear any existing timeout
      if (this.connectionCheckTimeout) {
        clearTimeout(this.connectionCheckTimeout);
      }

      // Check navigator.onLine first
      if (navigator.onLine) {
        this.isOnline.set(true);
        this.lastConnectionTime.set(new Date());

        if (manual) {
          this.isCheckingConnection.set(false);
          // Show success and redirect
          setTimeout(() => {
            this.tryAgain();
          }, 1000);
        }
        return;
      }

      // Try to fetch a small resource to verify connection
      fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000),
      })
        .then(() => {
          this.isOnline.set(true);
          this.lastConnectionTime.set(new Date());
          this.stopAutoRetry();

          if (manual) {
            this.isCheckingConnection.set(false);
            // Show success and redirect
            setTimeout(() => {
              this.tryAgain();
            }, 1000);
          }
        })
        .catch(() => {
          this.isOnline.set(false);
          if (manual) {
            this.isCheckingConnection.set(false);
          }
        });

      // Set timeout for manual check
      if (manual) {
        this.connectionCheckTimeout = window.setTimeout(() => {
          this.isCheckingConnection.set(false);
        }, 5000);
      }
    }
  }

  tryAgain() {
    window.location.reload();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.stopAutoRetry();
    if (this.connectionCheckTimeout) {
      clearTimeout(this.connectionCheckTimeout);
    }
  }
}
