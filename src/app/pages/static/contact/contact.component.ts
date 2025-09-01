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
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-900">
      <!-- Hero Section -->
      <div class="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
        <div class="container-custom py-16 sm:py-24">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Get In Touch
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ready to start your next project? We'd love to hear from you. Send us a message 
              and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="py-16 sm:py-24">
        <div class="container-custom">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <!-- Contact Form -->
            <div>
              <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
                Send us a message
              </h2>
              
              @if (isSubmitted()) {
                <div class="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div class="flex items-center">
                    <svg class="w-6 h-6 text-green-600 dark:text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 class="text-lg font-medium text-green-800 dark:text-green-200">Message Sent!</h3>
                      <p class="text-green-700 dark:text-green-300 mt-1">
                        Thank you for your message. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              } @else {
                <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
                  <!-- Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-900 dark:text-white">
                      Full Name *
                    </label>
                    <div class="mt-2">
                      <input
                        type="text"
                        id="name"
                        formControlName="name"
                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                        placeholder="Your full name"
                      />
                      @if (contactForm.get('name')?.invalid && contactForm.get('name')?.touched) {
                        <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                          Please enter your full name.
                        </p>
                      }
                    </div>
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-900 dark:text-white">
                      Email Address *
                    </label>
                    <div class="mt-2">
                      <input
                        type="email"
                        id="email"
                        formControlName="email"
                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                        placeholder="your.email@example.com"
                      />
                      @if (contactForm.get('email')?.invalid && contactForm.get('email')?.touched) {
                        <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                          Please enter a valid email address.
                        </p>
                      }
                    </div>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-900 dark:text-white">
                      Phone Number
                    </label>
                    <div class="mt-2">
                      <input
                        type="tel"
                        id="phone"
                        formControlName="phone"
                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <!-- Subject -->
                  <div>
                    <label for="subject" class="block text-sm font-medium text-gray-900 dark:text-white">
                      Subject *
                    </label>
                    <div class="mt-2">
                      <select
                        id="subject"
                        formControlName="subject"
                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                      >
                        <option value="">Select a subject</option>
                        <option value="web-development">Web Development</option>
                        <option value="mobile-development">Mobile Development</option>
                        <option value="ui-ux-design">UI/UX Design</option>
                        <option value="digital-strategy">Digital Strategy</option>
                        <option value="general-inquiry">General Inquiry</option>
                        <option value="support">Support</option>
                      </select>
                      @if (contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched) {
                        <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                          Please select a subject.
                        </p>
                      }
                    </div>
                  </div>

                  <!-- Message -->
                  <div>
                    <label for="message" class="block text-sm font-medium text-gray-900 dark:text-white">
                      Message *
                    </label>
                    <div class="mt-2">
                      <textarea
                        id="message"
                        formControlName="message"
                        rows="6"
                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                        placeholder="Tell us about your project or how we can help you..."
                      ></textarea>
                      @if (contactForm.get('message')?.invalid && contactForm.get('message')?.touched) {
                        <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                          Please enter your message.
                        </p>
                      }
                    </div>
                  </div>

                  <!-- Budget -->
                  <div>
                    <label for="budget" class="block text-sm font-medium text-gray-900 dark:text-white">
                      Project Budget
                    </label>
                    <div class="mt-2">
                      <select
                        id="budget"
                        formControlName="budget"
                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                      >
                        <option value="">Select your budget range</option>
                        <option value="under-5k">Under $5,000</option>
                        <option value="5k-15k">$5,000 - $15,000</option>
                        <option value="15k-50k">$15,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="over-100k">Over $100,000</option>
                        <option value="not-sure">Not sure yet</option>
                      </select>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="pt-4">
                    <button
                      type="submit"
                      [disabled]="contactForm.invalid || isSubmitting()"
                      class="w-full inline-flex justify-center items-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      @if (isSubmitting()) {
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Message...
                      } @else {
                        Send Message
                      }
                    </button>
                  </div>
                </form>
              }
            </div>

            <!-- Contact Information -->
            <div>
              <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-8">
                Contact Information
              </h2>
              
              <div class="space-y-8">
                <!-- Email -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                    <p class="mt-1 text-gray-600 dark:text-gray-300">
                      <a href="mailto:hello@company.com" class="hover:text-primary transition-colors">
                        hello@company.com
                      </a>
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                <!-- Phone -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Phone</h3>
                    <p class="mt-1 text-gray-600 dark:text-gray-300">
                      <a href="tel:+1234567890" class="hover:text-primary transition-colors">
                        +1 (234) 567-8900
                      </a>
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Mon-Fri 9AM-6PM EST
                    </p>
                  </div>
                </div>

                <!-- Location -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Office</h3>
                    <p class="mt-1 text-gray-600 dark:text-gray-300">
                      123 Business Ave<br>
                      Suite 100<br>
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <!-- Response Time -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Response Time</h3>
                    <p class="mt-1 text-gray-600 dark:text-gray-300">
                      Within 24 hours for general inquiries<br>
                      Same day for urgent matters
                    </p>
                  </div>
                </div>
              </div>

              <!-- Social Links -->
              <div class="mt-12">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Follow Us</h3>
                <div class="flex space-x-4">
                  <a href="#" class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.162-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                  <a href="#" class="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  private seoService = inject(SeoService);
  private fb = inject(FormBuilder);

  protected contactForm: FormGroup;
  protected isSubmitting = signal(false);
  protected isSubmitted = signal(false);

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      budget: [''],
    });
  }

  ngOnInit() {
    this.setupSEO();
  }

  protected onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);

      // Simulate form submission
      setTimeout(() => {
        console.log('Form submitted:', this.contactForm.value);
        this.isSubmitting.set(false);
        this.isSubmitted.set(true);

        // Reset form after successful submission
        this.contactForm.reset();
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'Contact Us - Get In Touch Today',
      description:
        'Ready to start your project? Contact us today for a free consultation. We offer web development, mobile apps, UI/UX design, and digital strategy services.',
      keywords:
        'contact us, get quote, free consultation, project inquiry, web development contact',
    });
  }
}
