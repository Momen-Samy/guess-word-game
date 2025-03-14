import type { Metadata } from "next";
import {Roboto} from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight:["100","300","400","500","700","900"],
  subsets:["latin"],
});

const WebsiteTitle = "Guess The Word Game"

export const metadata: Metadata = {
  title: WebsiteTitle,
  description: `${WebsiteTitle}.....`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  );
}
