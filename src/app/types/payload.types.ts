export interface Media {
  id: string;
  alt?: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  focalX?: number;
  focalY?: number;
  sizes?: {
    thumbnail?: MediaSize;
    card?: MediaSize;
    feature?: MediaSize;
  };
}

export interface MediaSize {
  url: string;
  width: number;
  height: number;
  filename: string;
  mimeType: string;
  filesize: number;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: Media;
  roles?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  parent?: Category;
  breadcrumbs?: Array<{
    doc: Category;
    url: string;
    label: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string;
  image?: Media;
  noIndex?: boolean;
}

export interface LayoutBlock {
  blockType: 'hero' | 'content' | 'mediaBlock' | 'cta' | 'archive';
  id: string;
}

export interface HeroBlock extends LayoutBlock {
  blockType: 'hero';
  type?: 'default' | 'minimal' | 'fullscreen';
  richText?: any; // Lexical JSON
  media?: Media;
  links?: Array<{
    link: {
      type: 'reference' | 'custom';
      reference?: {
        relationTo: string;
        value: string | Page | Post;
      };
      url?: string;
      label: string;
      appearance?: 'primary' | 'secondary' | 'outline';
      newTab?: boolean;
    };
  }>;
}

export interface ContentBlock extends LayoutBlock {
  blockType: 'content';
  columns?: Array<{
    size?: 'oneThird' | 'half' | 'twoThirds' | 'full';
    richText?: any; // Lexical JSON
    enableLink?: boolean;
    link?: {
      type: 'reference' | 'custom';
      reference?: {
        relationTo: string;
        value: string | Page | Post;
      };
      url?: string;
      label: string;
      newTab?: boolean;
    };
  }>;
}

export interface MediaBlock extends LayoutBlock {
  blockType: 'mediaBlock';
  position?: 'default' | 'fullscreen';
  media: Media;
  caption?: any; // Lexical JSON
}

export interface CallToActionBlock extends LayoutBlock {
  blockType: 'cta';
  richText?: any; // Lexical JSON
  links?: Array<{
    link: {
      type: 'reference' | 'custom';
      reference?: {
        relationTo: string;
        value: string | Page | Post;
      };
      url?: string;
      label: string;
      appearance?: 'primary' | 'secondary' | 'outline';
      newTab?: boolean;
    };
  }>;
}

export interface ArchiveBlock extends LayoutBlock {
  blockType: 'archive';
  relationTo: 'posts';
  populateBy?: 'collection' | 'selection';
  limit?: number;
  selectedDocs?: Post[];
  categories?: Category[];
  populatedDocs?: Post[];
  populatedDocsTotal?: number;
}

export type LayoutBlocks = HeroBlock | ContentBlock | MediaBlock | CallToActionBlock | ArchiveBlock;

export interface Page {
  id: string;
  title: string;
  slug: string;
  meta?: SEO;
  hero?: HeroBlock;
  layout?: LayoutBlocks[];
  publishedAt?: string;
  _status?: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  meta?: SEO;
  hero?: HeroBlock;
  layout?: LayoutBlocks[];
  categories?: Category[];
  publishedAt?: string;
  authors?: User[];
  populatedAuthors?: User[];
  relatedPosts?: Post[];
  _status?: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface Header {
  navItems?: Array<{
    link: {
      type: 'reference' | 'custom';
      reference?: {
        relationTo: string;
        value: string | Page;
      };
      url?: string;
      label: string;
      newTab?: boolean;
    };
  }>;
}

export interface Footer {
  copyright?: string;
  navItems?: Array<{
    link: {
      type: 'reference' | 'custom';
      reference?: {
        relationTo: string;
        value: string | Page;
      };
      url?: string;
      label: string;
      newTab?: boolean;
    };
  }>;
}

export interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number;
  nextPage?: number;
}

export interface PayloadError {
  errors: Array<{
    message: string;
    field?: string;
  }>;
}

export interface SearchResult {
  doc: Page | Post;
  relationTo: 'pages' | 'posts';
}

export interface AuthResponse {
  message?: string;
  user?: User;
  token?: string;
  exp?: number;
}
