import { notFound } from "next/navigation";
import { getBlogBySlug, getAllPublishedBlogs } from "@/lib/blogs";
import { Navbar } from "@/components/navbar";
import Symmetries from "./symmetries";

export async function generateStaticParams() {
  const blogs = getAllPublishedBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Map slug to component
  const BlogContent = {
    "symmetries": Symmetries,
  }[slug];

  if (!BlogContent) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      <Navbar />

      <article className="px-8 py-16 md:px-16 lg:px-24 pt-24 md:pt-28 w-full max-w-full">
        <div className="max-w-3xl mx-auto">
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl mb-4">{blog.title}</h1>
            <time className="text-base opacity-60">{blog.date}</time>
          </header>

          <div className="prose prose-base max-w-none">
            <BlogContent />
          </div>
        </div>
      </article>
    </main>
  );
}
