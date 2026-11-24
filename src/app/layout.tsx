import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'COSMIX',
  description:
    'Experience the cinematic beauty campaign of COSMIX. Micro-milled couture pigments, weightless velvet wear, and interactive AI Virtual Try-On studio.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="min-h-full flex flex-col bg-cosmix-cream text-cosmix-dark font-sans selection:bg-cosmix-blush selection:text-cosmix-wine">
        {children}
      </body>
    </html>
  );
}
