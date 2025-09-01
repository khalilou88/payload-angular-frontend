import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PayloadApiService } from '../../services/payload-api.service';
import { SeoService } from '../../services/seo.service';
import { Page } from '../../types/payload.types';
import { LayoutRendererComponent } from '../../components/layout-renderer/layout-renderer.component';
import { HeroBlockComponent } from '../../components/blocks/hero-block/hero-block.component';

@Component({
  selector: 'app-preview-page',
  imports: [CommonModule, LayoutRendererComponent, HeroBlockComponent],
  template: `
    <!-- Preview Banner -->
    <div
      class="bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800"
    >
      <div class="container-custom py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-yellow-600 dark:text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Preview Mode - Draft Content
              </p>
              <p class="text-xs text-yellow-600 dark:text-yellow-300">
                This page is in draft mode and not visible to the public
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            @if (page()) {
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
              >
                {{ page()!._status || 'Draft' }}
              </span>
            }

            <button
              (click)="exitPreview()"
              class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 text-sm font-medium"
            >
              Exit Preview
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Content -->
    @if (page(); as pageData) {
      <div class="relative">
        <!-- Draft Overlay Indicator -->
        <div class="absolute top-4 right-4 z-40">
          <div
            class="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
          >
            PREVIEW
          </div>
        </div>

        <!-- Hero Section -->
        @if (pageData.hero) {
          <app-hero-block [hero]="pageData.hero" />
        }

        <!-- Layout Blocks -->
        <app-layout-renderer [layout]="pageData.layout" />
      </div>
    } @else if (isLoading()) {
      <!-- Loading State -->
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"
          ></div>
          <p class="text-gray-600 dark:text-gray-400">Loading preview...</p>
        </div>
      </div>
    } @else if (error()) {
      <!-- Error State -->
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center max-w-md">
          <svg
            class="mx-auto h-16 w-16 text-red-400 mb-4"
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
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Preview Error</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error() }}</p>
          <div class="space-x-4">
            <button (click)="loadPreview()" class="btn-primary">Try Again</button>
            <button (click)="exitPreview()" class="btn-outline">Exit Preview</button>
          </div>
        </div>
      </div>
    } @else {
      <!-- Not Found -->
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center max-w-md">
          <svg
            class="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.618m15.691 2.618A7.962 7.962 0 0012 15c2.34 0 4.291-1.007 5.691-2.618M6.5 9a.5.5 0 11-1 0 .5.5 0 011 0zm3 0a.5.5 0 11-1 0 .5.5 0 011 0zm3 0a.5.5 0 11-1 0 .5.5 0 011 0zm3 0a.5.5 0 11-1 0 .5.5 0 011 0z"
            />
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Preview Not Found</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            The requested page preview doesn't exist or access is denied.
          </p>
          <button (click)="exitPreview()" class="btn-primary">Exit Preview</button>
        </div>
      </div>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private payloadApi = inject(PayloadApiService);
  private seoService = inject(SeoService);

  page = signal<Page | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  pageId = signal<string>('');

  ngOnInit() {
    // Check if user is authenticated for preview access
    if (!this.payloadApi.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    this.route.params.subscribe((params) => {
      this.pageId.set(params['id']);
      this.loadPreview();
    });
  }

  loadPreview() {
    if (!this.pageId()) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.payloadApi.getPageById(this.pageId(), true).subscribe({
      next: (page) => {
        this.page.set(page);

        // Set SEO with preview indication
        this.seoService.updateSEO({
          title: `${page.title} (Preview)`,
          description: page.meta?.description || 'Page preview',
          noIndex: true, // Prevent indexing of preview pages
        });

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load page preview:', error);
        this.error.set(
          error?.error?.message ||
            'Failed to load page preview. You may not have permission to view this content.',
        );
        this.isLoading.set(false);
      },
    });
  }

  exitPreview() {
    // Try to navigate to the published version if available
    const page = this.page();
    if (page && page.slug) {
      this.router.navigate([`/${page.slug}`]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
