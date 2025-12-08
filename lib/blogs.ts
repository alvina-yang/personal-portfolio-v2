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
    slug: 'symmetries',
    title: 'Symmetries',
    description: 'From snowflakes to the Leech lattice, to kissing numbers, and of course the Monster.',
    date: '2025-11-17',
    published: true,
  },
  // Add more blogs here as you create them
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
