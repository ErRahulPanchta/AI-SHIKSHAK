export const CACHE_KEYS = {
  TRENDING: (page, limit) => `trending:${page}:${limit}`,
  SEARCH: (query) => `search:${query}`,
  RECOMMEND: (slug) => `recommend:${slug}`,
  BLOG: (slug) => `blog:${slug}`,
};