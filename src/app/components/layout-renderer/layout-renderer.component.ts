import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';

import { LayoutBlocks } from '../../types/payload.types';
import { HeroBlockComponent } from '../blocks/hero-block/hero-block.component';
import { ContentBlockComponent } from '../blocks/content-block/content-block.component';
import { MediaBlockComponent } from '../blocks/media-block/media-block.component';
import { CtaBlockComponent } from '../blocks/cta-block/cta-block.component';
import { ArchiveBlockComponent } from '../blocks/archive-block/archive-block.component';

@Component({
  selector: 'app-layout-renderer',
  imports: [
    HeroBlockComponent,
    ContentBlockComponent,
    MediaBlockComponent,
    CtaBlockComponent,
    ArchiveBlockComponent,
  ],
  template: `
    @if (layout() && layout()?.length! > 0) {
      @for (block of layout(); track block.id) {
        @switch (block.blockType) {
          @case ('hero') {
            <app-hero-block [hero]="block" />
          }
          @case ('content') {
            <app-content-block [content]="block" />
          }
          @case ('mediaBlock') {
            <app-media-block [mediaBlock]="block" />
          }
          @case ('cta') {
            <app-cta-block [cta]="block" />
          }
          @case ('archive') {
            <app-archive-block [archive]="block" />
          }
        }
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutRendererComponent {
  readonly layout = input.required<LayoutBlocks[] | undefined>();
}
