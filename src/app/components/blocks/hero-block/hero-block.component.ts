import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LexicalRendererService } from '../../../services/lexical-renderer.service';
import { HeroBlock } from '../../../types/payload.types';

@Component({
  selector: 'app-hero-block',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (hero) {
      <section class="relative overflow-hidden" [class]="getHeroClasses()">
        <!-- Background Media -->
        @if (hero.media) {
          <div class="absolute inset-0 z-0">
            <img
              [src]="hero.media.url"
              [alt]="hero.media.alt || 'Hero background'"
              class="h-full w-full object-cover"
              [style.object-position]="getObjectPosition()"
            />
            <div class="absolute inset-0 bg-black/40"></div>
          </div>
        }

        <!-- Content -->
        <div class="relative z-10 container-custom">
          <div [class]="getContentClasses()">
            <div class="max-w-4xl" [class]="getTextAlignmentClass()">
              <!-- Rich Text Content -->
              @if (hero.richText) {
                <div
                  class="prose prose-lg max-w-none"
                  [class]="getProseClasses()"
                  [innerHTML]="renderRichText()"
                ></div>
              }

              <!-- Action Links -->
              @if (hero.links && hero.links.length > 0) {
                <div class="flex flex-wrap gap-4 mt-8">
                  @for (linkItem of hero.links; track $index) {
                    <a
                      [href]="getLinkUrl(linkItem.link)"
                      [target]="linkItem.link.newTab ? '_blank' : '_self'"
                      [rel]="linkItem.link.newTab ? 'noopener noreferrer' : ''"
                      [class]="getLinkClasses(linkItem.link.appearance || 'primary')"
                    >
                      {{ linkItem.link.label }}
                      @if (linkItem.link.newTab) {
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
                      }
                    </a>
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Scroll Indicator (only for fullscreen) -->
        @if (hero.type === 'fullscreen') {
          <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div class="animate-bounce">
              <svg
                class="h-6 w-6 text-white/80"
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
            </div>
          </div>
        }
      </section>
    }
  `,
})
export class HeroBlockComponent {
  @Input() hero!: HeroBlock;

  private lexicalRenderer = inject(LexicalRendererService);

  getHeroClasses(): string {
    const type = this.hero.type || 'default';

    const baseClasses = 'flex items-center';

    switch (type) {
      case 'fullscreen':
        return `${baseClasses} min-h-screen`;
      case 'minimal':
        return `${baseClasses} py-16 md:py-24`;
      default:
        return `${baseClasses} py-20 md:py-32`;
    }
  }

  getContentClasses(): string {
    const type = this.hero.type || 'default';

    switch (type) {
      case 'minimal':
        return 'flex items-center justify-center text-center py-8';
      default:
        return 'flex items-center min-h-[60vh]';
    }
  }

  getTextAlignmentClass(): string {
    const type = this.hero.type || 'default';

    switch (type) {
      case 'minimal':
        return 'text-center mx-auto';
      default:
        return '';
    }
  }

  getProseClasses(): string {
    const hasMedia = !!this.hero.media;
    const type = this.hero.type || 'default';

    if (hasMedia || type === 'fullscreen') {
      return 'prose-white [&>h1]:text-white [&>h2]:text-white [&>h3]:text-white [&>h4]:text-white [&>h5]:text-white [&>h6]:text-white [&>p]:text-white/90';
    }

    return 'prose-gray dark:prose-invert';
  }

  getObjectPosition(): string {
    const media = this.hero.media;
    if (media?.focalX !== undefined && media?.focalY !== undefined) {
      return `${media.focalX * 100}% ${media.focalY * 100}%`;
    }
    return 'center center';
  }

  renderRichText() {
    if (!this.hero.richText) return '';
    return this.lexicalRenderer.render(this.hero.richText);
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
      'inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    switch (appearance) {
      case 'secondary':
        return `${baseClasses} bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary`;
      case 'outline':
        const hasMedia = !!this.hero.media;
        if (hasMedia) {
          return `${baseClasses} border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:ring-white`;
        }
        return `${baseClasses} border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800`;
      default: // primary
        return `${baseClasses} bg-primary text-white hover:bg-primary/90 focus:ring-primary`;
    }
  }
}
