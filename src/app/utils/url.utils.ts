export class UrlUtils {
  static buildUrl(baseUrl: string, path: string, params?: Record<string, any>): string {
    let url = `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, String(value));
        }
      });

      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return url;
  }

  static getSlugFromUrl(url: string): string {
    return url.split('/').pop() || '';
  }

  static isExternalUrl(url: string): boolean {
    return /^https?:\/\//.test(url) && !url.includes(window.location.hostname);
  }
}
