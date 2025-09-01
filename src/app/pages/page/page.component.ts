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
  selector: 'app-page',
  imports: [CommonModule, LayoutRendererComponent, HeroBlockComponent],
  template: `
    @if (page(); as pageData) {
      <!-- Hero Section -->
      @if (pageData.hero) {
        <app-hero-block [hero]="pageData.hero" />
      }

      <!-- Layout Blocks -->
      <app-layout-renderer [layout]="pageData.layout" />
    } @else if (isLoading()) {
      <!-- Loading State -->
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"
          ></div>
          <p class="text-gray-600 dark:text-gray-400">Loading page...</p>
        </div>
      </div>
    } @else {
      <!-- 404 Not Found -->
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            The page you're looking for doesn't exist.
          </p>
          <button (click)="goHome()" class="btn-primary">Go to Homepage</button>
        </div>
      </div>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private payloadApi = inject(PayloadApiService);
  private seoService = inject(SeoService);

  page = signal<Page | null>(null);
  isLoading = signal(true);
  slug = signal<string>('');

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.slug.set(params['slug']);
      this.loadPage();
    });
  }

  private loadPage() {
    if (!this.slug()) return;

    this.isLoading.set(true);

    this.payloadApi.getPageBySlug(this.slug()).subscribe({
      next: (page) => {
        if (page) {
          this.page.set(page);
          this.seoService.updateSEOFromPage(page, `/${this.slug()}`);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load page:', error);
        this.isLoading.set(false);
        this.router.navigate(['/404']);
      },
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
