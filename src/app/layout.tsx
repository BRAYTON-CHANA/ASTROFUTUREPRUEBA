import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from '@/components/cosmic-explorer/navbar';
import { LanguageProvider } from '@/context/language-context';

export const metadata: Metadata = {
  title: 'Cosmic Explorer',
  description: 'Explora asteroides, cometas y otros objetos espaciales.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
