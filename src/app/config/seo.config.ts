import { environment } from '../../environments/environment';

export const SEO_CONFIG = {
  DEFAULT_TITLE: environment.siteName,
  DEFAULT_DESCRIPTION: 'A modern website built with Payload CMS and Angular',
  DEFAULT_IMAGE: '/assets/images/og-default.jpg',
  SITE_URL: environment.siteUrl,
  TWITTER_HANDLE: '@yourhandle',
  FACEBOOK_APP_ID: 'your-facebook-app-id',
  STRUCTURED_DATA: {
    ORGANIZATION: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: environment.siteName,
      url: environment.siteUrl,
      logo: `${environment.siteUrl}/assets/images/logo.png`,
    },
  },
};
