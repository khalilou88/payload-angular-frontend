import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PayloadApiService } from '../../../services/payload-api.service';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Create your account</h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or
            <a routerLink="/login" class="font-medium text-primary hover:text-primary/80"
              >sign in to existing account</a
            >
          </p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          @if (error()) {
            <div class="bg-red-50 border border-red-200 rounded-md p-4">
              <p class="text-sm text-red-800">{{ error() }}</p>
            </div>
          }

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Name</label
              >
              <input
                formControlName="name"
                type="text"
                class="input-field"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Email</label
              >
              <input
                formControlName="email"
                type="email"
                class="input-field"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >Password</label
              >
              <input
                formControlName="password"
                type="password"
                class="input-field"
                placeholder="Create a strong password"
              />
            </div>
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading()"
            class="btn-primary w-full"
          >
            @if (isLoading()) {
              Creating Account...
            } @else {
              Create Account
            }
          </button>
        </form>
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private payloadApi = inject(PayloadApiService);
  private seoService = inject(SeoService);

  registerForm!: FormGroup;
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.seoService.updateSEO({
      title: 'Create Account',
      description: 'Create a new account to access admin features',
      noIndex: true,
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.payloadApi.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set(error?.error?.message || 'Registration failed');
          this.isLoading.set(false);
        },
      });
    }
  }
}
