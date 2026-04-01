import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "spring initializr",
  description: "spring initializr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen w-screen overflow-y-auto overscroll-y-contain md:h-screen md:overflow-y-hidden md:overscroll-y-none">
        {children}
      </body>
    </html>
  );
}
