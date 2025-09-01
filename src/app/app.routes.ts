import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PayloadApiService } from './services/payload-api.service';

export const routes: Routes = [
  // Home page
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: { preload: true },
  },

  // Blog routes
  {
    path: 'blog',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/blog/blog.component').then((m) => m.BlogComponent),
        data: { preload: true },
      },
      {
        path: 'category/:slug',
        loadComponent: () =>
          import('./pages/blog-category/blog-category.component').then(
            (m) => m.BlogCategoryComponent,
          ),
      },
      {
        path: ':slug',
        loadComponent: () =>
          import('./pages/blog-post/blog-post.component').then((m) => m.BlogPostComponent),
      },
    ],
  },

  // Auth routes
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },

  // Profile route
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [
      () => inject(PayloadApiService).isAuthenticated() || inject(Router).navigate(['/login']),
    ],
  },

  // Preview routes
  {
    path: 'preview',
    children: [
      {
        path: 'pages/:id',
        loadComponent: () =>
          import('./pages/preview-page/preview-page.component').then((m) => m.PreviewPageComponent),
      },
      {
        path: 'posts/:id',
        loadComponent: () =>
          import('./pages/preview-post/preview-post.component').then((m) => m.PreviewPostComponent),
      },
    ],
  },

  // Search route
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search.component').then((m) => m.SearchComponent),
  },

  // Static pages
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/static/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/static/services/services.component').then((m) => m.ServicesComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/static/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/static/faq/faq.component').then((m) => m.FAQComponent),
  },
  {
    path: 'team',
    loadComponent: () => import('./pages/static/team/team.component').then((m) => m.TeamComponent),
  },
  {
    path: 'careers',
    loadComponent: () =>
      import('./pages/static/careers/careers.component').then((m) => m.CareersComponent),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/static/privacy/privacy.component').then((m) => m.PrivacyComponent),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./pages/static/terms/terms.component').then((m) => m.TermsComponent),
  },

  // Error pages
  {
    path: 'error',
    loadComponent: () =>
      import('./pages/error/generic-error/generic-error.component').then(
        (m) => m.GenericErrorComponent,
      ),
  },
  {
    path: '500',
    loadComponent: () =>
      import('./pages/error/server-error/server-error.component').then(
        (m) => m.ServerErrorComponent,
      ),
  },
  {
    path: 'offline',
    loadComponent: () =>
      import('./pages/error/offline/offline.component').then((m) => m.OfflineComponent),
  },

  // Dynamic page routes (must be last)
  {
    path: ':slug',
    loadComponent: () => import('./pages/page/page.component').then((m) => m.PageComponent),
  },

  // 404 Not Found
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
