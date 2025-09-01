import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';

import { RouterModule, ActivatedRoute } from '@angular/router';
import { PayloadApiService } from '../../services/payload-api.service';
import { SeoService } from '../../services/seo.service';
import { LexicalRendererService } from '../../services/lexical-renderer.service';
import { Post, Category, PayloadResponse } from '../../types/payload.types';

@Component({
  selector: 'app-blog',
  imports: [RouterModule],
  template: `
    <div class="bg-white dark:bg-gray-900">
      <!-- Header -->
      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div class="container-custom">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Blog
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              Discover insights, tutorials, and stories from our team
            </p>
          </div>
        </div>
      </section>

      <!-- Categories Filter -->
      @if (categories().length > 0) {
        <section class="py-8 border-b border-gray-200 dark:border-gray-700">
          <div class="container-custom">
            <div class="flex flex-wrap gap-3 justify-center">
              <button
                (click)="filterByCategory(null)"
                [class]="
                  selectedCategory() === null
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                "
                class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                All Posts
              </button>
              @for (category of categories(); track category.id) {
                <button
                  (click)="filterByCategory(category.id)"
                  [class]="
                    selectedCategory() === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  "
                  class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {{ category.title }}
                </button>
              }
            </div>
          </div>
        </section>
      }

      <!-- Posts Grid -->
      <section class="py-16 md:py-24">
        <div class="container-custom">
          @if (isLoading()) {
            <!-- Loading State -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              @for (i of [1, 2, 3, 4, 5, 6]; track i) {
                <div class="card p-0 overflow-hidden animate-pulse">
                  <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div class="p-6">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                    <div class="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div class="flex justify-between">
                      <div class="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else if (posts().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              @for (post of posts(); track post.id) {
                <article
                  class="card p-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                >
                  <!-- Featured Image -->
                  @if (post.hero?.media) {
                    <div class="aspect-w-16 aspect-h-9 overflow-hidden">
                      <img
                        [src]="getImageUrl(post.hero?.media)"
                        [alt]="post.hero?.media?.alt || post.title"
                        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  }

                  <div class="p-6">
                    <!-- Categories -->
                    @if (post.categories && post.categories.length > 0) {
                      <div class="flex flex-wrap gap-2 mb-3">
                        @for (category of post.categories.slice(0, 2); track category.id) {
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                          >
                            {{ category.title }}
                          </span>
                        }
                      </div>
                    }

                    <!-- Title -->
                    <h2
                      class="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors"
                    >
                      <a [routerLink]="['/blog', post.slug]" class="block">
                        {{ post.title }}
                      </a>
                    </h2>

                    <!-- Excerpt -->
                    @if (getPostExcerpt(post)) {
                      <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {{ getPostExcerpt(post) }}
                      </p>
                    }

                    <!-- Meta Information -->
                    <div
                      class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
                    >
                      <div class="flex items-center space-x-4">
                        @if (post.populatedAuthors && post.populatedAuthors.length > 0) {
                          <div class="flex items-center">
                            <div
                              class="h-6 w-6 rounded-full bg-primary flex items-center justify-center mr-2"
                            >
                              <span class="text-white text-xs font-medium">
                                {{ getAuthorInitials(post.populatedAuthors[0]) }}
                              </span>
                            </div>
                            <span>{{ post.populatedAuthors[0].name || 'Author' }}</span>
                          </div>
                        }

                        @if (post.publishedAt) {
                          <time [dateTime]="post.publishedAt">
                            {{ formatDate(post.publishedAt) }}
                          </time>
                        }
                      </div>

                      <a
                        [routerLink]="['/blog', post.slug]"
                        class="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        Read more
                        <svg
                          class="ml-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              }
            </div>

            <!-- Load More -->
            @if (hasMore()) {
              <div class="mt-12 text-center">
                <button
                  (click)="loadMore()"
                  [disabled]="isLoadingMore()"
                  class="btn-primary inline-flex items-center"
                >
                  @if (isLoadingMore()) {
                    <div
                      class="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    ></div>
                    Loading...
                  } @else {
                    Load More Posts
                    <svg
                      class="ml-2 -mr-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  }
                </button>
              </div>
            }
          } @else {
            <!-- Empty State -->
            <div class="text-center py-16">
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
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
              <p class="text-gray-600 dark:text-gray-400">
                There are no published posts to display at the moment.
              </p>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private payloadApi = inject(PayloadApiService);
  private seoService = inject(SeoService);
  private lexicalRenderer = inject(LexicalRendererService);

  posts = signal<Post[]>([]);
  categories = signal<Category[]>([]);
  selectedCategory = signal<string | null>(null);
  isLoading = signal(true);
  isLoadingMore = signal(false);
  hasMore = signal(false);
  currentPage = signal(1);

  ngOnInit() {
    this.loadCategories();
    this.loadPosts();
    this.setupSEO();
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'Blog',
      description: 'Discover insights, tutorials, and stories from our team',
      url: '/blog',
      type: 'website',
    });
  }

  private loadCategories() {
    this.payloadApi.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.docs);
      },
      error: (error) => console.error('Failed to load categories:', error),
    });
  }

  private loadPosts(page: number = 1, append: boolean = false) {
    if (page === 1) this.isLoading.set(true);
    else this.isLoadingMore.set(true);

    const params: any = {
      limit: 12,
      page: page,
      sort: '-publishedAt',
    };

    if (this.selectedCategory()) {
      params['where[categories][in]'] = this.selectedCategory();
    }

    console.log(params);

    this.payloadApi.getPosts().subscribe({
      next: (response) => {
        console.log(response);

        if (append) {
          this.posts.update((current) => [...current, ...response.docs]);
        } else {
          this.posts.set(response.docs);
        }

        this.hasMore.set(response.hasNextPage);
        this.currentPage.set(page);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: (error) => {
        console.error('Failed to load posts:', error);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
    });
  }

  filterByCategory(categoryId: string | null) {
    this.selectedCategory.set(categoryId);
    this.currentPage.set(1);
    this.loadPosts(1, false);
  }

  loadMore() {
    if (this.hasMore() && !this.isLoadingMore()) {
      this.loadPosts(this.currentPage() + 1, true);
    }
  }

  getImageUrl(media: any): string {
    if (media.sizes?.card?.url) {
      return media.sizes.card.url;
    }
    return media.url;
  }

  getPostExcerpt(post: Post): string {
    if (post.meta?.description) {
      return post.meta.description;
    }

    if (post.hero?.richText) {
      return this.lexicalRenderer.getExcerpt(post.hero.richText, 25);
    }

    return '';
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
      month: 'short',
      day: 'numeric',
    });
  }
}
