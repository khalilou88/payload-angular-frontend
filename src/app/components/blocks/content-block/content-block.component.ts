import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  input,
} from '@angular/core';

import { RouterModule } from '@angular/router';
import { LexicalRendererService } from '../../../services/lexical-renderer.service';
import { ContentBlock } from '../../../types/payload.types';

@Component({
  selector: 'app-content-block',
  imports: [RouterModule],
  template: `
    @if (content() && content().columns) {
      <section class="py-16 md:py-24">
        <div class="container-custom">
          <div [class]="getGridClasses()">
            @for (column of content().columns; track $index) {
              <div [class]="getColumnClasses(column.size || 'full')">
                @if (column.richText) {
                  <div
                    class="prose prose-lg prose-gray dark:prose-invert max-w-none"
                    [innerHTML]="renderRichText(column.richText)"
                  ></div>
                }

                @if (column.enableLink && column.link) {
                  <div class="mt-8">
                    <a
                      [href]="getLinkUrl(column.link)"
                      [target]="column.link.newTab ? '_blank' : '_self'"
                      [rel]="column.link.newTab ? 'noopener noreferrer' : ''"
                      class="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {{ column.link.label }}
                      @if (column.link.newTab) {
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
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      } @else {
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      }
                    </a>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </section>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentBlockComponent {
  readonly content = input.required<ContentBlock>();

  private lexicalRenderer = inject(LexicalRendererService);

  getGridClasses(): string {
    const content = this.content();
    if (!content.columns) return '';

    const columnCount = content.columns.length;

    if (columnCount === 1) {
      return 'max-w-4xl mx-auto';
    }

    if (columnCount === 2) {
      return 'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16';
    }

    if (columnCount === 3) {
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12';
    }

    // For 4+ columns
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8';
  }

  getColumnClasses(size: 'oneThird' | 'half' | 'twoThirds' | 'full'): string {
    const baseClasses = '';

    // If we have explicit sizing and it's a grid layout
    const content = this.content();
    if (content.columns && content.columns.length > 1) {
      switch (size) {
        case 'oneThird':
          return `${baseClasses} lg:col-span-1`;
        case 'half':
          return `${baseClasses} lg:col-span-2`;
        case 'twoThirds':
          return `${baseClasses} lg:col-span-2`;
        case 'full':
          return `${baseClasses} lg:col-span-full`;
        default:
          return baseClasses;
      }
    }

    return baseClasses;
  }

  renderRichText(richText: any) {
    if (!richText) return '';
    return this.lexicalRenderer.render(richText);
  }

  getLinkUrl(link: any): string {
    if (link.type === 'custom') {
      return link.url || '#';
    }

    if (link.type === 'reference' && link.reference) {
      const doc = link.reference.value;
      if (typeof doc === 'object' && doc.slug) {
        return link.reference.relationTo === 'posts' ? `/blog/${doc.slug}` : `/${doc.slug}`;
      }
    }

    return '#';
  }
}
