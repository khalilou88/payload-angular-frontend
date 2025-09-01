import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LexicalRendererService } from '../../../services/lexical-renderer.service';
import { MediaBlock } from '../../../types/payload.types';

@Component({
  selector: 'app-media-block',
  imports: [CommonModule],
  template: `
    @if (mediaBlock && mediaBlock.media) {
      <section [class]="getSectionClasses()">
        @if (mediaBlock.position === 'fullscreen') {
          <!-- Fullscreen Media -->
          <div class="relative h-screen overflow-hidden">
            @if (isVideo()) {
              <video
                [src]="mediaBlock.media.url"
                [poster]="getVideoPoster()"
                class="absolute inset-0 h-full w-full object-cover"
                autoplay
                muted
                loop
                playsinline
              >
                Your browser does not support the video tag.
              </video>
            } @else {
              <img
                [src]="getImageUrl()"
                [alt]="mediaBlock.media.alt || 'Media'"
                class="absolute inset-0 h-full w-full object-cover"
                [style.object-position]="getObjectPosition()"
                loading="lazy"
              />
            }

            @if (mediaBlock.caption) {
              <div
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent"
              >
                <div class="container-custom py-8">
                  <div
                    class="prose prose-lg prose-white max-w-none [&>p]:text-white/90"
                    [innerHTML]="renderCaption()"
                  ></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <!-- Default Media -->
          <div class="container-custom py-16 md:py-24">
            <div class="max-w-4xl mx-auto">
              <figure class="group">
                <div
                  class="relative overflow-hidden rounded-xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                >
                  @if (isVideo()) {
                    <video
                      [src]="mediaBlock.media.url"
                      [poster]="getVideoPoster()"
                      class="w-full h-auto"
                      controls
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  } @else {
                    <img
                      [src]="getImageUrl()"
                      [alt]="mediaBlock.media.alt || 'Media'"
                      class="w-full h-auto"
                      [style.object-position]="getObjectPosition()"
                      loading="lazy"
                    />
                  }

                  <!-- Image Overlay for Zoom Effect -->
                  @if (!isVideo()) {
                    <div
                      class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"
                    ></div>
                  }
                </div>

                @if (mediaBlock.caption) {
                  <figcaption class="mt-6">
                    <div
                      class="prose prose-gray dark:prose-invert max-w-none text-center"
                      [innerHTML]="renderCaption()"
                    ></div>
                  </figcaption>
                }
              </figure>
            </div>
          </div>
        }
      </section>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaBlockComponent {
  @Input() mediaBlock!: MediaBlock;

  private lexicalRenderer = inject(LexicalRendererService);

  getSectionClasses(): string {
    return this.mediaBlock.position === 'fullscreen' ? '' : 'bg-white dark:bg-gray-900';
  }

  isVideo(): boolean {
    return this.mediaBlock.media.mimeType?.startsWith('video/') || false;
  }

  getImageUrl(): string {
    const media = this.mediaBlock.media;

    // Use feature size if available for better quality
    if (media.sizes?.feature?.url) {
      return media.sizes.feature.url;
    }

    return media.url;
  }

  getVideoPoster(): string | undefined {
    // If there's a thumbnail size available, use it as poster
    const media = this.mediaBlock.media;
    if (media.sizes?.card?.url) {
      return media.sizes.card.url;
    }

    return undefined;
  }

  getObjectPosition(): string {
    const media = this.mediaBlock.media;
    if (media.focalX !== undefined && media.focalY !== undefined) {
      return `${media.focalX * 100}% ${media.focalY * 100}%`;
    }
    return 'center center';
  }

  renderCaption() {
    if (!this.mediaBlock.caption) return '';
    return this.lexicalRenderer.render(this.mediaBlock.caption);
  }
}
