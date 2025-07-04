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

export const metadata: Metadata = {
  title: "Remon Ahammad",
  description: "Interactive portfolio with an AI-powered Memoji that answers questions about me, my skills, and my experience",
  keywords: [
    "Toukoum", 
    "Portfolio", 
    "Developer", 
    "AI", 
    "Interactive", 
    "Memoji", 
    "Web Development",
    "Full Stack",
    "Next.js",
    "React"
  ],
  authors: [
    {
      name: "Toukoum",
      url: "https://toukoum.fr",
    },
  ],
  creator: "Toukoum",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://toukoum.fr",
    title: "Remon Ahammad",
    description: "Interactive portfolio with an AI-powered Memoji that answers questions about me",
    siteName: "Remon Ahammad",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remon Ahammad",
    description: "Interactive portfolio with an AI-powered Memoji that answers questions about me",
    creator: "@toukoum",
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