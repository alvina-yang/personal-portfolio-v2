import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { SocialLinks } from "@/components/social-links";

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f6]/95 dark:bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-[#e5e3e0] dark:border-[#2a2a2a] px-4 py-4 md:px-8 lg:px-12 w-full">
      <div className="flex justify-between items-center max-w-full">
        <SocialLinks />
        <div className="flex items-center gap-8">
          <Link href="/" className="text-base hover:opacity-70 transition-opacity">
            Home
          </Link>
          <Link href="/blogs" className="text-base hover:opacity-70 transition-opacity">
            Blogs
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
