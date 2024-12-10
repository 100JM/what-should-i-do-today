import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { Gothic_A1 } from "next/font/google"
import 'remixicon/fonts/remixicon.css';

const gothicA1 = Gothic_A1({
  subsets: ['latin'],
  weight: "400"
});

export const metadata: Metadata = {
  title: "오늘 뭐 하지?",
  description: "What should i do today?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gothicA1.className} antialiased`}
      >
        <Script
          async
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
