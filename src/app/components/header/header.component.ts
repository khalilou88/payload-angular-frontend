import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PayloadApiService } from '../../services/payload-api.service';
import { Header, User } from '../../types/payload.types';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SearchModalComponent } from '../search-modal/search-modal.component';

@Component({
  selector: 'app-header',
  imports: [RouterModule, SearchModalComponent],
  template: `
    <header
      class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80"
    >
      <div class="container-custom">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <div
                class="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
              >
                <span class="text-white font-bold text-sm">P</span>
              </div>
              <span class="text-xl font-bold text-gray-900 dark:text-white">Payload</span>
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            @if (headerData(); as header) {
              @for (item of header.navItems; track item.link.label) {
                <a
                  [href]="getLinkUrl(item.link)"
                  [target]="item.link.newTab ? '_blank' : '_self'"
                  [rel]="item.link.newTab ? 'noopener noreferrer' : ''"
                  class="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
                >
                  {{ item.link.label }}
                </a>
              }
            }

            <a
              routerLink="/about"
              class="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              routerLink="/services"
              class="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
            >
              Services
            </a>
            <a
              routerLink="/blog"
              class="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
            >
              Blog
            </a>
            <a
              routerLink="/team"
              class="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
            >
              Team
            </a>
            <a
              routerLink="/careers"
              class="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
            >
              Careers
            </a>
            <a
              routerLink="/contact"
              class="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <button
              (click)="toggleTheme()"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              @if (isDarkMode()) {
                <svg
                  class="h-5 w-5 text-gray-600 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              } @else {
                <svg
                  class="h-5 w-5 text-gray-600 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              }
            </button>

            <!-- Search Button -->
            <button
              (click)="toggleSearch()"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <svg
                class="h-5 w-5 text-gray-600 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <!-- User Menu -->
            @if (currentUser(); as user) {
              <div class="relative" #userMenuTrigger>
                <button
                  (click)="toggleUserMenu()"
                  class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  @if (user.avatar) {
                    <img
                      [src]="user.avatar.url"
                      [alt]="user.name || 'Profile picture'"
                      class="h-8 w-8 rounded-full object-cover border-2 border-primary/20"
                    />
                  } @else {
                    <div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span class="text-white text-sm font-medium">
                        {{ getUserInitials(user) }}
                      </span>
                    </div>
                  }
                </button>

                @if (showUserMenu()) {
                  <div
                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                  >
                    <div
                      class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                    >
                      <p class="font-medium">{{ user.name || 'User' }}</p>
                      <p class="text-gray-500 dark:text-gray-400">{{ user.email }}</p>
                    </div>

                    <a
                      routerLink="/profile"
                      (click)="showUserMenu.set(false)"
                      class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg
                        class="inline-block mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Account Settings
                    </a>

                    <a
                      [href]="adminUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg
                        class="inline-block mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Admin Panel
                    </a>

                    <button
                      (click)="logout()"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg
                        class="inline-block mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </button>
                  </div>
                }
              </div>
            } @else {
              <a routerLink="/login" class="btn-primary text-sm"> Sign in </a>
            }

            <!-- Mobile Menu Button -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              @if (showMobileMenu()) {
                <svg
                  class="h-6 w-6 text-gray-600 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              } @else {
                <svg
                  class="h-6 w-6 text-gray-600 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              }
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        @if (showMobileMenu()) {
          <div class="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <nav class="flex flex-col space-y-4">
              @if (headerData(); as header) {
                @for (item of header.navItems; track item.link.label) {
                  <a
                    [href]="getLinkUrl(item.link)"
                    [target]="item.link.newTab ? '_blank' : '_self'"
                    [rel]="item.link.newTab ? 'noopener noreferrer' : ''"
                    class="text-base font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
                    (click)="closeMobileMenu()"
                  >
                    {{ item.link.label }}
                  </a>
                }
              }

              <a
                routerLink="/blog"
                class="text-base font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
                (click)="closeMobileMenu()"
              >
                Blog
              </a>

              @if (!currentUser()) {
                <a
                  routerLink="/login"
                  class="btn-primary inline-block text-center mt-4"
                  (click)="closeMobileMenu()"
                >
                  Sign in
                </a>
              }
            </nav>
          </div>
        }
      </div>

      <!-- Search Modal -->
      @if (showSearch()) {
        <div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" (click)="closeSearch()">
          <div class="container-custom pt-20" (click)="$event.stopPropagation()">
            <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl">
              <app-search-modal (close)="closeSearch()" />
            </div>
          </div>
        </div>
      }
    </header>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  private payloadApi = inject(PayloadApiService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  headerData = signal<Header | null>(null);
  currentUser = signal<User | null>(null);
  showMobileMenu = signal(false);
  showUserMenu = signal(false);
  showSearch = signal(false);
  isDarkMode = signal(false);

  protected readonly adminUrl = environment.adminUrl;

  ngOnInit() {
    this.loadHeaderData();
    this.loadCurrentUser();
    this.loadThemePreference();

    // Close menus when clicking outside
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (
          !target.closest('[data-user-menu]') &&
          !target.closest('button[aria-label="Toggle user menu"]')
        ) {
          this.showUserMenu.set(false);
        }
      });
    }
  }

  private loadHeaderData() {
    this.payloadApi.getHeader().subscribe({
      next: (header) => this.headerData.set(header),
      error: (error) => console.error('Failed to load header data:', error),
    });
  }

  private loadCurrentUser() {
    this.payloadApi.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
    });
  }

  private loadThemePreference() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        this.isDarkMode.set(true);
        document.documentElement.classList.add('dark');
      } else {
        this.isDarkMode.set(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }

  getLinkUrl(link: any): string {
    if (link.type === 'custom') {
      return link.url || '#';
    }

    if (link.type === 'reference' && link.reference) {
      const doc = link.reference.value;
      if (typeof doc === 'object' && doc.slug) {
        return link.reference.relationTo === 'posts' ? `/blog/${doc.slug}` : `/${doc.slug}`;
      }
    }

    return '#';
  }

  getUserInitials(user: User): string {
    if (user.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email[0].toUpperCase();
  }

  toggleMobileMenu() {
    this.showMobileMenu.update((show) => !show);
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }

  toggleUserMenu() {
    this.showUserMenu.update((show) => !show);
  }

  toggleSearch() {
    this.showSearch.update((show) => !show);
  }

  closeSearch() {
    this.showSearch.set(false);
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const newTheme = !this.isDarkMode();
      this.isDarkMode.set(newTheme);

      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }

  logout() {
    this.payloadApi.logout().subscribe({
      next: () => {
        this.showUserMenu.set(false);
        this.router.navigate(['/']);
      },
      error: (error) => console.error('Logout failed:', error),
    });
  }
}
