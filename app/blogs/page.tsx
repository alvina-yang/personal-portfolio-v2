import Link from "next/link";
import { getAllPublishedBlogs } from "@/lib/blogs";
import { Navbar } from "@/components/navbar";

export default function BlogsPage() {
  const blogs = getAllPublishedBlogs();

  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      <Navbar />

      <div className="px-8 py-16 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl mb-12">Blogs</h1>

          <div className="space-y-6">
            {blogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blogs/${blog.slug}`}
                className="block group"
              >
                <div className="flex items-start gap-4 p-6 rounded-lg hover:bg-[#ebe9e6] dark:hover:bg-[#1a1a1a] transition-colors">
                  {/* Folder Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 flex-shrink-0 mt-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                    />
                  </svg>

                  <div className="flex-1">
                    <div className="flex items-baseline gap-4 mb-2">
                      <h2 className="text-xl group-hover:opacity-70 transition-opacity">
                        {blog.title}
                      </h2>
                      <time className="text-xs opacity-60">{blog.date}</time>
                    </div>
                    <p className="text-sm opacity-80">{blog.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
