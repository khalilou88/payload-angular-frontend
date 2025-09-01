import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  input,
} from '@angular/core';

import { RouterModule } from '@angular/router';
import { LexicalRendererService } from '../../../services/lexical-renderer.service';
import { CallToActionBlock } from '../../../types/payload.types';

@Component({
  selector: 'app-cta-block',
  imports: [RouterModule],
  template: `
    @if (cta()) {
      <section
        class="py-16 md:py-24 bg-gradient-to-br from-primary to-secondary relative overflow-hidden"
      >
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <svg class="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="cta-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-pattern)" />
          </svg>
        </div>

        <div class="container-custom relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            @if (cta().richText) {
              <div
                class="prose prose-lg prose-white max-w-none [&>h1]:text-white [&>h2]:text-white [&>h3]:text-white [&>h4]:text-white [&>h5]:text-white [&>h6]:text-white [&>p]:text-white/90 [&>p]:text-xl"
                [innerHTML]="renderRichText()"
              ></div>
            }

            @if (cta().links && cta().links?.length! > 0) {
              <div class="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                @for (linkItem of cta().links; track $index) {
                  <a
                    [href]="getLinkUrl(linkItem.link)"
                    [target]="linkItem.link.newTab ? '_blank' : '_self'"
                    [rel]="linkItem.link.newTab ? 'noopener noreferrer' : ''"
                    [class]="getLinkClasses(linkItem.link.appearance || 'primary')"
                  >
                    {{ linkItem.link.label }}
                    @if (linkItem.link.newTab) {
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
                    } @else {
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    }
                  </a>
                }
              </div>
            }
          </div>
        </div>

        <!-- Decorative Elements -->
        <div
          class="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"
        ></div>
        <div
          class="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"
        ></div>

        <!-- Floating Elements -->
        <div class="absolute top-1/4 left-1/4 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
        <div
          class="absolute top-1/3 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-pulse"
          style="animation-delay: 0.5s;"
        ></div>
        <div
          class="absolute bottom-1/4 left-1/3 w-4 h-4 bg-white/15 rounded-full animate-pulse"
          style="animation-delay: 1s;"
        ></div>
      </section>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaBlockComponent {
  readonly cta = input.required<CallToActionBlock>();

  private lexicalRenderer = inject(LexicalRendererService);

  renderRichText() {
    const cta = this.cta();
    if (!cta.richText) return '';
    return this.lexicalRenderer.render(cta.richText);
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

  getLinkClasses(appearance: 'primary' | 'secondary' | 'outline'): string {
    const baseClasses =
      'inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 shadow-lg hover:shadow-xl';

    switch (appearance) {
      case 'secondary':
        return `${baseClasses} bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary shadow-secondary/25`;
      case 'outline':
        return `${baseClasses} border-2 border-white text-white hover:bg-white hover:text-primary focus:ring-white bg-white/10 backdrop-blur-sm`;
      default: // primary
        return `${baseClasses} bg-white text-primary hover:bg-gray-50 focus:ring-white shadow-white/25`;
    }
  }
}
