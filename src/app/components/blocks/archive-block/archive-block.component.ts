import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayloadApiService } from '../../../services/payload-api.service';
import { LexicalRendererService } from '../../../services/lexical-renderer.service';
import { ArchiveBlock, Post } from '../../../types/payload.types';

@Component({
  selector: 'app-archive-block',
  imports: [CommonModule, RouterModule],
  template: `
    @if (archive) {
      <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div class="container-custom">
          @if (posts().length > 0) {
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
                    <h3
                      class="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors"
                    >
                      <a [routerLink]="['/blog', post.slug]" class="block">
                        {{ post.title }}
                      </a>
                    </h3>

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
                        <!-- Author -->
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

                        <!-- Date -->
                        @if (post.publishedAt) {
                          <div class="flex items-center">
                            <svg
                              class="h-4 w-4 mr-1"
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
                            <time [dateTime]="post.publishedAt">
                              {{ formatDate(post.publishedAt) }}
                            </time>
                          </div>
                        }
                      </div>

                      <!-- Read More Link -->
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

            <!-- Load More / Pagination -->
            @if (hasMore()) {
              <div class="mt-12 text-center">
                <button
                  (click)="loadMore()"
                  [disabled]="isLoading()"
                  class="btn-primary inline-flex items-center"
                >
                  @if (isLoading()) {
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
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveBlockComponent implements OnInit {
  @Input() archive!: ArchiveBlock;

  private payloadApi = inject(PayloadApiService);
  private lexicalRenderer = inject(LexicalRendererService);

  posts = signal<Post[]>([]);
  isLoading = signal(false);
  hasMore = signal(false);
  currentPage = signal(1);

  ngOnInit() {
    this.loadPosts();
  }

  private loadPosts() {
    if (this.archive.populateBy === 'selection' && this.archive.selectedDocs) {
      // Use pre-selected posts
      this.posts.set(this.archive.selectedDocs);
      this.hasMore.set(false);
    } else if (this.archive.populatedDocs) {
      // Use pre-populated posts from Payload
      this.posts.set(this.archive.populatedDocs);
      this.hasMore.set((this.archive.populatedDocsTotal || 0) > this.archive.populatedDocs.length);
    } else {
      // Fetch posts dynamically
      this.fetchPosts();
    }
  }

  private fetchPosts(page: number = 1) {
    this.isLoading.set(true);

    const params: any = {
      limit: this.archive.limit || 6,
      page: page,
      sort: '-publishedAt',
    };

    // Add category filter if specified
    if (this.archive.categories && this.archive.categories.length > 0) {
      params['where[categories][in]'] = this.archive.categories.map((cat) => cat.id).join(',');
    }

    this.payloadApi.getPosts(params).subscribe({
      next: (response) => {
        if (page === 1) {
          this.posts.set(response.docs);
        } else {
          this.posts.update((current) => [...current, ...response.docs]);
        }

        this.hasMore.set(response.hasNextPage);
        this.currentPage.set(page);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to fetch posts:', error);
        this.isLoading.set(false);
      },
    });
  }

  loadMore() {
    if (!this.hasMore() || this.isLoading()) return;
    this.fetchPosts(this.currentPage() + 1);
  }

  getImageUrl(media: any): string {
    // Use card size if available, otherwise use the original URL
    if (media.sizes?.card?.url) {
      return media.sizes.card.url;
    }
    return media.url;
  }

  getPostExcerpt(post: Post): string {
    // Try to get description from meta first
    if (post.meta?.description) {
      return post.meta.description;
    }

    // Try to extract from hero rich text
    if (post.hero?.richText) {
      return this.lexicalRenderer.getExcerpt(post.hero.richText, 25);
    }

    // Try to extract from layout blocks
    if (post.layout && post.layout.length > 0) {
      for (const block of post.layout) {
        if (block.blockType === 'content' && 'columns' in block && block.columns) {
          for (const column of block.columns) {
            if (column.richText) {
              return this.lexicalRenderer.getExcerpt(column.richText, 25);
            }
          }
        }
        if (block.blockType === 'hero' && 'richText' in block && block.richText) {
          return this.lexicalRenderer.getExcerpt(block.richText, 25);
        }
      }
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
