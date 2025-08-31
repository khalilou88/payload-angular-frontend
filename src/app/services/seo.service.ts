import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { SEO, Page, Post, Media } from '../types/payload.types';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private platformId = inject(PLATFORM_ID);

  private readonly defaultTitle = 'My Payload Website';
  private readonly defaultDescription = 'A modern website built with Payload CMS and Angular';
  private readonly defaultImage = '/assets/images/og-default.jpg';
  private readonly siteUrl = 'https://yourdomain.com';

  updateSEO(data: {
    title?: string;
    description?: string;
    image?: Media | string;
    url?: string;
    type?: 'website' | 'article';
    keywords?: string;
    noIndex?: boolean;
    publishedAt?: string;
    modifiedAt?: string;
    author?: string;
  }) {
    if (!isPlatformBrowser(this.platformId)) return;

    // Set page title
    const title = data.title ? `${data.title} | ${this.defaultTitle}` : this.defaultTitle;
    this.titleService.setTitle(title);

    // Set meta description
    const description = data.description || this.defaultDescription;
    this.metaService.updateTag({ name: 'description', content: description });

    // Set keywords
    if (data.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Set robots meta
    if (data.noIndex) {
      this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
    }

    // Set canonical URL
    if (data.url) {
      this.updateCanonicalUrl(data.url);
    }

    // Set Open Graph tags
    this.setOpenGraphTags({
      title: data.title || this.defaultTitle,
      description,
      image: data.image,
      url: data.url,
      type: data.type || 'website',
    });

    // Set Twitter Card tags
    this.setTwitterCardTags({
      title: data.title || this.defaultTitle,
      description,
      image: data.image,
    });

    // Set article-specific tags
    if (data.type === 'article') {
      this.setArticleTags({
        publishedAt: data.publishedAt,
        modifiedAt: data.modifiedAt,
        author: data.author,
      });
    }

    // Set structured data
    this.setStructuredData({
      title: data.title || this.defaultTitle,
      description,
      image: data.image,
      url: data.url,
      type: data.type || 'website',
      publishedAt: data.publishedAt,
      modifiedAt: data.modifiedAt,
      author: data.author,
    });
  }

  updateSEOFromPage(page: Page, currentUrl?: string) {
    const seo = page.meta || {};
    const heroText = this.extractTextFromLexical(page.hero?.richText);

    this.updateSEO({
      title: seo.title || page.title,
      description: seo.description || heroText,
      image: seo.image || page.hero?.media,
      keywords: seo.keywords,
      noIndex: seo.noIndex,
      url: currentUrl || `${this.siteUrl}/${page.slug}`,
      type: 'website',
    });
  }

  updateSEOFromPost(post: Post, currentUrl?: string) {
    const seo = post.meta || {};
    const heroText = this.extractTextFromLexical(post.hero?.richText);

    this.updateSEO({
      title: seo.title || post.title,
      description: seo.description || heroText,
      image: seo.image || post.hero?.media,
      keywords: seo.keywords,
      noIndex: seo.noIndex,
      url: currentUrl || `${this.siteUrl}/blog/${post.slug}`,
      type: 'article',
      publishedAt: post.publishedAt,
      modifiedAt: post.updatedAt,
      author: post.populatedAuthors?.[0]?.name,
    });
  }

  private setOpenGraphTags(data: {
    title: string;
    description: string;
    image?: Media | string;
    url?: string;
    type: string;
  }) {
    this.metaService.updateTag({ property: 'og:title', content: data.title });
    this.metaService.updateTag({ property: 'og:description', content: data.description });
    this.metaService.updateTag({ property: 'og:type', content: data.type });

    if (data.url) {
      this.metaService.updateTag({ property: 'og:url', content: data.url });
    }

    const imageUrl = this.getImageUrl(data.image);
    this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    this.metaService.updateTag({ property: 'og:image:alt', content: this.getImageAlt(data.image) });

    if (typeof data.image === 'object' && data.image?.width && data.image?.height) {
      this.metaService.updateTag({
        property: 'og:image:width',
        content: data.image.width.toString(),
      });
      this.metaService.updateTag({
        property: 'og:image:height',
        content: data.image.height.toString(),
      });
    }
  }

  private setTwitterCardTags(data: { title: string; description: string; image?: Media | string }) {
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: data.title });
    this.metaService.updateTag({ name: 'twitter:description', content: data.description });

    const imageUrl = this.getImageUrl(data.image);
    this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
    this.metaService.updateTag({
      name: 'twitter:image:alt',
      content: this.getImageAlt(data.image),
    });
  }

  private setArticleTags(data: { publishedAt?: string; modifiedAt?: string; author?: string }) {
    if (data.publishedAt) {
      this.metaService.updateTag({
        property: 'article:published_time',
        content: new Date(data.publishedAt).toISOString(),
      });
    }

    if (data.modifiedAt) {
      this.metaService.updateTag({
        property: 'article:modified_time',
        content: new Date(data.modifiedAt).toISOString(),
      });
    }

    if (data.author) {
      this.metaService.updateTag({ property: 'article:author', content: data.author });
    }
  }

  private setStructuredData(data: {
    title: string;
    description: string;
    image?: Media | string;
    url?: string;
    type: string;
    publishedAt?: string;
    modifiedAt?: string;
    author?: string;
  }) {
    let structuredData: any;

    if (data.type === 'article') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: this.getImageUrl(data.image),
        url: data.url,
        datePublished: data.publishedAt,
        dateModified: data.modifiedAt || data.publishedAt,
        author: data.author
          ? {
              '@type': 'Person',
              name: data.author,
            }
          : undefined,
      };
    } else {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data.title,
        description: data.description,
        url: data.url || this.siteUrl,
        image: this.getImageUrl(data.image),
      };
    }

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  private updateCanonicalUrl(url: string) {
    // Remove existing canonical link
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }

  private getImageUrl(image?: Media | string): string {
    if (typeof image === 'string') {
      return image.startsWith('http') ? image : `${this.siteUrl}${image}`;
    }

    if (image?.url) {
      return image.url.startsWith('http') ? image.url : `${this.siteUrl}${image.url}`;
    }

    return `${this.siteUrl}${this.defaultImage}`;
  }

  private getImageAlt(image?: Media | string): string {
    if (typeof image === 'object' && image?.alt) {
      return image.alt;
    }

    return 'Page image';
  }

  private extractTextFromLexical(lexicalData?: any): string {
    if (!lexicalData || !lexicalData.root || !lexicalData.root.children) {
      return '';
    }

    const extractText = (node: any): string => {
      if (node.type === 'text') {
        return node.text || '';
      }

      if (node.children && Array.isArray(node.children)) {
        return node.children.map(extractText).join(' ');
      }

      return '';
    };

    const text = lexicalData.root.children.map(extractText).join(' ').trim();
    return text.length > 160 ? text.substring(0, 160) + '...' : text;
  }

  clearSEO() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.titleService.setTitle(this.defaultTitle);
    this.metaService.updateTag({ name: 'description', content: this.defaultDescription });
    this.metaService.removeTag('name="keywords"');
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });

    // Clear Open Graph tags
    this.metaService.removeTag('property="og:title"');
    this.metaService.removeTag('property="og:description"');
    this.metaService.removeTag('property="og:type"');
    this.metaService.removeTag('property="og:url"');
    this.metaService.removeTag('property="og:image"');
    this.metaService.removeTag('property="og:image:alt"');
    this.metaService.removeTag('property="og:image:width"');
    this.metaService.removeTag('property="og:image:height"');

    // Clear Twitter Card tags
    this.metaService.removeTag('name="twitter:card"');
    this.metaService.removeTag('name="twitter:title"');
    this.metaService.removeTag('name="twitter:description"');
    this.metaService.removeTag('name="twitter:image"');
    this.metaService.removeTag('name="twitter:image:alt"');

    // Clear article tags
    this.metaService.removeTag('property="article:published_time"');
    this.metaService.removeTag('property="article:modified_time"');
    this.metaService.removeTag('property="article:author"');

    // Clear structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Clear canonical URL
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }
  }
}
