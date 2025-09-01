import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div class="text-center max-w-2xl mx-auto px-4">
        <!-- 404 Illustration -->
        <div class="mb-8">
          <div class="relative">
            <h1
              class="text-9xl md:text-[12rem] font-bold text-gray-200 dark:text-gray-700 select-none"
            >
              404
            </h1>
            <div class="absolute inset-0 flex items-center justify-center">
              <svg
                class="h-24 w-24 md:h-32 md:w-32 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.618m15.691 2.618A7.962 7.962 0 0012 15c2.34 0 4.291-1.007 5.691-2.618M6.5 9a.5.5 0 11-1 0 .5.5 0 011 0zm3 0a.5.5 0 11-1 0 .5.5 0 011 0zm3 0a.5.5 0 11-1 0 .5.5 0 011 0zm3 0a.5.5 0 11-1 0 .5.5 0 011 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Oops! Page not found
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a routerLink="/" class="btn-primary">
            <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Homepage
          </a>

          <a routerLink="/blog" class="btn-outline">
            <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            Browse Blog
          </a>
        </div>

        <!-- Search Suggestion -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-gray-500 dark:text-gray-400 mb-4">Can't find what you're looking for?</p>
          <button
            (click)="openSearch()"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search our site
          </button>
        </div>

        <!-- Fun Facts -->
        <div class="mt-16 text-left">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Did you know?
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div
                class="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3"
              >
                <svg
                  class="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                This site is powered by Payload CMS and Angular for blazing fast performance
              </p>
            </div>
            <div class="text-center">
              <div
                class="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3"
              >
                <svg
                  class="h-6 w-6 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Built with modern web technologies for optimal user experience
              </p>
            </div>
            <div class="text-center">
              <div
                class="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3"
              >
                <svg
                  class="h-6 w-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Open source and customizable to fit your needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.seoService.updateSEO({
      title: '404 - Page Not Found',
      description: "The page you're looking for doesn't exist or has been moved.",
      noIndex: true,
    });
  }

  openSearch() {
    // Dispatch custom event for search modal
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openSearch'));
    }
  }
}
