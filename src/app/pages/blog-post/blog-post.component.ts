import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PayloadApiService } from '../../services/payload-api.service';
import { SeoService } from '../../services/seo.service';
import { LexicalRendererService } from '../../services/lexical-renderer.service';
import { Post } from '../../types/payload.types';
import { LayoutRendererComponent } from '../../components/layout-renderer/layout-renderer.component';
import { HeroBlockComponent } from '../../components/blocks/hero-block/hero-block.component';

@Component({
  selector: 'app-blog-post',
  imports: [RouterModule, LayoutRendererComponent, HeroBlockComponent],
  template: `
    @if (post(); as postData) {
      <article class="bg-white dark:bg-gray-900">
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
                <span class="text-gray-900 dark:text-white">{{ postData.title }}</span>
              </nav>

              <!-- Categories -->
              @if (postData.categories && postData.categories.length > 0) {
                <div class="flex flex-wrap gap-2 mb-4">
                  @for (category of postData.categories; track category.id) {
                    <a
                      [routerLink]="['/blog/category', category.slug]"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {{ category.title }}
                    </a>
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
                    </div>
                  }
                </div>

                <!-- Share Buttons -->
                <div class="flex items-center space-x-3">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Share:</span>
                  <button
                    (click)="shareOnTwitter()"
                    class="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                      />
                    </svg>
                  </button>
                  <button
                    (click)="shareOnLinkedIn()"
                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                      />
                    </svg>
                  </button>
                  <button
                    (click)="copyLink()"
                    class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label="Copy link"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
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

        <!-- Related Posts -->
        @if (postData.relatedPosts && postData.relatedPosts.length > 0) {
          <section
            class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          >
            <div class="container-custom">
              <div class="max-w-4xl mx-auto">
                <h2
                  class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
                >
                  Related Posts
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  @for (relatedPost of postData.relatedPosts.slice(0, 3); track relatedPost.id) {
                    <article
                      class="card p-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                    >
                      @if (relatedPost.hero?.media) {
                        <div class="aspect-w-16 aspect-h-9 overflow-hidden">
                          <img
                            [src]="getImageUrl(relatedPost.hero?.media)"
                            [alt]="relatedPost.hero?.media?.alt || relatedPost.title"
                            class="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      }
                      <div class="p-4">
                        <h3
                          class="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors"
                        >
                          <a [routerLink]="['/blog', relatedPost.slug]" class="block">
                            {{ relatedPost.title }}
                          </a>
                        </h3>
                        @if (relatedPost.publishedAt) {
                          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {{ formatDate(relatedPost.publishedAt) }}
                          </p>
                        }
                      </div>
                    </article>
                  }
                </div>
              </div>
            </div>
          </section>
        }
      </article>
    } @else if (isLoading()) {
      <!-- Loading State -->
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"
          ></div>
          <p class="text-gray-600 dark:text-gray-400">Loading post...</p>
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
              d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.618m15.691 2.618A7.962 7.962 0 0012 15c2.34 0 4.291-1.007 5.691-2.618M6.5 9a.5.5 0 11-1 0 .5.5 0 011 0zm3 0a.5.5 0 11-1 0 .5.5 0 011 0zm3 0a.5.5 0 11-1 0 .5.5 0 011 0zm3 0a.5.5 0 11-1 0 .5.5 0 011 0z"
            />
          </svg>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Post not found</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you're looking for doesn't exist.
          </p>
          <a routerLink="/blog" class="btn-primary"> Back to Blog </a>
        </div>
      </div>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private payloadApi = inject(PayloadApiService);
  private seoService = inject(SeoService);
  private lexicalRenderer = inject(LexicalRendererService);

  post = signal<Post | null>(null);
  isLoading = signal(true);
  slug = signal<string>('');

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.slug.set(params['slug']);
      this.loadPost();
    });
  }

  private loadPost() {
    if (!this.slug()) return;

    this.isLoading.set(true);

    this.payloadApi.getPostBySlug(this.slug()).subscribe({
      next: (post) => {
        if (post) {
          this.post.set(post);
          this.seoService.updateSEOFromPost(post, `/blog/${this.slug()}`);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load post:', error);
        this.isLoading.set(false);
        this.router.navigate(['/404']);
      },
    });
  }

  getImageUrl(media: any): string {
    if (media.sizes?.card?.url) {
      return media.sizes.card.url;
    }
    return media.url;
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

  shareOnTwitter() {
    const post = this.post();
    if (!post) return;

    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this post: ${post.title}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
      console.log('Link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }
}
