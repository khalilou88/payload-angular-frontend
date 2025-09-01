import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { RouterModule } from '@angular/router';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  expertise: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
}

@Component({
  selector: 'app-team',
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
              Meet Our Team
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're a diverse group of passionate professionals dedicated to creating exceptional
              digital experiences. Get to know the people behind our success.
            </p>
          </div>
        </div>
      </div>

      <!-- Team Stats -->
      <div class="py-16 sm:py-20 border-b border-gray-200 dark:border-gray-700">
        <div class="container-custom">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div class="text-3xl sm:text-4xl font-bold text-primary">12+</div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                Team Members
              </div>
            </div>
            <div>
              <div class="text-3xl sm:text-4xl font-bold text-primary">50+</div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                Projects Completed
              </div>
            </div>
            <div>
              <div class="text-3xl sm:text-4xl font-bold text-primary">5+</div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                Years Experience
              </div>
            </div>
            <div>
              <div class="text-3xl sm:text-4xl font-bold text-primary">98%</div>
              <div class="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                Client Satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Members -->
      <div class="py-16 sm:py-24">
        <div class="container-custom">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Leadership Team
            </h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The visionaries and leaders driving our company forward
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            @for (member of leaders; track member.id) {
              <div
                class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div class="aspect-w-3 aspect-h-3">
                  <div
                    class="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                  >
                    <div
                      class="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center"
                    >
                      <span class="text-3xl font-bold text-primary">{{
                        getInitials(member.name)
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ member.name }}
                  </h3>
                  <p class="text-primary font-medium mt-1">{{ member.role }}</p>
                  <p class="text-gray-600 dark:text-gray-300 mt-4 text-sm leading-relaxed">
                    {{ member.bio }}
                  </p>

                  <!-- Expertise Tags -->
                  <div class="flex flex-wrap gap-2 mt-4">
                    @for (skill of member.expertise; track skill) {
                      <span
                        class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        {{ skill }}
                      </span>
                    }
                  </div>

                  <!-- Social Links -->
                  <div class="flex gap-3 mt-6">
                    @if (member.social.linkedin) {
                      <a
                        [href]="member.social.linkedin"
                        class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                          />
                        </svg>
                      </a>
                    }
                    @if (member.social.twitter) {
                      <a
                        [href]="member.social.twitter"
                        class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                          />
                        </svg>
                      </a>
                    }
                    @if (member.social.github) {
                      <a
                        [href]="member.social.github"
                        class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                      >
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                          />
                        </svg>
                      </a>
                    }
                    @if (member.social.email) {
                      <a
                        [href]="'mailto:' + member.social.email"
                        class="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </a>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Development Team -->
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Development Team
            </h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Our talented developers and designers bringing ideas to life
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (member of developers; track member.id) {
              <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div
                  class="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <span class="text-xl font-bold text-primary">{{ getInitials(member.name) }}</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ member.name }}
                </h3>
                <p class="text-primary font-medium text-sm mt-1">{{ member.role }}</p>
                <p class="text-gray-600 dark:text-gray-300 mt-3 text-sm">{{ member.bio }}</p>

                <!-- Expertise Tags -->
                <div class="flex flex-wrap gap-1 mt-3 justify-center">
                  @for (skill of member.expertise.slice(0, 3); track skill) {
                    <span
                      class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {{ skill }}
                    </span>
                  }
                </div>

                <!-- Social Links -->
                <div class="flex gap-2 mt-4 justify-center">
                  @if (member.social.linkedin) {
                    <a
                      [href]="member.social.linkedin"
                      class="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                        />
                      </svg>
                    </a>
                  }
                  @if (member.social.github) {
                    <a
                      [href]="member.social.github"
                      class="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                        />
                      </svg>
                    </a>
                  }
                  @if (member.social.email) {
                    <a
                      [href]="'mailto:' + member.social.email"
                      class="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-xs"
                    >
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Values Section -->
      <div class="bg-gray-50 dark:bg-gray-800 py-16 sm:py-24">
        <div class="container-custom">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What Drives Us
            </h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
              The core values that unite our team and guide our work
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div
                class="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-primary"
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
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Collaboration
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                We work together as one team, combining our diverse skills and perspectives to
                create amazing results.
              </p>
            </div>

            <div class="text-center">
              <div
                class="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-primary"
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
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Innovation</h3>
              <p class="text-gray-600 dark:text-gray-300">
                We continuously explore new technologies and approaches to deliver cutting-edge
                solutions.
              </p>
            </div>

            <div class="text-center">
              <div
                class="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Passion</h3>
              <p class="text-gray-600 dark:text-gray-300">
                We love what we do, and that passion shows in the quality and creativity of our
                work.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-primary py-16 sm:py-24">
        <div class="container-custom text-center">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Want to Join Our Team?
          </h2>
          <p class="mt-4 text-xl text-primary-100">
            We're always looking for talented individuals who share our passion for excellence.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              routerLink="/careers"
              class="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm hover:bg-gray-50 transition-colors"
            >
              View Open Positions
            </a>
            <a
              routerLink="/contact"
              class="inline-flex items-center justify-center rounded-md border border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamComponent implements OnInit {
  private seoService = inject(SeoService);

  protected leaders: TeamMember[] = [
    {
      id: 'leader-1',
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years of experience in digital strategy and business development. Passionate about building teams that deliver exceptional results.',
      avatar: '/assets/team/sarah-johnson.jpg',
      expertise: ['Business Strategy', 'Digital Transformation', 'Team Leadership'],
      social: {
        linkedin: 'https://linkedin.com/in/sarah-johnson',
        twitter: 'https://twitter.com/sarahjohnson',
        email: 'sarah@company.com',
      },
    },
    {
      id: 'leader-2',
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      bio: 'Technology architect and full-stack developer with expertise in scalable systems and modern web technologies. Leads our technical vision and innovation.',
      avatar: '/assets/team/michael-chen.jpg',
      expertise: ['System Architecture', 'Full-Stack Development', 'DevOps'],
      social: {
        linkedin: 'https://linkedin.com/in/michael-chen',
        github: 'https://github.com/michaelchen',
        email: 'michael@company.com',
      },
    },
    {
      id: 'leader-3',
      name: 'Emma Rodriguez',
      role: 'Head of Design',
      bio: 'Creative director with a passion for user-centered design. Specializes in creating intuitive interfaces and memorable brand experiences.',
      avatar: '/assets/team/emma-rodriguez.jpg',
      expertise: ['UI/UX Design', 'Brand Strategy', 'Design Systems'],
      social: {
        linkedin: 'https://linkedin.com/in/emma-rodriguez',
        twitter: 'https://twitter.com/emmarodriguez',
        email: 'emma@company.com',
      },
    },
  ];

  protected developers: TeamMember[] = [
    {
      id: 'dev-1',
      name: 'Alex Thompson',
      role: 'Senior Frontend Developer',
      bio: 'React and Angular specialist with a keen eye for performance optimization.',
      avatar: '/assets/team/alex-thompson.jpg',
      expertise: ['React', 'Angular', 'TypeScript', 'Performance'],
      social: {
        linkedin: 'https://linkedin.com/in/alex-thompson',
        github: 'https://github.com/alexthompson',
      },
    },
    {
      id: 'dev-2',
      name: 'Lisa Park',
      role: 'Backend Developer',
      bio: 'Node.js and Python expert focused on building robust APIs and microservices.',
      avatar: '/assets/team/lisa-park.jpg',
      expertise: ['Node.js', 'Python', 'APIs', 'Databases'],
      social: {
        linkedin: 'https://linkedin.com/in/lisa-park',
        github: 'https://github.com/lisapark',
      },
    },
    {
      id: 'dev-3',
      name: 'Jordan Martinez',
      role: 'Mobile Developer',
      bio: 'Cross-platform mobile development specialist with React Native and Flutter expertise.',
      avatar: '/assets/team/jordan-martinez.jpg',
      expertise: ['React Native', 'Flutter', 'iOS', 'Android'],
      social: {
        linkedin: 'https://linkedin.com/in/jordan-martinez',
        github: 'https://github.com/jordanmartinez',
      },
    },
    {
      id: 'dev-4',
      name: 'David Kim',
      role: 'DevOps Engineer',
      bio: 'Infrastructure and deployment automation expert ensuring reliable, scalable systems.',
      avatar: '/assets/team/david-kim.jpg',
      expertise: ['AWS', 'Docker', 'CI/CD', 'Monitoring'],
      social: {
        linkedin: 'https://linkedin.com/in/david-kim',
        github: 'https://github.com/davidkim',
      },
    },
    {
      id: 'dev-5',
      name: 'Rachel Green',
      role: 'UX Designer',
      bio: 'User experience researcher and designer creating intuitive, accessible interfaces.',
      avatar: '/assets/team/rachel-green.jpg',
      expertise: ['User Research', 'Prototyping', 'Accessibility', 'Figma'],
      social: {
        linkedin: 'https://linkedin.com/in/rachel-green',
      },
    },
    {
      id: 'dev-6',
      name: 'Carlos Silva',
      role: 'QA Engineer',
      bio: 'Quality assurance specialist ensuring our applications meet the highest standards.',
      avatar: '/assets/team/carlos-silva.jpg',
      expertise: ['Test Automation', 'Performance Testing', 'Security', 'QA'],
      social: {
        linkedin: 'https://linkedin.com/in/carlos-silva',
        github: 'https://github.com/carlossilva',
      },
    },
    {
      id: 'dev-7',
      name: 'Priya Patel',
      role: 'Frontend Developer',
      bio: 'Vue.js and modern CSS specialist with a passion for responsive design.',
      avatar: '/assets/team/priya-patel.jpg',
      expertise: ['Vue.js', 'CSS', 'Responsive Design', 'Animation'],
      social: {
        linkedin: 'https://linkedin.com/in/priya-patel',
        github: 'https://github.com/priyapatel',
      },
    },
    {
      id: 'dev-8',
      name: 'Tom Wilson',
      role: 'Project Manager',
      bio: 'Agile project management expert ensuring smooth delivery and client satisfaction.',
      avatar: '/assets/team/tom-wilson.jpg',
      expertise: ['Agile', 'Scrum', 'Project Planning', 'Client Relations'],
      social: {
        linkedin: 'https://linkedin.com/in/tom-wilson',
        email: 'tom@company.com',
      },
    },
  ];

  ngOnInit() {
    this.setupSEO();
  }

  protected getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'Our Team - Meet the People Behind Our Success',
      description:
        'Meet our talented team of developers, designers, and strategists. Learn about the passionate professionals driving innovation and delivering exceptional results.',
      keywords: 'our team, company team, developers, designers, leadership, team members, staff',
    });
  }
}
