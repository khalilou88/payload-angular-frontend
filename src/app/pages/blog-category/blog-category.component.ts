import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PayloadApiService } from '../../services/payload-api.service';
import { Category, Post } from '../../types/payload.types';

@Component({
  selector: 'app-blog-category',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div class="container-custom">
        @if (category(); as cat) {
          <div class="max-w-4xl mx-auto mb-12">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {{ cat.title }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">Posts in {{ cat.title }} category</p>
          </div>
        }

        @if (posts().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (post of posts(); track post.id) {
              <article class="card p-6">
                <h2 class="text-xl font-semibold mb-3">
                  <a
                    [routerLink]="['/blog', post.slug]"
                    class="text-gray-900 dark:text-white hover:text-primary"
                  >
                    {{ post.title }}
                  </a>
                </h2>
                @if (post.publishedAt) {
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(post.publishedAt) }}
                  </p>
                }
              </article>
            }
          </div>
        }
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCategoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private payloadApi = inject(PayloadApiService);

  category = signal<Category | null>(null);
  posts = signal<Post[]>([]);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      this.loadCategory(slug);
      this.loadCategoryPosts(slug);
    });
  }

  private loadCategory(slug: string) {
    this.payloadApi.getCategoryBySlug(slug).subscribe({
      next: (category) => this.category.set(category),
      error: (error) => console.error('Failed to load category:', error),
    });
  }

  private loadCategoryPosts(slug: string) {
    // Implementation would filter posts by category
    this.payloadApi.getPosts().subscribe({
      next: (response) => this.posts.set(response.docs),
      error: (error) => console.error('Failed to load posts:', error),
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
