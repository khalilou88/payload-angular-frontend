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

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary?: string;
  posted: string;
}

@Component({
  selector: 'app-careers',
  imports: [RouterModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-white dark:bg-gray-900">
      <!-- Hero Section -->
      <div
        class="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"
      >
        <div class="container-custom py-16 sm:py-24">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Join Our Team
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Be part of a dynamic team that's shaping the future of digital experiences. We're
              looking for passionate professionals who want to make a difference.
            </p>
          </div>
        </div>
      </div>

      <!-- Why Work With Us -->
      <div class="py-16 sm:py-24">
        <div class="container-custom">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Why Work With Us?
            </h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
              We're committed to creating an environment where you can grow and thrive
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Remote First -->
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
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Remote-First Culture
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Work from anywhere in the world. We believe in flexibility and work-life balance.
              </p>
            </div>

            <!-- Growth -->
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Continuous Growth
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Learn new technologies, attend conferences, and grow your skills with our learning
                budget.
              </p>
            </div>

            <!-- Innovation -->
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
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Cutting-Edge Projects
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Work on innovative projects using the latest technologies and methodologies.
              </p>
            </div>

            <!-- Health Benefits -->
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
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Comprehensive Benefits
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Health insurance, retirement planning, and wellness programs to keep you at your
                best.
              </p>
            </div>

            <!-- Flexible Hours -->
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Flexible Schedule
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Choose your hours and work when you're most productive. We focus on results, not
                hours.
              </p>
            </div>

            <!-- Team Culture -->
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
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Amazing Team</h3>
              <p class="text-gray-600 dark:text-gray-300">
                Join a supportive, diverse team that celebrates success and learns from challenges
                together.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Openings -->
      <div class="bg-gray-50 dark:bg-gray-800 py-16 sm:py-24">
        <div class="container-custom">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Current Openings
            </h2>
            <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Find the perfect role to advance your career
            </p>
          </div>

          <div class="space-y-6">
            @for (job of jobPostings; track job.id) {
              <div
                class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
              >
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        {{ job.title }}
                      </h3>
                      <span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{{
                        job.type
                      }}</span>
                    </div>
                    <div
                      class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4"
                    >
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                          />
                        </svg>
                        {{ job.department }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {{ job.location }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {{ job.experience }}
                      </span>
                      @if (job.salary) {
                        <span class="flex items-center gap-1">
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            />
                          </svg>
                          {{ job.salary }}
                        </span>
                      }
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">{{ job.description }}</p>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      Posted {{ job.posted }}
                    </div>
                  </div>
                  <div class="mt-4 lg:mt-0 lg:ml-6">
                    <button
                      (click)="openJobApplication(job)"
                      class="w-full lg:w-auto inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>

          @if (jobPostings.length === 0) {
            <div class="text-center py-12">
              <div
                class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Current Openings
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                We don't have any open positions at the moment, but we're always interested in
                hearing from talented individuals.
              </p>
              <button
                (click)="showGeneralApplication()"
                class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
              >
                Send General Application
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Application Modal/Form -->
      @if (showApplicationForm()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            class="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  {{ selectedJob() ? 'Apply for ' + selectedJob()?.title : 'General Application' }}
                </h3>
                <button
                  (click)="closeApplicationForm()"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              @if (applicationSubmitted()) {
                <div class="text-center py-8">
                  <div
                    class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  >
                    <svg
                      class="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Application Submitted!
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-6">
                    Thank you for your interest. We'll review your application and get back to you
                    soon.
                  </p>
                  <button
                    (click)="closeApplicationForm()"
                    class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              } @else {
                <form
                  [formGroup]="applicationForm"
                  (ngSubmit)="submitApplication()"
                  class="space-y-6"
                >
                  <!-- Basic Information -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        for="firstName"
                        class="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        formControlName="firstName"
                        class="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary text-sm"
                      />
                      @if (
                        applicationForm.get('firstName')?.invalid &&
                        applicationForm.get('firstName')?.touched
                      ) {
                        <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                          First name is required.
                        </p>
                      }
                    </div>
                    <div>
                      <label
                        for="lastName"
                        class="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        formControlName="lastName"
                        class="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary text-sm"
                      />
                      @if (
                        applicationForm.get('lastName')?.invalid &&
                        applicationForm.get('lastName')?.touched
                      ) {
                        <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                          Last name is required.
                        </p>
                      }
                    </div>
                  </div>

                  <div>
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      formControlName="email"
                      class="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary text-sm"
                    />
                    @if (
                      applicationForm.get('email')?.invalid && applicationForm.get('email')?.touched
                    ) {
                      <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                        Valid email address is required.
                      </p>
                    }
                  </div>

                  <div>
                    <label
                      for="phone"
                      class="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      formControlName="phone"
                      class="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary text-sm"
                    />
                  </div>

                  <div>
                    <label
                      for="coverLetter"
                      class="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Cover Letter *
                    </label>
                    <textarea
                      id="coverLetter"
                      formControlName="coverLetter"
                      rows="6"
                      placeholder="Tell us about yourself and why you're interested in this position..."
                      class="mt-1 block w-full rounded-md border-0 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary text-sm"
                    ></textarea>
                    @if (
                      applicationForm.get('coverLetter')?.invalid &&
                      applicationForm.get('coverLetter')?.touched
                    ) {
                      <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                        Cover letter is required.
                      </p>
                    }
                  </div>

                  <!-- File Upload Placeholder -->
                  <div>
                    <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Resume/CV *
                    </label>
                    <div
                      class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center"
                    >
                      <svg
                        class="w-12 h-12 text-gray-400 mx-auto mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p class="text-sm text-gray-600 dark:text-gray-300">
                        Click to upload your resume or drag and drop
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PDF, DOC, or DOCX up to 10MB
                      </p>
                    </div>
                  </div>

                  <div class="flex gap-4 pt-4">
                    <button
                      type="button"
                      (click)="closeApplicationForm()"
                      class="flex-1 inline-flex justify-center items-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      [disabled]="applicationForm.invalid || isSubmittingApplication()"
                      class="flex-1 inline-flex justify-center items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      @if (isSubmittingApplication()) {
                        <svg
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      } @else {
                        Submit Application
                      }
                    </button>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      }

      <!-- CTA Section -->
      <div class="bg-primary py-16 sm:py-24">
        <div class="container-custom text-center">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Don't See the Right Position?
          </h2>
          <p class="mt-4 text-xl text-primary-100">
            We're always interested in connecting with talented individuals. Send us your
            information!
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              (click)="showGeneralApplication()"
              class="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm hover:bg-gray-50 transition-colors"
            >
              Submit General Application
            </button>
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
export class CareersComponent implements OnInit {
  private seoService = inject(SeoService);
  private fb = inject(FormBuilder);

  protected showApplicationForm = signal(false);
  protected selectedJob = signal<JobPosting | null>(null);
  protected applicationSubmitted = signal(false);
  protected isSubmittingApplication = signal(false);

  protected applicationForm: FormGroup;

  protected jobPostings: JobPosting[] = [
    {
      id: 'senior-frontend-dev',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote / New York',
      type: 'Full-time',
      experience: '5+ years',
      description:
        'Join our engineering team to build next-generation web applications using React, TypeScript, and modern frontend technologies.',
      requirements: [
        '5+ years of experience with React and TypeScript',
        'Strong understanding of modern JavaScript (ES6+)',
        'Experience with state management (Redux, Zustand)',
        'Knowledge of testing frameworks (Jest, React Testing Library)',
        'Familiarity with build tools and CI/CD pipelines',
      ],
      benefits: [
        'Competitive salary and equity package',
        'Comprehensive health insurance',
        'Flexible working hours and remote work',
        'Professional development budget',
        'Latest equipment and tools',
      ],
      salary: '$120K - $160K',
      posted: '2 days ago',
    },
    {
      id: 'ux-designer',
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      experience: '3+ years',
      description:
        "We're looking for a talented UX Designer to help create intuitive and delightful user experiences for our products.",
      requirements: [
        '3+ years of UX/UI design experience',
        'Proficiency in Figma, Sketch, or similar tools',
        'Strong understanding of user-centered design principles',
        'Experience conducting user research and usability testing',
        'Portfolio demonstrating design process and thinking',
      ],
      benefits: [
        'Competitive salary',
        'Health, dental, and vision insurance',
        'Creative freedom and autonomy',
        'Design tools and software licenses',
        'Conference and workshop attendance',
      ],
      salary: '$90K - $120K',
      posted: '1 week ago',
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '4+ years',
      description:
        'Help us scale our infrastructure and improve our deployment processes. Work with cutting-edge cloud technologies.',
      requirements: [
        '4+ years of DevOps or infrastructure experience',
        'Strong knowledge of AWS, Azure, or GCP',
        'Experience with Docker, Kubernetes, and CI/CD',
        'Infrastructure as Code (Terraform, CloudFormation)',
        'Monitoring and logging tools experience',
      ],
      benefits: [
        'Competitive salary and bonuses',
        'Full remote work flexibility',
        'Learning and certification budget',
        'Top-tier equipment',
        'Flexible PTO policy',
      ],
      salary: '$110K - $140K',
      posted: '3 days ago',
    },
  ];

  constructor() {
    this.applicationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      coverLetter: ['', [Validators.required, Validators.minLength(50)]],
    });
  }

  ngOnInit() {
    this.setupSEO();
  }

  protected openJobApplication(job: JobPosting) {
    this.selectedJob.set(job);
    this.showApplicationForm.set(true);
    this.applicationSubmitted.set(false);
    this.applicationForm.reset();
  }

  protected showGeneralApplication() {
    this.selectedJob.set(null);
    this.showApplicationForm.set(true);
    this.applicationSubmitted.set(false);
    this.applicationForm.reset();
  }

  protected closeApplicationForm() {
    this.showApplicationForm.set(false);
    this.selectedJob.set(null);
    this.applicationSubmitted.set(false);
    this.applicationForm.reset();
  }

  protected submitApplication() {
    if (this.applicationForm.valid && !this.isSubmittingApplication()) {
      this.isSubmittingApplication.set(true);

      // Simulate form submission
      setTimeout(() => {
        console.log('Application submitted:', {
          job: this.selectedJob(),
          application: this.applicationForm.value,
        });
        this.isSubmittingApplication.set(false);
        this.applicationSubmitted.set(true);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.applicationForm.controls).forEach((key) => {
        this.applicationForm.get(key)?.markAsTouched();
      });
    }
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'Careers - Join Our Growing Team',
      description:
        'Join our team of talented professionals. We offer remote-first culture, competitive benefits, and opportunities to work on cutting-edge projects. View open positions.',
      keywords:
        'careers, jobs, remote work, web developer jobs, designer jobs, tech careers, join our team',
    });
  }
}
