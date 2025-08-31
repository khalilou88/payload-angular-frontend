import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayloadApiService } from '../../services/payload-api.service';
import { SeoService } from '../../services/seo.service';
import { Page } from '../../types/payload.types';
import { LayoutRendererComponent } from '../../components/layout-renderer/layout-renderer.component';
import { HeroBlockComponent } from '../../components/blocks/hero-block/hero-block.component';

@Component({
  selector: 'app-home',
  standalone: true,
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
          <p class="text-gray-600 dark:text-gray-400">Loading homepage...</p>
        </div>
      </div>
    } @else if (error()) {
      <!-- Error State -->
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error() }}</p>
          <button (click)="loadHomePage()" class="btn-primary">Try again</button>
        </div>
      </div>
    } @else {
      <!-- Fallback Content -->
      <section class="py-20 md:py-32 flex items-center min-h-screen">
        <div class="container-custom">
          <div class="max-w-4xl text-center mx-auto">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to Your
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
              >
                Payload Website
              </span>
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              A modern website built with Payload CMS and Angular. Delivering powerful content
              management with beautiful design.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/admin" target="_blank" rel="noopener noreferrer" class="btn-primary">
                Open Admin Panel
                <svg
                  class="ml-2 -mr-1 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              <a
                href="https://payloadcms.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-outline"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </section>
    }
  `,
})
export class HomeComponent implements OnInit {
  private payloadApi = inject(PayloadApiService);
  private seoService = inject(SeoService);

  page = signal<Page | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadHomePage();
  }

  loadHomePage() {
    this.isLoading.set(true);
    this.error.set(null);

    // Try to load the home page by slug 'home' or the first page
    this.payloadApi.getPageBySlug('home').subscribe({
      next: (page) => {
        if (page) {
          this.page.set(page);
          this.seoService.updateSEOFromPage(page);
        } else {
          // Fallback: try to get the first page
          this.payloadApi.getPages({ limit: 1, sort: 'createdAt' }).subscribe({
            next: (response) => {
              if (response.docs.length > 0) {
                this.page.set(response.docs[0]);
                this.seoService.updateSEOFromPage(response.docs[0]);
              } else {
                // No pages found, show fallback content
                this.seoService.updateSEO({
                  title: 'Home',
                  description: 'Welcome to your Payload website built with Angular',
                });
              }
              this.isLoading.set(false);
            },
            error: (error) => {
              console.error('Failed to load pages:', error);
              this.error.set('Failed to load homepage content');
              this.isLoading.set(false);

              // Set basic SEO for error state
              this.seoService.updateSEO({
                title: 'Home',
                description: 'Welcome to your Payload website built with Angular',
              });
            },
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load home page:', error);
        this.error.set('Failed to load homepage content');
        this.isLoading.set(false);

        // Set basic SEO for error state
        this.seoService.updateSEO({
          title: 'Home',
          description: 'Welcome to your Payload website built with Angular',
        });
      },
    });
  }
}
