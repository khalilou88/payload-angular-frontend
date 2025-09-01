import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-terms',
  imports: [CommonModule],
  template: `
    <div class="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto prose prose-lg prose-gray dark:prose-invert">
          <h1>Terms of Service</h1>
          <p class="lead">Last updated: {{ lastUpdated }}</p>

          <h2>Agreement to Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and
            provision of this agreement.
          </p>

          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on this website
            for personal, non-commercial transitory viewing only.
          </p>

          <h2>Disclaimer</h2>
          <p>
            The materials on this website are provided on an 'as is' basis. We make no warranties,
            expressed or implied.
          </p>

          <h2>Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us.</p>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsComponent implements OnInit {
  private seoService = inject(SeoService);

  lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  ngOnInit() {
    this.seoService.updateSEO({
      title: 'Terms of Service',
      description: 'Terms of service and conditions for using our website',
      url: '/terms',
    });
  }
}
