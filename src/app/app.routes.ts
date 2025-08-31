import { Routes } from '@angular/router';

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
    path: 'privacy',
    loadComponent: () =>
      import('./pages/static/privacy/privacy.component').then((m) => m.PrivacyComponent),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./pages/static/terms/terms.component').then((m) => m.TermsComponent),
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
