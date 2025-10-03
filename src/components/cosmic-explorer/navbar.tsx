'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '../ui/button';
import { Languages, Menu } from 'lucide-react';


export function Navbar() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-background/70 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tighter text-foreground">
              Astro Future
            </h1>
          </Link>
          <div className="flex items-center gap-2 md:gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/#featured-asteroids" className="text-foreground hover:text-primary transition-colors">
                {t('nav.asteroids')}
              </Link>
              <Link href="/#featured-comets" className="text-foreground hover:text-primary transition-colors">
                {t('nav.comets')}
              </Link>
              <Link href="/explorer" className="text-foreground hover:text-primary transition-colors">
                {t('nav.explorer')}
              </Link>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Languages className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">{t('nav.language.toggle')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('es')} disabled={language === 'es'}>
                  Español
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú de navegación</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  <Link href="/#featured-asteroids" className="text-foreground hover:text-primary transition-colors">
                    {t('nav.asteroids')}
                  </Link>
                  <Link href="/#featured-comets" className="text-foreground hover:text-primary transition-colors">
                    {t('nav.comets')}
                  </Link>
                  <Link href="/explorer" className="text-foreground hover:text-primary transition-colors">
                    {t('nav.explorer')}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
