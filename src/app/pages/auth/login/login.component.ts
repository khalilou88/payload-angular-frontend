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
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
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
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or
            <a
              routerLink="/register"
              class="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              create a new account
            </a>
          </p>
        </div>

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
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
                  loginForm.get('email')?.invalid && loginForm.get('email')?.touched
                "
                placeholder="Enter your email"
              />
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Please enter a valid email address
                </p>
              }
            </div>

            <!-- Password Field -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  required
                  class="input-field pr-10"
                  [class.border-red-300]="
                    loginForm.get('password')?.invalid && loginForm.get('password')?.touched
                  "
                  placeholder="Enter your password"
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
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">Password is required</p>
              }
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                formControlName="rememberMe"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary hover:text-primary/80 transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading()"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              @if (isLoading()) {
                <div
                  class="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                ></div>
                Signing in...
              } @else {
                <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign in
              }
            </button>
          </div>
        </form>

        <!-- Admin Panel Link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Need admin access?</p>
          <a
            [href]="adminUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open Admin Panel
          </a>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private payloadApi = inject(PayloadApiService);
  private seoService = inject(SeoService);

  loginForm!: FormGroup;
  isLoading = signal(false);
  showPassword = signal(false);
  error = signal<string | null>(null);

  protected readonly adminUrl = environment.adminUrl;

  ngOnInit() {
    this.initializeForm();
    this.setupSEO();

    // Redirect if already logged in
    if (this.payloadApi.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  private initializeForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'Sign In',
      description: 'Sign in to your account to access admin features',
      noIndex: true,
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      const { email, password } = this.loginForm.value;

      this.payloadApi.login(email, password).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.error.set(error?.error?.message || 'Invalid email or password. Please try again.');
        },
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword.update((show) => !show);
  }
}
