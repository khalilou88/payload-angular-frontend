import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div class="container-custom">
        <div class="max-w-4xl mx-auto prose prose-lg prose-gray dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p class="lead">Last updated: {{ lastUpdated }}</p>

          <h2>Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account,
            subscribe to our newsletter, or contact us.
          </p>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services.</p>

          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties.
          </p>

          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </div>
      </div>
    </div>
  `,
})
export class PrivacyComponent implements OnInit {
  private seoService = inject(SeoService);

  lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  ngOnInit() {
    this.seoService.updateSEO({
      title: 'Privacy Policy',
      description: 'Our privacy policy and how we handle your data',
      url: '/privacy',
    });
  }
}
