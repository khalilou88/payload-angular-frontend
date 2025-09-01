import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { PayloadApiService } from '../../services/payload-api.service';
import { SearchResult } from '../../types/payload.types';

@Component({
  selector: 'app-search',
  imports: [RouterModule],
  template: `
    <div class="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold mb-8">Search Results</h1>

          @if (query()) {
            <p class="text-gray-600 dark:text-gray-400 mb-8">Showing results for "{{ query() }}"</p>
          }

          @if (results().length > 0) {
            <div class="space-y-6">
              @for (result of results(); track result.doc.id) {
                <div class="card p-6">
                  <h3 class="text-xl font-semibold mb-2">
                    <a
                      [routerLink]="getResultUrl(result)"
                      class="text-primary hover:text-primary/80"
                    >
                      {{ result.doc.title }}
                    </a>
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">{{ getResultDescription(result) }}</p>
                </div>
              }
            </div>
          } @else {
            <div class="text-center py-16">
              <p class="text-gray-600 dark:text-gray-400">No results found</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private payloadApi = inject(PayloadApiService);

  query = signal('');
  results = signal<SearchResult[]>([]);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['q']) {
        this.query.set(params['q']);
        this.search(params['q']);
      }
    });
  }

  private search(query: string) {
    this.payloadApi.search(query).subscribe({
      next: (results) => this.results.set(results),
      error: (error) => console.error('Search failed:', error),
    });
  }

  getResultUrl(result: SearchResult): string {
    return result.relationTo === 'posts' ? `/blog/${result.doc.slug}` : `/${result.doc.slug}`;
  }

  getResultDescription(result: SearchResult): string {
    return result.doc.meta?.description || '';
  }
}
