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
  selector: 'app-about',
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
              About Us
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're passionate about creating exceptional digital experiences that make a
              difference. Learn about our mission, values, and the team behind our success.
            </p>
          </div>
        </div>
      </div>

      <!-- Mission Section -->
      <div class="py-16 sm:py-24">
        <div class="container-custom">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
              >
                Our Mission
              </h2>
              <p class="mt-6 text-lg text-gray-600 dark:text-gray-300">
                To empower businesses and individuals with innovative digital solutions that drive
                growth, efficiency, and meaningful connections. We believe technology should be
                accessible, intuitive, and transformative.
              </p>
              <div class="mt-8">
                <a
                  routerLink="/contact"
                  class="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
                >
                  Get in Touch
                  <svg class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div class="relative">
              <div class="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div
                  class="flex items-center justify-center h-96 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20"
                >
                  <svg
                    class="w-32 h-32 text-primary/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Values Section -->
      <div class="bg-gray-50 dark:bg-gray-800 py-16 sm:py-24">
        <div class="container-custom">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Values
            </h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The principles that guide everything we do
            </p>
          </div>

          <div class="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Innovation -->
            <div class="text-center">
              <div
                class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <svg
                  class="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Innovation</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                We constantly push boundaries and explore new technologies to deliver cutting-edge
                solutions.
              </p>
            </div>

            <!-- Quality -->
            <div class="text-center">
              <div
                class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <svg
                  class="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Quality</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                Excellence is non-negotiable. We maintain the highest standards in everything we
                create.
              </p>
            </div>

            <!-- Collaboration -->
            <div class="text-center">
              <div
                class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <svg
                  class="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                Collaboration
              </h3>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                We believe the best results come from working closely with our clients and team
                members.
              </p>
            </div>

            <!-- Transparency -->
            <div class="text-center">
              <div
                class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <svg
                  class="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Transparency</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                Open communication and honest relationships are the foundation of our partnerships.
              </p>
            </div>

            <!-- Sustainability -->
            <div class="text-center">
              <div
                class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <svg
                  class="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                Sustainability
              </h3>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                We're committed to creating solutions that are environmentally responsible and
                future-proof.
              </p>
            </div>

            <!-- Growth -->
            <div class="text-center">
              <div
                class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
              >
                <svg
                  class="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 class="mt-6 text-xl font-semibold text-gray-900 dark:text-white">Growth</h3>
              <p class="mt-2 text-gray-600 dark:text-gray-300">
                We're dedicated to continuous learning and improvement, both for ourselves and our
                clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Story Section -->
      <div class="py-16 sm:py-24">
        <div class="container-custom">
          <div class="max-w-3xl mx-auto text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Our Story
            </h2>
            <p class="mt-6 text-lg text-gray-600 dark:text-gray-300 text-left">
              Founded in 2020, we started as a small team of passionate developers and designers who
              believed that great technology should be accessible to everyone. What began as a
              vision to bridge the gap between complex technical solutions and user-friendly
              experiences has evolved into a mission-driven company serving clients worldwide.
            </p>
            <p class="mt-6 text-lg text-gray-600 dark:text-gray-300 text-left">
              Over the years, we've grown from a startup in a small office to a dynamic team of
              professionals who share a common goal: creating digital experiences that make a real
              impact. We've helped hundreds of businesses transform their operations, reach new
              audiences, and achieve their goals through thoughtful, innovative solutions.
            </p>
            <p class="mt-6 text-lg text-gray-600 dark:text-gray-300 text-left">
              Today, we continue to push boundaries and explore new frontiers in technology, always
              with our clients' success and our users' experience at the heart of everything we do.
            </p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-primary">
        <div class="container-custom py-16 sm:py-24">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Work Together?
            </h2>
            <p class="mt-4 text-xl text-primary-100">
              Let's discuss how we can help bring your vision to life.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                routerLink="/contact"
                class="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
              >
                Contact Us
              </a>
              <a
                routerLink="/services"
                class="inline-flex items-center justify-center rounded-md border border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
              >
                Our Services
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
export class AboutComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.setupSEO();
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'About Us - Learn About Our Mission & Values',
      description:
        "Discover our mission, values, and story. We're passionate about creating exceptional digital experiences that make a difference.",
      keywords: 'about us, mission, values, team, company story, digital solutions',
    });
  }
}
