import type { Metadata } from "next";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/nav/Navbar";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkedIn Clone",
  description: "Professional networking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-linkedin-bg text-linkedin-text">
        <SessionProvider>
          <ToastProvider>
            <Navbar />
            <main className="pt-[52px]">{children}</main>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
