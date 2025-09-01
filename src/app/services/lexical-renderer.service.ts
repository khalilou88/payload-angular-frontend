import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface LexicalNode {
  type: string;
  version?: number;
  [key: string]: any;
}

interface TextNode extends LexicalNode {
  type: 'text';
  text: string;
  format?: number;
  style?: string;
  mode?: string;
  detail?: number;
}

interface ElementNode extends LexicalNode {
  type: 'paragraph' | 'heading' | 'list' | 'listitem' | 'quote' | 'code' | 'link';
  children: LexicalNode[];
  tag?: string;
  direction?: string;
  format?: string | number;
  indent?: number;
  version?: number;
}

interface LinkNode extends ElementNode {
  type: 'link';
  url: string;
  rel?: string;
  target?: string;
}

interface ListNode extends ElementNode {
  type: 'list';
  listType: 'bullet' | 'number' | 'check';
  start?: number;
}

interface HeadingNode extends ElementNode {
  type: 'heading';
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

interface RootNode extends LexicalNode {
  type: 'root';
  children: LexicalNode[];
  direction: string;
  format: string;
  indent: number;
  version: number;
}

@Injectable({
  providedIn: 'root',
})
export class LexicalRendererService {
  constructor(private sanitizer: DomSanitizer) {}

  render(lexicalData: any): SafeHtml {
    if (!lexicalData || !lexicalData.root) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }

    const html = this.renderNode(lexicalData.root);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private renderNode(node: LexicalNode): string {
    switch (node.type) {
      case 'root':
        return this.renderRootNode(node as RootNode);
      case 'paragraph':
        return this.renderParagraphNode(node as ElementNode);
      case 'heading':
        return this.renderHeadingNode(node as HeadingNode);
      case 'list':
        return this.renderListNode(node as ListNode);
      case 'listitem':
        return this.renderListItemNode(node as ElementNode);
      case 'quote':
        return this.renderQuoteNode(node as ElementNode);
      case 'code':
        return this.renderCodeNode(node as ElementNode);
      case 'link':
        return this.renderLinkNode(node as LinkNode);
      case 'text':
        return this.renderTextNode(node as TextNode);
      default:
        console.warn('Unknown Lexical node type:', node.type);
        return '';
    }
  }

  private renderRootNode(node: RootNode): string {
    return node.children.map((child) => this.renderNode(child)).join('');
  }

  private renderParagraphNode(node: ElementNode): string {
    const content = node.children.map((child) => this.renderNode(child)).join('');
    const className = this.getAlignmentClass(node.format);

    if (!content.trim()) {
      return '<p><br></p>';
    }

    return `<p${className ? ` class="${className}"` : ''}>${content}</p>`;
  }

  private renderHeadingNode(node: HeadingNode): string {
    const content = node.children.map((child) => this.renderNode(child)).join('');
    const className = this.getAlignmentClass(node.format);
    const tag = node.tag || 'h1';

    return `<${tag}${className ? ` class="${className}"` : ''}>${content}</${tag}>`;
  }

  private renderListNode(node: ListNode): string {
    const content = node.children.map((child) => this.renderNode(child)).join('');
    const tag = node.listType === 'number' ? 'ol' : 'ul';
    const className = node.listType === 'check' ? 'checklist' : '';
    const startAttr = node.listType === 'number' && node.start ? ` start="${node.start}"` : '';

    return `<${tag}${className ? ` class="${className}"` : ''}${startAttr}>${content}</${tag}>`;
  }

  private renderListItemNode(node: ElementNode): string {
    const content = node.children.map((child) => this.renderNode(child)).join('');
    return `<li>${content}</li>`;
  }

  private renderQuoteNode(node: ElementNode): string {
    const content = node.children.map((child) => this.renderNode(child)).join('');
    const className = this.getAlignmentClass(node.format);

    return `<blockquote${className ? ` class="${className}"` : ''}>${content}</blockquote>`;
  }

  private renderCodeNode(node: ElementNode): string {
    const content = node.children.map((child) => this.renderNode(child)).join('');

    return `<pre><code>${this.escapeHtml(content)}</code></pre>`;
  }

  private renderLinkNode(node: LinkNode): string {
    const content = node.children.map((child) => this.renderNode(child)).join('');
    const rel = node.rel ? ` rel="${node.rel}"` : '';
    const target = node.target ? ` target="${node.target}"` : '';

    return `<a href="${this.escapeHtml(node.url)}"${rel}${target}>${content}</a>`;
  }

  private renderTextNode(node: TextNode): string {
    let text = node.text || '';

    // Apply text formatting based on format flags
    if (node.format && typeof node.format === 'number') {
      if (node.format & 1) {
        // Bold
        text = `<strong>${text}</strong>`;
      }
      if (node.format & 2) {
        // Italic
        text = `<em>${text}</em>`;
      }
      if (node.format & 4) {
        // Strikethrough
        text = `<s>${text}</s>`;
      }
      if (node.format & 8) {
        // Underline
        text = `<u>${text}</u>`;
      }
      if (node.format & 16) {
        // Code
        text = `<code>${this.escapeHtml(text)}</code>`;
      }
      if (node.format & 32) {
        // Subscript
        text = `<sub>${text}</sub>`;
      }
      if (node.format & 64) {
        // Superscript
        text = `<sup>${text}</sup>`;
      }
    }

    // Apply inline styles
    if (node.style) {
      text = `<span style="${this.escapeHtml(node.style)}">${text}</span>`;
    }

    return text;
  }

  private getAlignmentClass(format: string | number | undefined): string {
    if (typeof format === 'string') {
      switch (format) {
        case 'left':
          return 'text-left';
        case 'center':
          return 'text-center';
        case 'right':
          return 'text-right';
        case 'justify':
          return 'text-justify';
        default:
          return '';
      }
    }

    if (typeof format === 'number') {
      if (format & 1) return 'text-center';
      if (format & 2) return 'text-right';
      if (format & 4) return 'text-justify';
    }

    return '';
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Helper method to render rich text as plain text (for previews, meta descriptions, etc.)
  renderAsPlainText(lexicalData: any): string {
    if (!lexicalData || !lexicalData.root) {
      return '';
    }

    return this.extractTextFromNode(lexicalData.root);
  }

  private extractTextFromNode(node: LexicalNode): string {
    if (node.type === 'text') {
      return (node as TextNode).text || '';
    }

    if ('children' in node && Array.isArray(node['children'])) {
      return node['children'].map((child) => this.extractTextFromNode(child)).join(' ');
    }

    return '';
  }

  // Helper method to get the first few words for excerpts
  getExcerpt(lexicalData: any, wordLimit: number = 50): string {
    const plainText = this.renderAsPlainText(lexicalData);
    const words = plainText.trim().split(/\s+/);

    if (words.length <= wordLimit) {
      return plainText;
    }

    return words.slice(0, wordLimit).join(' ') + '...';
  }
}
