import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { fontBody, fontVariables } from "@/lib/fonts";
import { LocaleProvider } from "@/lib/i18n/provider";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body className={`${fontBody.className} antialiased`}>
        <ThemeProvider>
          <LocaleProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
