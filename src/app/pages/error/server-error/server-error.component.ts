import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-server-error',
  imports: [RouterModule],
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="text-center">
          <!-- Error Icon -->
          <div
            class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/20 mb-8"
          >
            <svg
              class="h-12 w-12 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z"
              />
            </svg>
          </div>

          <!-- Error Code -->
          <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-2">500</h1>

          <!-- Error Message -->
          <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Internal Server Error
          </h2>

          <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Something went wrong on our servers. We're working to fix this issue. Please try again
            later or contact support if the problem persists.
          </p>

          <!-- Error Details (if available) -->
          @if (errorMessage()) {
            <div
              class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md p-4 mb-8 text-left"
            >
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error Details</h3>
                  <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{{ errorMessage() }}</p>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              (click)="goHome()"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
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

            <button
              (click)="goBack()"
              class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
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
          </div>

          <!-- Help Text -->
          <div class="mt-12 text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              If this error continues, please contact our
              <a
                href="mailto:support@example.com"
                class="font-medium text-primary hover:text-primary/80"
              >
                support team
              </a>
            </p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">Error ID: {{ errorId() }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerErrorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);

  errorMessage = () => this.route.snapshot.queryParamMap.get('message') || '';
  errorId = () => this.route.snapshot.queryParamMap.get('id') || this.generateErrorId();

  ngOnInit() {
    this.setupSEO();
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: '500 - Internal Server Error',
      description: 'An internal server error occurred. Please try again later.',
      noIndex: true,
    });
  }

  private generateErrorId(): string {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.goHome();
    }
  }

  tryAgain() {
    window.location.reload();
  }
}
