import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  computed,
} from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

interface ErrorConfig {
  code: string;
  title: string;
  message: string;
  icon: 'error' | 'warning' | 'info';
  color: 'red' | 'orange' | 'blue';
}

@Component({
  selector: 'app-generic-error',
  imports: [RouterModule],
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-lg">
        <div class="text-center">
          <!-- Error Icon -->
          <div [class]="errorIconClasses()">
            @switch (errorConfig().icon) {
              @case ('error') {
                <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z"
                  />
                </svg>
              }
              @case ('warning') {
                <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              }
              @case ('info') {
                <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            }
          </div>

          <!-- Error Code -->
          @if (errorConfig().code) {
            <h1 [class]="errorCodeClasses()">{{ errorConfig().code }}</h1>
          }

          <!-- Error Title -->
          <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {{ errorConfig().title }}
          </h2>

          <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {{ errorConfig().message }}
          </p>

          <!-- Custom Error Details -->
          @if (customMessage()) {
            <div [class]="errorDetailsClasses()">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    [class]="errorDetailsIconClasses()"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 [class]="errorDetailsTitleClasses()">Additional Information</h3>
                  <div [class]="errorDetailsTextClasses()">
                    <p>{{ customMessage() }}</p>
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

            @if (showRetry()) {
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
            }
          </div>

          <!-- Help Text -->
          @if (showContactSupport()) {
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
              @if (errorId()) {
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Error ID: {{ errorId() }}
                </p>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericErrorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);

  // Query parameters
  private errorType = () => this.route.snapshot.queryParamMap.get('type') || '500';
  private customTitle = () => this.route.snapshot.queryParamMap.get('title');
  protected customMessage = () => this.route.snapshot.queryParamMap.get('message');
  protected errorId = () => this.route.snapshot.queryParamMap.get('id');
  protected showRetry = () => this.route.snapshot.queryParamMap.get('retry') === 'true';
  protected showContactSupport = () => this.route.snapshot.queryParamMap.get('contact') !== 'false';

  // Error configurations
  private errorConfigs: Record<string, ErrorConfig> = {
    '400': {
      code: '400',
      title: 'Bad Request',
      message: 'The request could not be processed due to invalid data.',
      icon: 'warning',
      color: 'orange',
    },
    '401': {
      code: '401',
      title: 'Unauthorized',
      message: 'You need to be logged in to access this resource.',
      icon: 'warning',
      color: 'orange',
    },
    '403': {
      code: '403',
      title: 'Access Denied',
      message: "You don't have permission to access this resource.",
      icon: 'error',
      color: 'red',
    },
    '404': {
      code: '404',
      title: 'Page Not Found',
      message: "The page you're looking for doesn't exist or has been moved.",
      icon: 'info',
      color: 'blue',
    },
    '408': {
      code: '408',
      title: 'Request Timeout',
      message: 'The request took too long to process. Please try again.',
      icon: 'warning',
      color: 'orange',
    },
    '429': {
      code: '429',
      title: 'Too Many Requests',
      message: "You've made too many requests. Please wait a moment and try again.",
      icon: 'warning',
      color: 'orange',
    },
    '500': {
      code: '500',
      title: 'Internal Server Error',
      message: "Something went wrong on our servers. We're working to fix this issue.",
      icon: 'error',
      color: 'red',
    },
    '502': {
      code: '502',
      title: 'Bad Gateway',
      message: 'The server received an invalid response. Please try again later.',
      icon: 'error',
      color: 'red',
    },
    '503': {
      code: '503',
      title: 'Service Unavailable',
      message: 'The service is temporarily unavailable. Please try again later.',
      icon: 'warning',
      color: 'orange',
    },
    '504': {
      code: '504',
      title: 'Gateway Timeout',
      message: 'The request timed out. Please check your connection and try again.',
      icon: 'warning',
      color: 'orange',
    },
    network: {
      code: '',
      title: 'Network Error',
      message: 'Unable to connect to our servers. Please check your internet connection.',
      icon: 'warning',
      color: 'orange',
    },
    generic: {
      code: '',
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again or contact support.',
      icon: 'error',
      color: 'red',
    },
  };

  // Computed error configuration
  errorConfig = computed(() => {
    const type = this.errorType();
    const config = this.errorConfigs[type] || this.errorConfigs['generic'];

    return {
      ...config,
      title: this.customTitle() || config.title,
      message: this.customMessage() || config.message,
    };
  });

  // Dynamic CSS classes
  errorIconClasses = computed(() => {
    const color = this.errorConfig().color;
    const baseClasses = 'mx-auto flex items-center justify-center h-24 w-24 rounded-full mb-8';

    const colorClasses = {
      red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    };

    return `${baseClasses} ${colorClasses[color]}`;
  });

  errorCodeClasses = computed(() => {
    return 'text-6xl font-bold text-gray-900 dark:text-white mb-2';
  });

  errorDetailsClasses = computed(() => {
    const color = this.errorConfig().color;
    const baseClasses = 'border rounded-md p-4 mb-8 text-left';

    const colorClasses = {
      red: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800',
      orange: 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800',
      blue: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800',
    };

    return `${baseClasses} ${colorClasses[color]}`;
  });

  errorDetailsIconClasses = computed(() => {
    const color = this.errorConfig().color;
    const colorClasses = {
      red: 'h-5 w-5 text-red-400',
      orange: 'h-5 w-5 text-orange-400',
      blue: 'h-5 w-5 text-blue-400',
    };

    return colorClasses[color];
  });

  errorDetailsTitleClasses = computed(() => {
    const color = this.errorConfig().color;
    const colorClasses = {
      red: 'text-sm font-medium text-red-800 dark:text-red-200',
      orange: 'text-sm font-medium text-orange-800 dark:text-orange-200',
      blue: 'text-sm font-medium text-blue-800 dark:text-blue-200',
    };

    return colorClasses[color];
  });

  errorDetailsTextClasses = computed(() => {
    const color = this.errorConfig().color;
    const colorClasses = {
      red: 'mt-2 text-sm text-red-700 dark:text-red-300',
      orange: 'mt-2 text-sm text-orange-700 dark:text-orange-300',
      blue: 'mt-2 text-sm text-blue-700 dark:text-blue-300',
    };

    return colorClasses[color];
  });

  ngOnInit() {
    this.setupSEO();
  }

  private setupSEO() {
    const config = this.errorConfig();
    this.seoService.updateSEO({
      title: `${config.code ? config.code + ' - ' : ''}${config.title}`,
      description: config.message,
      noIndex: true,
    });
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
