import { CheckCircle2, LucideInfo, XCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Builling App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body className={`${geistSans.className} h-full antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              classNames: {
                title: geistSans.className,
                description: geistSans.className,
              },
            }}
            icons={{
              error: <XCircleIcon />,
              success: <CheckCircle2 />,
              info: <LucideInfo />,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
