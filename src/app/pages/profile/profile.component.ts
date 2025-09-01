import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
  computed,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PayloadApiService } from '../../services/payload-api.service';
import { SeoService } from '../../services/seo.service';
import { User } from '../../types/payload.types';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterModule, DateFormatPipe],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        @if (currentUser()) {
          <div class="space-y-6">
            <!-- Profile Information Card -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                  Profile Information
                </h2>
              </div>

              <div class="px-6 py-6">
                <div class="flex items-center space-x-6 mb-6">
                  <!-- Profile Avatar -->
                  <div class="flex-shrink-0">
                    <div
                      class="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                    >
                      @if (currentUser()?.avatar) {
                        <img
                          [src]="currentUser()!.avatar?.url"
                          [alt]="currentUser()!.name || 'Profile picture'"
                          class="h-20 w-20 rounded-full object-cover"
                        />
                      } @else {
                        <span class="text-white font-bold text-2xl">
                          {{ getInitials(currentUser()!.name || currentUser()!.email) }}
                        </span>
                      }
                    </div>
                  </div>

                  <!-- Upload Avatar Button -->
                  <div>
                    <label
                      for="avatar-upload"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                    >
                      <svg
                        class="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Change Avatar
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      (change)="onAvatarUpload($event)"
                      class="hidden"
                    />
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                <!-- Profile Form -->
                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                  @if (profileError()) {
                    <div
                      class="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4"
                    >
                      <p class="text-sm text-red-800 dark:text-red-200">{{ profileError() }}</p>
                    </div>
                  }

                  @if (profileSuccess()) {
                    <div
                      class="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4"
                    >
                      <p class="text-sm text-green-800 dark:text-green-200">
                        Profile updated successfully!
                      </p>
                    </div>
                  }

                  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <!-- Name Field -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        formControlName="name"
                        class="input-field"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <!-- Email Field -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        formControlName="email"
                        class="input-field"
                        placeholder="Enter your email"
                      />
                      @if (profileForm.get('email')?.invalid && profileForm.get('email')?.touched) {
                        <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                          Please enter a valid email address
                        </p>
                      }
                    </div>
                  </div>

                  <!-- Save Button -->
                  <div class="mt-6 flex justify-end">
                    <button
                      type="submit"
                      [disabled]="profileForm.invalid || isUpdatingProfile()"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      @if (isUpdatingProfile()) {
                        <div
                          class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        ></div>
                        Saving...
                      } @else {
                        Save Changes
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Change Password Card -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">Change Password</h2>
              </div>

              <div class="px-6 py-6">
                <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                  @if (passwordError()) {
                    <div
                      class="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4"
                    >
                      <p class="text-sm text-red-800 dark:text-red-200">{{ passwordError() }}</p>
                    </div>
                  }

                  @if (passwordSuccess()) {
                    <div
                      class="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4"
                    >
                      <p class="text-sm text-green-800 dark:text-green-200">
                        Password changed successfully!
                      </p>
                    </div>
                  }

                  <div class="space-y-4">
                    <!-- Current Password -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        formControlName="currentPassword"
                        class="input-field"
                        placeholder="Enter your current password"
                      />
                    </div>

                    <!-- New Password -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        formControlName="newPassword"
                        class="input-field"
                        placeholder="Enter your new password"
                      />
                      @if (
                        passwordForm.get('newPassword')?.invalid &&
                        passwordForm.get('newPassword')?.touched
                      ) {
                        <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                          Password must be at least 8 characters long
                        </p>
                      }
                    </div>

                    <!-- Confirm New Password -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        formControlName="confirmNewPassword"
                        class="input-field"
                        placeholder="Confirm your new password"
                      />
                      @if (
                        passwordForm.hasError('passwordMismatch') &&
                        passwordForm.get('confirmNewPassword')?.touched
                      ) {
                        <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                          Passwords do not match
                        </p>
                      }
                    </div>
                  </div>

                  <!-- Change Password Button -->
                  <div class="mt-6 flex justify-end">
                    <button
                      type="submit"
                      [disabled]="passwordForm.invalid || isChangingPassword()"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      @if (isChangingPassword()) {
                        <div
                          class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        ></div>
                        Changing...
                      } @else {
                        Change Password
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Account Information Card -->
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">
                  Account Information
                </h2>
              </div>

              <div class="px-6 py-6">
                <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Account ID</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                      {{ currentUser()!.id }}
                    </dd>
                  </div>

                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Member Since
                    </dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ currentUser()!.createdAt | dateFormat: 'long' }}
                    </dd>
                  </div>

                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Updated
                    </dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ currentUser()!.updatedAt | dateFormat: 'long' }}
                    </dd>
                  </div>

                  @if (currentUser()!.roles && currentUser()!.roles!.length > 0) {
                    <div>
                      <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Roles</dt>
                      <dd class="mt-1">
                        <div class="flex flex-wrap gap-2">
                          @for (role of currentUser()!.roles; track role) {
                            <span
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                            >
                              {{ role }}
                            </span>
                          }
                        </div>
                      </dd>
                    </div>
                  }
                </dl>
              </div>
            </div>

            <!-- Danger Zone -->
            <div
              class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border-l-4 border-red-500"
            >
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-medium text-red-600 dark:text-red-400">Danger Zone</h2>
              </div>

              <div class="px-6 py-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                      Logout from all devices
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      This will log you out from all devices and invalidate all active sessions.
                    </p>
                  </div>
                  <button
                    type="button"
                    (click)="logoutAllDevices()"
                    class="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600 text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Logout All
                  </button>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <!-- Loading State -->
          <div class="flex items-center justify-center min-h-96">
            <div
              class="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
            ></div>
          </div>
        }
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private payloadApi = inject(PayloadApiService);
  private seoService = inject(SeoService);

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  currentUser = computed(() => this.payloadApi.getCurrentUser());

  isUpdatingProfile = signal(false);
  isChangingPassword = signal(false);
  isUploadingAvatar = signal(false);

  profileError = signal<string | null>(null);
  profileSuccess = signal(false);
  passwordError = signal<string | null>(null);
  passwordSuccess = signal(false);

  ngOnInit() {
    if (!this.payloadApi.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.initializeForms();
    this.setupSEO();
  }

  private initializeForms() {
    const user = this.currentUser();

    this.profileForm = this.fb.group({
      name: [user?.name || '', [Validators.required]],
      email: [user?.email || '', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmNewPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmNewPassword = form.get('confirmNewPassword');

    if (newPassword && confirmNewPassword && newPassword.value !== confirmNewPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private setupSEO() {
    this.seoService.updateSEO({
      title: 'Account Settings',
      description: 'Manage your account information and preferences',
      noIndex: true,
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.isUpdatingProfile.set(true);
      this.profileError.set(null);
      this.profileSuccess.set(false);

      const formData = this.profileForm.value;

      this.payloadApi.updateProfile(formData).subscribe({
        next: () => {
          this.isUpdatingProfile.set(false);
          this.profileSuccess.set(true);
          // Clear success message after 3 seconds
          setTimeout(() => this.profileSuccess.set(false), 3000);
        },
        error: (error) => {
          this.isUpdatingProfile.set(false);
          this.profileError.set(error?.error?.message || 'Failed to update profile');
        },
      });
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.isChangingPassword.set(true);
      this.passwordError.set(null);
      this.passwordSuccess.set(false);

      const { currentPassword, newPassword } = this.passwordForm.value;

      this.payloadApi.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.isChangingPassword.set(false);
          this.passwordSuccess.set(true);
          this.passwordForm.reset();
          // Clear success message after 3 seconds
          setTimeout(() => this.passwordSuccess.set(false), 3000);
        },
        error: (error) => {
          this.isChangingPassword.set(false);
          this.passwordError.set(error?.error?.message || 'Failed to change password');
        },
      });
    }
  }

  onAvatarUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.isUploadingAvatar.set(true);

      this.payloadApi.uploadFile(file, 'Profile avatar').subscribe({
        next: (media) => {
          // Update user avatar
          this.payloadApi.updateProfile({ avatar: media }).subscribe({
            next: () => {
              this.isUploadingAvatar.set(false);
            },
            error: (error) => {
              this.isUploadingAvatar.set(false);
              this.profileError.set('Failed to update avatar');
            },
          });
        },
        error: (error) => {
          this.isUploadingAvatar.set(false);
          this.profileError.set('Failed to upload avatar');
        },
      });
    }
  }

  logoutAllDevices() {
    if (confirm('Are you sure you want to logout from all devices?')) {
      this.payloadApi.logout().subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: () => {
          // Force logout even if API call fails
          this.router.navigate(['/login']);
        },
      });
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
