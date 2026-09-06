import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import SplashScreen from "@/components/splash-screen";
import { SPLASH_FREQUENCY, SPLASH_SESSION_KEY } from "@/constants/splash";
import { RESUME } from "@/constants/resume";
import "./globals.css";

// Load Inter font for non-Apple devices
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const SITE_NAME = RESUME.name || "AI Portfolio";
const SITE_DESCRIPTION =
  RESUME.summary || "Interactive AI portfolio — ask it anything about my work and experience.";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: [
    SITE_NAME,
    "Portfolio",
    "Software Engineer",
    "Next.js",
    "React"
  ].filter(Boolean),
  authors: [
    {
      name: SITE_NAME,
      url: RESUME.github,
    },
  ],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
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
        {/* Runs before first paint: if the splash was already shown this session,
            hide the SSR markup so it never flashes and gets torn down at hydration.
            Only emitted when SPLASH_FREQUENCY is 'session' — otherwise it would
            suppress a splash that is meant to play on every load. */}
        {SPLASH_FREQUENCY === "session" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `try{if(sessionStorage.getItem('${SPLASH_SESSION_KEY}')==='1'){document.documentElement.dataset.splash='off'}}catch(e){}`,
            }}
          />
        )}
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
          <SplashScreen />
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