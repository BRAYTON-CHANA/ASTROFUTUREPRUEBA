'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Rocket } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/explorer', label: 'Explorer' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 md:px-6 bg-gray-900/80 backdrop-blur-sm shadow-md">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
        <Rocket className="h-6 w-6 text-primary" />
        <span className="hidden sm:inline-block">Cosmic Explorer</span>
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === link.href ? 'text-primary' : 'text-gray-300'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-950/95 text-white w-[250px]">
            <div className="flex flex-col p-6">
                <Link href="/" className="flex items-center gap-2 mb-8">
                    <Rocket className="h-6 w-6 text-primary" />
                    <span className="font-semibold">Cosmic Explorer</span>
                </Link>
                <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            'text-lg font-medium transition-colors hover:text-primary',
                            pathname === link.href ? 'text-primary' : 'text-gray-300'
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
                </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
