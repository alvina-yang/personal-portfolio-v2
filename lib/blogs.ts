// Central location for all blog metadata
export interface Blog {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
}

export const blogs: Blog[] = [
  {
    slug: 'neovim-isnt-actually-that-scary',
    title: "Neovim Isn't Actually That Scary",
    description: 'My terminal setup :DDD',
    date: '2026-03-06',
    published: true,
  },
  {
    slug: 'symmetries',
    title: 'Symmetries',
    description: 'From snowflakes to the Leech lattice, to kissing numbers, and of course the Monster.',
    date: '2025-11-17',
    published: true,
  },
  {
    slug: 'irrational-number',
    title: 'The Most Irrational Number in the Universe',
    description: 'How nature solves the packing problem and what that reveals about the golden ratio.',
    date: '2026-03-14',
    published: true,
  },
];

// Helper function to get a blog by slug
export const getBlogBySlug = (slug: string): Blog | undefined => {
  return blogs.find((blog) => blog.slug === slug && blog.published);
};

// Helper function to get all published blogs sorted by date (newest first)
export const getAllPublishedBlogs = (): Blog[] => {
  return blogs
    .filter((blog) => blog.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
