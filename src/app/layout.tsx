import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Load Inter font for non-Apple devices
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = "https://portfolio.blackshadow.software";
const SITE_DESCRIPTION =
  "Interactive AI portfolio for Rimon Ahammad — Flutter and Rust engineer. Ask it anything about my work, stack and experience.";

export const metadata: Metadata = {
  title: "Rimon Ahammad",
  description: SITE_DESCRIPTION,
  keywords: [
    "Rimon Ahammad",
    "Portfolio",
    "Software Engineer",
    "Rust",
    "Flutter",
    "Dart",
    "WebRTC",
    "FFI",
    "Full Stack",
    "Next.js",
    "React"
  ],
  authors: [
    {
      name: "Rimon Ahammad",
      url: "https://github.com/RemonAhammad",
    },
  ],
  creator: "Rimon Ahammad",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Rimon Ahammad",
    description: SITE_DESCRIPTION,
    siteName: "Rimon Ahammad",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rimon Ahammad",
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [
      {
        url: "/blackshadow.svg",
        sizes: "any",
      }
    ],
    shortcut: "/blackshadow.svg?v=2",
    apple: "/apple-touch-icon.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/blackshadow.svg" sizes="any" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}