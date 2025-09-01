import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PayloadApiService } from '../../../services/payload-api.service';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <div class="flex items-center justify-center mb-6">
            <div
              class="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
            >
              <span class="text-white font-bold text-lg">P</span>
            </div>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Reset your password</h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        @if (!emailSent()) {
          <!-- Forgot Password Form -->
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
            @if (error()) {
              <div
                class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-800 dark:text-red-200">{{ error() }}</p>
                  </div>
                </div>
              </div>
            }

            <!-- Email Field -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                required
                class="input-field"
                [class.border-red-300]="
                  forgotPasswordForm.get('email')?.invalid &&
                  forgotPasswordForm.get('email')?.touched
                "
                placeholder="Enter your email"
                autocomplete="email"
              />
              @if (
                forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched
              ) {
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Please enter a valid email address
                </p>
              }
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                [disabled]="forgotPasswordForm.invalid || isLoading()"
                class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                @if (isLoading()) {
                  <div
                    class="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  ></div>
                  Sending reset link...
                } @else {
                  <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Send reset link
                }
              </button>
            </div>
          </form>
        } @else {
          <!-- Success Message -->
          <div class="mt-8 text-center">
            <div
              class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-6"
            >
              <div class="flex justify-center mb-4">
                <div
                  class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center"
                >
                  <svg
                    class="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 class="text-lg font-medium text-green-900 dark:text-green-100 mb-2">
                Check your email
              </h3>
              <p class="text-sm text-green-800 dark:text-green-200 mb-4">
                We've sent a password reset link to <strong>{{ submittedEmail() }}</strong>
              </p>
              <p class="text-xs text-green-700 dark:text-green-300">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>

            <!-- Resend Button -->
            <div class="mt-6">
              <button
                type="button"
                (click)="resendEmail()"
                [disabled]="isLoading()"
                class="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50 transition-colors"
              >
                @if (isLoading()) {
                  Sending...
                } @else {
                  Resend email
                }
              </button>
            </div>
          </div>
        }

        <!-- Back to Login -->
        <div class="mt-8 text-center">
          <a
            routerLink="/login"
            class="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private payloadApi = inject(PayloadApiService);
  private seoService = inject(SeoService);

  forgotPasswordForm!: FormGroup;
  isLoading = signal(false);
  error = signal<string | null>(null);
  emailSent = signal(false);
  submittedEmail = signal<string>('');

  ngOnInit() {
    this.initializeForm();
    this.setupSEO();

    // Redirect if already logged in
    if (this.payloadApi.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  private initializeForm() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'Reset Password',
      description: 'Reset your password to regain access to your account',
      noIndex: true,
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      const { email } = this.forgotPasswordForm.value;

      this.payloadApi.forgotPassword(email).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.emailSent.set(true);
          this.submittedEmail.set(email);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.error.set(
            error?.error?.message ||
              'Unable to send reset email. Please check your email address and try again.',
          );
        },
      });
    }
  }

  resendEmail() {
    if (this.submittedEmail()) {
      this.isLoading.set(true);
      this.error.set(null);

      this.payloadApi.forgotPassword(this.submittedEmail()).subscribe({
        next: () => {
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.error.set(
            error?.error?.message || 'Unable to resend email. Please try again later.',
          );
        },
      });
    }
  }
}
