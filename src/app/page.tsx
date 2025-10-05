'use client';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        <section id="hero" className="relative h-[70vh] md:h-[90vh] flex items-center justify-center text-center overflow-hidden bg-gray-900">
          <div className="relative z-20 p-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">{t('home.hero.title')}</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              {t('home.hero.subtitle')}
            </p>
            <a href="#featured-content">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {t('home.hero.cta')}
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </section>

        <section id="featured-content" className="py-20 md:py-32">
          <div className="container mx-auto px-4 space-y-16">
            <h2 className="text-3xl font-bold tracking-tight text-center">{t('home.featuredAsteroids.title')}</h2>
            
            <h2 className="text-3xl font-bold tracking-tight text-center">{t('home.featuredComets.title')}</h2>
            
            <div className="text-center pt-8">
              <Link href="/testing">
                <Button size="lg" variant="outline">
                  Ir al Explorador de Asteroides <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
