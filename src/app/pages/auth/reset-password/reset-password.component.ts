import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PayloadApiService } from '../../../services/payload-api.service';
import { SeoService } from '../../../services/seo.service';

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-reset-password',
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
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Set new password</h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Choose a strong password to secure your account.
          </p>
        </div>

        @if (!tokenValid()) {
          <!-- Invalid Token Message -->
          <div
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-6 text-center"
          >
            <div class="flex justify-center mb-4">
              <div
                class="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center"
              >
                <svg
                  class="h-6 w-6 text-red-600 dark:text-red-400"
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
            </div>
            <h3 class="text-lg font-medium text-red-900 dark:text-red-100 mb-2">
              Invalid or expired link
            </h3>
            <p class="text-sm text-red-800 dark:text-red-200 mb-4">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <a
              routerLink="/forgot-password"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Request new link
            </a>
          </div>
        } @else {
          @if (!passwordReset()) {
            <!-- Reset Password Form -->
            <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
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

              <div class="space-y-4">
                <!-- Password Field -->
                <div>
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    New Password
                  </label>
                  <div class="relative">
                    <input
                      id="password"
                      [type]="showPassword() ? 'text' : 'password'"
                      formControlName="password"
                      required
                      class="input-field pr-10"
                      [class.border-red-300]="
                        resetPasswordForm.get('password')?.invalid &&
                        resetPasswordForm.get('password')?.touched
                      "
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      (click)="togglePasswordVisibility()"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      @if (showPassword()) {
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      } @else {
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      }
                    </button>
                  </div>
                  @if (
                    resetPasswordForm.get('password')?.invalid &&
                    resetPasswordForm.get('password')?.touched
                  ) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                      Password must be at least 8 characters long
                    </p>
                  }
                </div>

                <!-- Confirm Password Field -->
                <div>
                  <label
                    for="confirmPassword"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    formControlName="confirmPassword"
                    required
                    class="input-field"
                    [class.border-red-300]="
                      resetPasswordForm.get('confirmPassword')?.invalid &&
                      resetPasswordForm.get('confirmPassword')?.touched
                    "
                    placeholder="Confirm your new password"
                  />
                  @if (
                    resetPasswordForm.get('confirmPassword')?.invalid &&
                    resetPasswordForm.get('confirmPassword')?.touched
                  ) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                      Please confirm your password
                    </p>
                  }
                  @if (
                    resetPasswordForm.hasError('passwordMismatch') &&
                    resetPasswordForm.get('confirmPassword')?.touched
                  ) {
                    <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                      Passwords do not match
                    </p>
                  }
                </div>
              </div>

              <!-- Password Requirements -->
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <p class="mb-1">Password requirements:</p>
                <ul class="list-disc list-inside space-y-1">
                  <li>At least 8 characters long</li>
                  <li>Mix of uppercase and lowercase letters recommended</li>
                  <li>Include numbers and special characters for better security</li>
                </ul>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  [disabled]="resetPasswordForm.invalid || isLoading()"
                  class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  @if (isLoading()) {
                    <div
                      class="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    ></div>
                    Updating password...
                  } @else {
                    <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    Reset password
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
                  Password reset successful
                </h3>
                <p class="text-sm text-green-800 dark:text-green-200 mb-4">
                  Your password has been successfully updated. You are now logged in.
                </p>
                <button
                  (click)="goToHome()"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Go to homepage
                </button>
              </div>
            </div>
          }
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
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private payloadApi = inject(PayloadApiService);
  private seoService = inject(SeoService);

  resetPasswordForm!: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);
  error = signal<string | null>(null);
  passwordReset = signal(false);
  tokenValid = signal(true);

  private resetToken: string | null = null;

  ngOnInit() {
    this.initializeForm();
    this.setupSEO();
    this.validateToken();

    // Redirect if already logged in
    if (this.payloadApi.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  private initializeForm() {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'Reset Password',
      description: 'Set a new password for your account',
      noIndex: true,
    });
  }

  private validateToken() {
    this.resetToken = this.route.snapshot.queryParamMap.get('token');

    if (!this.resetToken) {
      this.tokenValid.set(false);
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.resetToken) {
      this.isLoading.set(true);
      this.error.set(null);

      const { password } = this.resetPasswordForm.value;

      this.payloadApi.resetPassword(this.resetToken, password).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.passwordReset.set(true);
        },
        error: (error) => {
          this.isLoading.set(false);
          if (error?.status === 400 || error?.status === 401) {
            this.tokenValid.set(false);
          } else {
            this.error.set(error?.error?.message || 'Unable to reset password. Please try again.');
          }
        },
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword.update((show) => !show);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
