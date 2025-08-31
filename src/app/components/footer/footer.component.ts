import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayloadApiService } from '../../services/payload-api.service';
import { Footer } from '../../types/payload.types';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div class="container-custom">
        <div class="py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Brand Column -->
            <div class="md:col-span-2">
              <div class="flex items-center space-x-2 mb-4">
                <div
                  class="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                >
                  <span class="text-white font-bold text-sm">P</span>
                </div>
                <span class="text-xl font-bold text-gray-900 dark:text-white">Payload</span>
              </div>

              <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                A modern website built with Payload CMS and Angular. Delivering powerful content
                management with beautiful design.
              </p>

              <!-- Social Links -->
              <div class="flex space-x-4">
                <a
                  href="#"
                  class="text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                    ></path>
                  </svg>
                </a>

                <a
                  href="#"
                  class="text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </a>

                <a
                  href="#"
                  class="text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>

            <!-- Navigation Columns -->
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Navigation</h3>
              <ul class="space-y-3">
                @if (footerData(); as footer) {
                  @for (item of footer.navItems?.slice(0, 4); track item.link.label) {
                    <li>
                      <a
                        [href]="getLinkUrl(item.link)"
                        [target]="item.link.newTab ? '_blank' : '_self'"
                        [rel]="item.link.newTab ? 'noopener noreferrer' : ''"
                        class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                      >
                        {{ item.link.label }}
                      </a>
                    </li>
                  }
                }

                <li>
                  <a
                    routerLink="/blog"
                    class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul class="space-y-3">
                <li>
                  <a
                    [href]="adminUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                  >
                    Admin Panel
                  </a>
                </li>
                <li>
                  <a
                    href="https://payloadcms.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/payloadcms/payload"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/payload"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-gray-200 dark:border-gray-800 py-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div class="flex items-center space-x-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                @if (footerData()?.copyright) {
                  {{ footerData()?.copyright }}
                } @else {
                  © {{ currentYear }} Payload Website. All rights reserved.
                }
              </p>
            </div>

            <div class="flex items-center space-x-6 mt-4 md:mt-0">
              <a
                href="/privacy"
                class="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                class="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/sitemap.xml"
                class="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors"
              >
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent implements OnInit {
  private payloadApi = inject(PayloadApiService);

  footerData = signal<Footer | null>(null);
  currentYear = new Date().getFullYear();

  protected readonly adminUrl = environment.adminUrl;

  ngOnInit() {
    this.loadFooterData();
  }

  private loadFooterData() {
    this.payloadApi.getFooter().subscribe({
      next: (footer) => this.footerData.set(footer),
      error: (error) => console.error('Failed to load footer data:', error),
    });
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
