import {
  Component,
  inject,
  signal,
  computed,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  output,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PayloadApiService } from '../../services/payload-api.service';
import { LexicalRendererService } from '../../services/lexical-renderer.service';
import { SearchResult, Page, Post } from '../../types/payload.types';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-modal',
  imports: [FormsModule, RouterModule],
  template: `
    <div class="p-6">
      <!-- Search Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Search</h2>
        <button
          (click)="close.emit()"
          class="p-2 -mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close search"
        >
          <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative mb-6">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          #searchInput
          [(ngModel)]="searchQuery"
          (input)="onSearchInput($event)"
          type="text"
          class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
          placeholder="Search pages and posts..."
          autocomplete="off"
        />

        @if (isLoading()) {
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div
              class="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"
            ></div>
          </div>
        }
      </div>

      <!-- Search Results -->
      <div class="max-h-96 overflow-y-auto">
        @if (searchQuery && !isLoading() && searchResults().length === 0) {
          <div class="text-center py-8">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
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
            <h3 class="mt-4 text-sm font-medium text-gray-900 dark:text-white">No results found</h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search terms or browse our content.
            </p>
          </div>
        }

        @if (!searchQuery && !isLoading()) {
          <div class="text-center py-8">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 class="mt-4 text-sm font-medium text-gray-900 dark:text-white">
              Start typing to search
            </h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Search through pages and blog posts to find what you're looking for.
            </p>
          </div>
        }

        @if (searchResults().length > 0) {
          <div class="space-y-3">
            @for (result of searchResults(); track getResultId(result)) {
              <div class="group">
                <a
                  [routerLink]="getResultUrl(result)"
                  (click)="close.emit()"
                  class="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div class="flex items-start space-x-3">
                    <!-- Result Icon -->
                    <div class="flex-shrink-0 mt-1">
                      @if (result.relationTo === 'posts') {
                        <div
                          class="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center"
                        >
                          <svg
                            class="h-4 w-4 text-primary"
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
                        </div>
                      } @else {
                        <div
                          class="h-8 w-8 bg-secondary/10 rounded-lg flex items-center justify-center"
                        >
                          <svg
                            class="h-4 w-4 text-secondary"
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
                        </div>
                      }
                    </div>

                    <!-- Result Content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2 mb-1">
                        <h3
                          class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors"
                        >
                          {{ getResultDoc(result).title }}
                        </h3>
                        <span
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                          [class]="
                            result.relationTo === 'posts'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-secondary/10 text-secondary'
                          "
                        >
                          {{ result.relationTo === 'posts' ? 'Blog Post' : 'Page' }}
                        </span>
                      </div>

                      @if (getResultDescription(result)) {
                        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {{ getResultDescription(result) }}
                        </p>
                      }

                      @if (result.relationTo === 'posts' && getResultDoc(result).publishedAt) {
                        <div
                          class="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400"
                        >
                          <svg
                            class="h-3 w-3 mr-1"
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
                          {{ formatDate(getResultDoc(result).publishedAt!) }}
                        </div>
                      }
                    </div>

                    <!-- Arrow Icon -->
                    <div class="flex-shrink-0">
                      <svg
                        class="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
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
                    </div>
                  </div>
                </a>
              </div>
            }
          </div>
        }
      </div>

      <!-- Search Tips -->
      @if (!searchQuery && !isLoading()) {
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Search Tips</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="h-6 w-6 bg-primary/10 rounded flex items-center justify-center">
                  <span class="text-xs font-medium text-primary">⌘</span>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Use
                  <kbd class="px-1 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded">Cmd+K</kbd>
                  to open search anywhere
                </p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <div class="h-6 w-6 bg-secondary/10 rounded flex items-center justify-center">
                  <span class="text-xs font-medium text-secondary">"</span>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Use quotes for exact phrase matching
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  readonly close = output<void>();

  private payloadApi = inject(PayloadApiService);
  private lexicalRenderer = inject(LexicalRendererService);
  private searchSubject = new Subject<string>();
  private subscription = new Subscription();

  searchQuery = '';
  searchResults = signal<SearchResult[]>([]);
  isLoading = signal(false);

  ngAfterViewInit() {
    // Focus the search input when modal opens
    this.searchInput.nativeElement.focus();

    // Set up search debouncing
    this.subscription.add(
      this.searchSubject
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((query) => {
            if (query.trim().length < 2) {
              this.isLoading.set(false);
              return of([]);
            }

            this.isLoading.set(true);
            return this.payloadApi.search(query).pipe(
              catchError((error) => {
                console.error('Search error:', error);
                return of([]);
              }),
            );
          }),
        )
        .subscribe((results) => {
          this.searchResults.set(results);
          this.isLoading.set(false);
        }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.searchSubject.next(this.searchQuery);
  }

  getResultId(result: SearchResult): string {
    return `${result.relationTo}-${this.getResultDoc(result).id}`;
  }

  getResultDoc(result: SearchResult): Page | Post {
    return result.doc as Page | Post;
  }

  getResultUrl(result: SearchResult): string {
    const doc = this.getResultDoc(result);
    return result.relationTo === 'posts' ? `/blog/${doc.slug}` : `/${doc.slug}`;
  }

  getResultDescription(result: SearchResult): string {
    const doc = this.getResultDoc(result);

    // Try to get description from meta first
    if (doc.meta?.description) {
      return doc.meta.description;
    }

    // Try to extract from hero rich text
    if (doc.hero?.richText) {
      return this.lexicalRenderer.getExcerpt(doc.hero.richText, 30);
    }

    // Try to extract from layout blocks
    if (doc.layout && doc.layout.length > 0) {
      for (const block of doc.layout) {
        if (block.blockType === 'content' && 'columns' in block && block.columns) {
          for (const column of block.columns) {
            if (column.richText) {
              return this.lexicalRenderer.getExcerpt(column.richText, 30);
            }
          }
        }
        if (block.blockType === 'hero' && 'richText' in block && block.richText) {
          return this.lexicalRenderer.getExcerpt(block.richText, 30);
        }
      }
    }

    return '';
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
