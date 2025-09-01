import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { RouterModule } from '@angular/router';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'services' | 'pricing' | 'process' | 'technical';
}

@Component({
  selector: 'app-faq',
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
              Frequently Asked Questions
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about our services, process, and pricing. Can't find
              what you're looking for? Feel free to contact us.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ Categories -->
      <div class="py-8 border-b border-gray-200 dark:border-gray-700">
        <div class="container-custom">
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              (click)="setActiveCategory('all')"
              [class]="
                activeCategory() === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              "
              class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              All Questions
            </button>
            <button
              (click)="setActiveCategory('general')"
              [class]="
                activeCategory() === 'general'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              "
              class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              General
            </button>
            <button
              (click)="setActiveCategory('services')"
              [class]="
                activeCategory() === 'services'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              "
              class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Services
            </button>
            <button
              (click)="setActiveCategory('pricing')"
              [class]="
                activeCategory() === 'pricing'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              "
              class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Pricing
            </button>
            <button
              (click)="setActiveCategory('process')"
              [class]="
                activeCategory() === 'process'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              "
              class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Process
            </button>
            <button
              (click)="setActiveCategory('technical')"
              [class]="
                activeCategory() === 'technical'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              "
              class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Technical
            </button>
          </div>
        </div>
      </div>

      <!-- FAQ Items -->
      <div class="py-16 sm:py-24">
        <div class="container-custom max-w-4xl">
          <div class="space-y-4">
            @for (faq of filteredFAQs(); track faq.id) {
              <div
                class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  (click)="toggleFAQ(faq.id)"
                  class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white pr-4">
                    {{ faq.question }}
                  </h3>
                  <svg
                    [class]="openFAQs().has(faq.id) ? 'rotate-180' : ''"
                    class="w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                @if (openFAQs().has(faq.id)) {
                  <div class="px-6 pb-4">
                    <div
                      class="text-gray-600 dark:text-gray-300 leading-relaxed"
                      [innerHTML]="faq.answer"
                    ></div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-gray-50 dark:bg-gray-800 py-16 sm:py-24">
        <div class="container-custom text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Still Have Questions?
          </h2>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
            We're here to help! Contact us for personalized assistance with your project.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              routerLink="/contact"
              class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="mailto:hello@company.com"
              class="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 px-6 py-3 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Email Us Directly
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FAQComponent implements OnInit {
  private seoService = inject(SeoService);

  protected activeCategory = signal<
    'all' | 'general' | 'services' | 'pricing' | 'process' | 'technical'
  >('all');
  protected openFAQs = signal(new Set<string>());

  protected faqs: FAQItem[] = [
    // General Questions
    {
      id: 'general-1',
      category: 'general',
      question: 'How long does it take to build a website or application?',
      answer:
        'Project timelines vary depending on complexity and scope. A simple website typically takes 2-4 weeks, while complex web applications can take 3-6 months or more. We provide detailed timeline estimates during our initial consultation based on your specific requirements.',
    },
    {
      id: 'general-2',
      category: 'general',
      question: 'Do you work with clients outside your local area?',
      answer:
        "Absolutely! We work with clients worldwide. Thanks to modern communication tools and project management systems, we can collaborate effectively regardless of location. We've successfully completed projects for clients across different time zones and countries.",
    },
    {
      id: 'general-3',
      category: 'general',
      question: "What happens if I'm not satisfied with the final result?",
      answer:
        "Client satisfaction is our top priority. We include revision rounds in all our projects and maintain open communication throughout development. If you're not satisfied, we'll work with you to make necessary adjustments until you're happy with the result.",
    },

    // Services Questions
    {
      id: 'services-1',
      category: 'services',
      question: 'What technologies do you use for web development?',
      answer:
        'We use modern, proven technologies including React, Angular, Vue.js, Node.js, Python, and various databases. We choose the best technology stack based on your project requirements, scalability needs, and long-term goals.',
    },
    {
      id: 'services-2',
      category: 'services',
      question: 'Can you help with mobile app development?',
      answer:
        'Yes! We develop both native iOS and Android apps, as well as cross-platform solutions using React Native and Flutter. We can help you choose the best approach based on your target audience, budget, and feature requirements.',
    },
    {
      id: 'services-3',
      category: 'services',
      question: 'Do you provide ongoing maintenance and support?',
      answer:
        'Yes, we offer comprehensive maintenance and support packages. This includes security updates, bug fixes, performance optimization, content updates, and technical support. We can customize a maintenance plan that fits your specific needs and budget.',
    },
    {
      id: 'services-4',
      category: 'services',
      question: 'Can you redesign my existing website?',
      answer:
        'Absolutely! We specialize in website redesigns and modernization. We can update your existing site with modern design, improved user experience, better performance, and mobile responsiveness while preserving your existing content and SEO rankings.',
    },

    // Pricing Questions
    {
      id: 'pricing-1',
      category: 'pricing',
      question: 'How much does a typical website cost?',
      answer:
        'Website costs vary significantly based on complexity, features, and design requirements. Simple websites start around $2,500, while complex web applications can range from $10,000 to $100,000+. We provide detailed quotes after understanding your specific needs.',
    },
    {
      id: 'pricing-2',
      category: 'pricing',
      question: 'Do you require payment upfront?',
      answer:
        'We typically work with a milestone-based payment structure. This usually involves an initial deposit (usually 25-50%) to begin work, followed by payments at key project milestones. This approach protects both parties and ensures steady progress.',
    },
    {
      id: 'pricing-3',
      category: 'pricing',
      question: 'Are there any hidden costs I should know about?',
      answer:
        "We believe in transparent pricing. All costs are outlined in our detailed proposals, including development, design, testing, and deployment. The only additional costs might be third-party services like hosting, domain registration, or premium plugins, which we'll discuss upfront.",
    },
    {
      id: 'pricing-4',
      category: 'pricing',
      question: 'Do you offer payment plans?',
      answer:
        "Yes, we offer flexible payment plans for larger projects. We can structure payments around project milestones or monthly installments, depending on the project scope and timeline. We're happy to discuss options that work for your budget.",
    },

    // Process Questions
    {
      id: 'process-1',
      category: 'process',
      question: "What's your typical development process?",
      answer:
        'Our process includes four main phases: <strong>Discovery</strong> (understanding your needs), <strong>Planning</strong> (creating detailed specifications and designs), <strong>Development</strong> (building and testing), and <strong>Launch</strong> (deployment and handover). We maintain regular communication throughout each phase.',
    },
    {
      id: 'process-2',
      category: 'process',
      question: 'How involved will I be in the development process?',
      answer:
        "We encourage client involvement throughout the project. You'll have regular check-ins, access to development previews, and opportunities to provide feedback at key milestones. Your input is crucial for ensuring the final product meets your expectations.",
    },
    {
      id: 'process-3',
      category: 'process',
      question: 'What do you need from me to get started?',
      answer:
        "To get started, we need a clear understanding of your goals, target audience, preferred timeline, and any existing brand materials. We'll also need access to relevant accounts (hosting, domains, etc.) when appropriate. Our discovery phase helps identify all requirements.",
    },
    {
      id: 'process-4',
      category: 'process',
      question: 'Can I make changes during development?',
      answer:
        'Yes, we understand that requirements can evolve. We accommodate reasonable changes during development, though significant scope changes may affect timeline and budget. We discuss any impacts before implementing changes to keep you informed.',
    },

    // Technical Questions
    {
      id: 'technical-1',
      category: 'technical',
      question: 'Will my website be mobile-friendly?',
      answer:
        'Absolutely! All our websites are built with responsive design, ensuring they look and function perfectly on all devices - smartphones, tablets, and desktop computers. We test extensively across different devices and screen sizes.',
    },
    {
      id: 'technical-2',
      category: 'technical',
      question: 'How do you ensure my website is secure?',
      answer:
        'Security is built into our development process. We implement SSL certificates, secure coding practices, regular updates, strong authentication systems, and follow industry security standards. We also provide ongoing security monitoring and updates.',
    },
    {
      id: 'technical-3',
      category: 'technical',
      question: 'Will I be able to update content myself?',
      answer:
        'Yes! We build user-friendly content management systems that allow you to easily update text, images, and other content without technical knowledge. We also provide training and documentation to help you manage your site confidently.',
    },
    {
      id: 'technical-4',
      category: 'technical',
      question: 'What about search engine optimization (SEO)?',
      answer:
        'SEO best practices are built into all our projects. This includes optimized page structure, meta tags, site speed optimization, mobile-friendliness, and clean URLs. We can also provide advanced SEO services and ongoing optimization strategies.',
    },
    {
      id: 'technical-5',
      category: 'technical',
      question: 'Do you provide hosting services?',
      answer:
        "While we don't provide hosting directly, we partner with reliable hosting providers and can help you choose the best hosting solution for your needs. We can also assist with setup, configuration, and ongoing hosting management if needed.",
    },
  ];

  protected filteredFAQs = signal<FAQItem[]>([]);

  ngOnInit() {
    this.setupSEO();
    this.updateFilteredFAQs();
  }

  protected setActiveCategory(
    category: 'all' | 'general' | 'services' | 'pricing' | 'process' | 'technical',
  ) {
    this.activeCategory.set(category);
    this.updateFilteredFAQs();
    // Close all open FAQs when switching categories
    this.openFAQs.set(new Set());
  }

  protected toggleFAQ(id: string) {
    const openFAQs = this.openFAQs();
    const newOpenFAQs = new Set(openFAQs);

    if (newOpenFAQs.has(id)) {
      newOpenFAQs.delete(id);
    } else {
      newOpenFAQs.add(id);
    }

    this.openFAQs.set(newOpenFAQs);
  }

  private updateFilteredFAQs() {
    const category = this.activeCategory();
    if (category === 'all') {
      this.filteredFAQs.set(this.faqs);
    } else {
      this.filteredFAQs.set(this.faqs.filter((faq) => faq.category === category));
    }
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'FAQ - Frequently Asked Questions About Our Services',
      description:
        'Find answers to common questions about our web development, mobile app development, UI/UX design, and digital strategy services. Get the information you need.',
      keywords:
        'FAQ, frequently asked questions, web development questions, pricing, process, technical support',
    });
  }
}
