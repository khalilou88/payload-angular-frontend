# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project Overview

This is an Angular 20 frontend application that integrates with a Payload CMS backend. It's configured as a modern standalone component-based application with SSR support, zoneless change detection, and uses Tailwind CSS for styling.

### Key Architecture Decisions

- **Standalone Components**: All components use the standalone API, not NgModules
- **Zoneless Change Detection**: Uses `provideZonelessChangeDetection()` instead of Zone.js
- **SSR with Hydration**: Configured with server-side rendering and client hydration with event replay
- **Signal-based State**: Uses Angular signals for reactive state management
- **Block-based Content**: Implements a block-based content system with layout renderers for CMS content

## Development Commands

- **Development server**: `ng serve` or `pnpm start` - starts dev server on http://localhost:4200
- **Build**: `ng build` - builds the application for production
- **Build (dev)**: `ng build --configuration development` - development build
- **Watch**: `ng build --watch --configuration development` - build and watch for changes
- **Tests**: `ng test` - runs unit tests with Karma
- **SSR serve**: `pnpm serve:ssr:payload-angular-frontend` - serves the SSR build
- **Package manager**: This project uses **pnpm** (configured in angular.json)
- **Code formatting**: Prettier is configured with Husky pre-commit hooks

## Code Architecture

### Core Services

- **PayloadApiService**: Central service for all Payload CMS API interactions, handles authentication, CRUD operations for pages/posts/media, and search functionality
- **SeoService**: Manages meta tags and SEO for pages and posts
- **LexicalRendererService**: Renders Lexical rich text content from Payload CMS

### Content Management

- **Block System**: Uses a flexible block-based content system with these block types:
  - `HeroBlock`: Hero sections with media, rich text, and CTAs
  - `ContentBlock`: Multi-column content blocks with optional links
  - `MediaBlock`: Full-width or contained media display
  - `CallToActionBlock`: Action-oriented blocks with buttons/links
  - `ArchiveBlock`: Displays collections of posts with filtering
- **Layout Renderer**: `LayoutRendererComponent` dynamically renders blocks based on CMS data
- **Rich Text**: Uses Lexical editor format from Payload CMS

### Routing Structure

- **Pages**: Dynamic page routing via slug (`/[slug]`)
- **Blog**: Blog post routing (`/blog/[slug]`) and category pages (`/blog/category/[slug]`)
- **Auth**: Login and registration pages (`/login`, `/register`)
- **Static Pages**: Terms and privacy pages
- **Search**: Dedicated search functionality with modal
- **Preview System**: Draft preview support for authenticated users

### Authentication & Security

- Uses JWT tokens stored in localStorage
- Auth interceptor automatically adds authorization headers
- Error interceptor handles API errors globally
- Auth guard protects authenticated routes
- Current user state managed via BehaviorSubject in PayloadApiService

### Environment Configuration

- **Development**: API at `http://localhost:3000/api`, site at `http://localhost:4200`
- **Environment file**: `src/environments/environment.ts` contains API URLs and feature flags
- **API Configuration**: Centralized API configuration in `src/app/config/api.config.ts`

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
