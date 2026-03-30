export const CACHE_KEYS = {
  TRENDING: ({ page, limit }) =>
    `blogs:trending:page=${page}:limit=${limit}`,

  SEARCH: ({ q = "", page = 1, limit = 10, category = "" }) =>
    `blogs:search:q=${q}:cat=${category}:page=${page}:limit=${limit}`,

  RECOMMEND: (slug) => `blogs:recommend:${slug}`,

  BLOG: (slug) => `blogs:detail:${slug}`,

  CATEGORIES: () => `categories:all`,
};