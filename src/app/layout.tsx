import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import { AI } from "./actions";

export const metadata = {
  title: "AI Tutorial",
  description: "Sample app for AI tutorial",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <TRPCReactProvider>
        <AI>
          <body>
            {children}
          </body>
        </AI>
      </TRPCReactProvider>
    </html>
  );
}
