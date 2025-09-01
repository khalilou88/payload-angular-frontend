import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-services',
  imports: [RouterModule],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-900">
      <!-- Hero Section -->
      <div
        class="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"
      >
        <div class="container-custom py-16 sm:py-24">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Our Services
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From concept to deployment, we provide comprehensive digital solutions tailored to
              your business needs and goals.
            </p>
          </div>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="py-16 sm:py-24">
        <div class="container-custom">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Web Development -->
            <div
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div class="flex items-center mb-6">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                </div>
                <h3 class="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Web Development
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Modern, responsive websites and web applications built with the latest technologies.
                We create scalable solutions that grow with your business.
              </p>
              <ul class="space-y-3 mb-8">
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Custom website development
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  E-commerce solutions
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Progressive Web Apps (PWAs)
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  API integration & development
                </li>
              </ul>
              <div class="text-right">
                <span class="text-2xl font-bold text-primary">Starting at $2,500</span>
              </div>
            </div>

            <!-- Mobile Development -->
            <div
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div class="flex items-center mb-6">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 class="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Mobile Development
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Native and cross-platform mobile applications that deliver exceptional user
                experiences across iOS and Android devices.
              </p>
              <ul class="space-y-3 mb-8">
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  iOS & Android native apps
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Cross-platform development
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  App Store optimization
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Push notifications & analytics
                </li>
              </ul>
              <div class="text-right">
                <span class="text-2xl font-bold text-primary">Starting at $5,000</span>
              </div>
            </div>

            <!-- UI/UX Design -->
            <div
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div class="flex items-center mb-6">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 class="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                  UI/UX Design
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                User-centered design solutions that combine beautiful aesthetics with intuitive
                functionality to create engaging digital experiences.
              </p>
              <ul class="space-y-3 mb-8">
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  User research & personas
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Wireframing & prototyping
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Visual design & branding
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Usability testing & optimization
                </li>
              </ul>
              <div class="text-right">
                <span class="text-2xl font-bold text-primary">Starting at $1,500</span>
              </div>
            </div>

            <!-- Digital Strategy -->
            <div
              class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            >
              <div class="flex items-center mb-6">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 class="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Digital Strategy
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Strategic consulting to help you navigate the digital landscape and make informed
                decisions that drive business growth and success.
              </p>
              <ul class="space-y-3 mb-8">
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Digital transformation planning
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Technology roadmapping
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Market analysis & competition
                </li>
                <li class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg class="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  ROI optimization & metrics
                </li>
              </ul>
              <div class="text-right">
                <span class="text-2xl font-bold text-primary">Starting at $3,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Process Section -->
      <div class="bg-gray-50 dark:bg-gray-800 py-16 sm:py-24">
        <div class="container-custom">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Process
            </h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
              A proven methodology that ensures successful project delivery
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Discovery -->
            <div class="text-center">
              <div
                class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6"
              >
                <span class="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Discovery</h3>
              <p class="text-gray-600 dark:text-gray-300">
                We start by understanding your business, goals, and challenges through detailed
                research and analysis.
              </p>
            </div>

            <!-- Planning -->
            <div class="text-center">
              <div
                class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6"
              >
                <span class="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Planning</h3>
              <p class="text-gray-600 dark:text-gray-300">
                We create detailed project plans, wireframes, and technical specifications to guide
                development.
              </p>
            </div>

            <!-- Development -->
            <div class="text-center">
              <div
                class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6"
              >
                <span class="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Development</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Our team builds your solution using agile methodologies with regular updates and
                feedback loops.
              </p>
            </div>

            <!-- Launch -->
            <div class="text-center">
              <div
                class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6"
              >
                <span class="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Launch</h3>
              <p class="text-gray-600 dark:text-gray-300">
                We deploy your solution and provide ongoing support to ensure optimal performance
                and success.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-primary">
        <div class="container-custom py-16 sm:py-24">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p class="mt-4 text-xl text-primary-100">
              Let's discuss your project and find the perfect solution for your needs.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                routerLink="/contact"
                class="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm hover:bg-gray-50 transition-colors"
              >
                Get Free Consultation
              </a>
              <a
                routerLink="/about"
                class="inline-flex items-center justify-center rounded-md border border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Learn More About Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.setupSEO();
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'Our Services - Web Development, Mobile Apps & Digital Strategy',
      description:
        'Comprehensive digital solutions including web development, mobile apps, UI/UX design, and digital strategy. From concept to deployment.',
      keywords:
        'web development, mobile apps, UI/UX design, digital strategy, custom development, e-commerce, PWA',
    });
  }
}
