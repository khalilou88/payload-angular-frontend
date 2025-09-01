import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeroBlockComponent } from '../../components/blocks/hero-block/hero-block.component';
import { LayoutRendererComponent } from '../../components/layout-renderer/layout-renderer.component';
import { PayloadApiService } from '../../services/payload-api.service';
import { SeoService } from '../../services/seo.service';
import { Post } from '../../types/payload.types';

@Component({
  selector: 'app-preview-post',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutRendererComponent, HeroBlockComponent],
  template: `
    <!-- Preview Banner -->
    <div class="bg-blue-100 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
      <div class="container-custom py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-blue-600 dark:text-blue-400"
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
              <p class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Blog Post Preview - Draft Content
              </p>
              <p class="text-xs text-blue-600 dark:text-blue-300">
                This post is in draft mode and not visible to the public
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            @if (post()) {
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
              >
                {{ post()!._status || 'Draft' }}
              </span>
            }

            <button
              (click)="exitPreview()"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
            >
              Exit Preview
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Content -->
    @if (post(); as postData) {
      <article class="bg-white dark:bg-gray-900 relative">
        <!-- Draft Overlay Indicator -->
        <div class="absolute top-4 right-4 z-40">
          <div
            class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
          >
            PREVIEW
          </div>
        </div>

        <!-- Hero Section -->
        @if (postData.hero) {
          <app-hero-block [hero]="postData.hero" />
        }

        <!-- Post Header -->
        <header class="py-12 md:py-16">
          <div class="container-custom">
            <div class="max-w-4xl mx-auto">
              <!-- Breadcrumb -->
              <nav
                class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6"
              >
                <a routerLink="/" class="hover:text-primary transition-colors">Home</a>
                <span>/</span>
                <a routerLink="/blog" class="hover:text-primary transition-colors">Blog</a>
                <span>/</span>
                <span class="text-gray-900 dark:text-white">{{ postData.title }} (Preview)</span>
              </nav>

              <!-- Preview Status -->
              <div
                class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
              >
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-blue-400"
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
                    <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Draft Preview
                    </h3>
                    <div class="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <p>
                        This is a preview of your draft post. Changes made in the admin panel will
                        be reflected here.
                      </p>
                      @if (postData.publishedAt) {
                        <p class="mt-1">
                          Scheduled to publish: {{ formatDate(postData.publishedAt) }}
                        </p>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <!-- Categories -->
              @if (postData.categories && postData.categories.length > 0) {
                <div class="flex flex-wrap gap-2 mb-4">
                  @for (category of postData.categories; track category.id) {
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                    >
                      {{ category.title }}
                    </span>
                  }
                </div>
              }

              <!-- Title -->
              <h1
                class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              >
                {{ postData.title }}
              </h1>

              <!-- Meta Information -->
              <div
                class="flex flex-col md:flex-row md:items-center md:justify-between pb-8 border-b border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center space-x-6 mb-4 md:mb-0">
                  <!-- Author -->
                  @if (postData.populatedAuthors && postData.populatedAuthors.length > 0) {
                    <div class="flex items-center">
                      <div
                        class="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-3"
                      >
                        <span class="text-white font-medium">
                          {{ getAuthorInitials(postData.populatedAuthors[0]) }}
                        </span>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ postData.populatedAuthors[0].name || 'Author' }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Author</p>
                      </div>
                    </div>
                  }

                  <!-- Date -->
                  @if (postData.publishedAt) {
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg
                        class="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <time [dateTime]="postData.publishedAt">
                        {{ formatDate(postData.publishedAt) }}
                      </time>
                      <span class="ml-2 text-blue-600 dark:text-blue-400">(Preview)</span>
                    </div>
                  }
                </div>

                <!-- Preview Actions -->
                <div class="flex items-center space-x-3">
                  <button
                    (click)="openInAdmin()"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit in Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Post Content -->
        <div class="pb-16 md:pb-24">
          <div class="container-custom">
            <div class="max-w-4xl mx-auto">
              <!-- Layout Blocks -->
              <app-layout-renderer [layout]="postData.layout" />
            </div>
          </div>
        </div>
      </article>
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
            The requested post preview doesn't exist or access is denied.
          </p>
          <button (click)="exitPreview()" class="btn-primary">Exit Preview</button>
        </div>
      </div>
    }
  `,
})
export class PreviewPostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private payloadApi = inject(PayloadApiService);
  private seoService = inject(SeoService);

  post = signal<Post | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  postId = signal<string>('');

  ngOnInit() {
    // Check if user is authenticated for preview access
    if (!this.payloadApi.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    this.route.params.subscribe((params) => {
      this.postId.set(params['id']);
      this.loadPreview();
    });
  }

  loadPreview() {
    if (!this.postId()) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.payloadApi.getPostById(this.postId(), true).subscribe({
      next: (post) => {
        this.post.set(post);

        // Set SEO with preview indication
        this.seoService.updateSEO({
          title: `${post.title} (Preview)`,
          description: post.meta?.description || 'Blog post preview',
          noIndex: true, // Prevent indexing of preview pages
          type: 'article',
        });

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load post preview:', error);
        this.error.set(
          error?.error?.message ||
            'Failed to load post preview. You may not have permission to view this content.',
        );
        this.isLoading.set(false);
      },
    });
  }

  exitPreview() {
    // Try to navigate to the published version if available
    const post = this.post();
    if (post && post.slug) {
      this.router.navigate([`/blog/${post.slug}`]);
    } else {
      this.router.navigate(['/blog']);
    }
  }

  openInAdmin() {
    const post = this.post();
    if (post) {
      window.open(`/admin/collections/posts/${post.id}`, '_blank');
    }
  }

  getAuthorInitials(author: any): string {
    if (author.name) {
      return author.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return author.email?.[0]?.toUpperCase() || 'A';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
