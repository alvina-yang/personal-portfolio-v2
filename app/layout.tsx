import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alvina Yang",
  description: "Personal portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="701337a8-5778-46fc-ae34-5e0eadbcb774"></script>
      </head>
      <body className={`${lora.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
