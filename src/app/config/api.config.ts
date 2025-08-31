import { environment } from '../../environments/environment';

export const API_CONFIG = {
  BASE_URL: environment.apiUrl,
  ENDPOINTS: {
    PAGES: '/pages',
    POSTS: '/posts',
    CATEGORIES: '/categories',
    MEDIA: '/media',
    USERS: '/users',
    AUTH: {
      LOGIN: '/users/login',
      LOGOUT: '/users/logout',
      ME: '/users/me',
    },
    GLOBALS: {
      HEADER: '/globals/header',
      FOOTER: '/globals/footer',
    },
    SEARCH: '/search',
    PREVIEW: '/preview',
    REVALIDATE: '/revalidate',
  },
  DEFAULT_PARAMS: {
    LIMIT: 10,
    SORT: '-createdAt',
  },
};
