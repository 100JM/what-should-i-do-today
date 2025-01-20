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

// export const metadata: Metadata = {
//   title: "오늘 뭐 하지?",
//   description: "What should i do today?",
// };

export const metadata: Metadata = {
  title: "오늘 뭐 하지?",
  description: "내 주변 가볼만한 장소를 찾아보세요.",
  keywords: ['map', 'place', '핫플', '지도', '맛집', '명소', '갈만한 곳', '관광광' ],
  openGraph: {
    title: '오늘 뭐 하지?',
    description: "내 주변 가볼만한 장소를 찾아보세요.",
    images: [
      {
        url: 'https://what-should-i-do-today.vercel.app/images/openGraph_image.jpg',
        alt: 'main_logo',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
    url: 'https://what-should-i-do-today.vercel.app/',
    siteName: '100LOG'
  },
  twitter: {
    title: "오늘 뭐 하지?",
    description: "내 주변 가볼만한 장소를 찾아보세요.",
    images: [
      {
        url: 'https://what-should-i-do-today.vercel.app/images/openGraph_image.jpg',
        alt: 'main_logo',
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: 'https://what-should-i-do-today.vercel.app/',
  }
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
