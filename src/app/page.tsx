'use client';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowRight } from 'lucide-react';
import type { SpaceObject } from '@/lib/types';
import { FeaturedObjectViewer } from '@/components/cosmic-explorer/featured-object-viewer';
import { AnimatedStarfield } from '@/components/cosmic-explorer/animated-starfield';
import { useLanguage } from '@/context/language-context';


function getSampleData(): SpaceObject[] {
  const imageMap = new Map<string, ImagePlaceholder>(PlaceHolderImages.map((img) => [img.id, img]));
  
  const sampleObjects: SpaceObject[] = [
    {
      id: 'sample-1',
      name: '(433) Eros',
      type: 'Asteroid',
      diameter_km: 16.84,
      is_potentially_hazardous: false,
      close_approach_date: '2024-Jul-28 10:00',
      relative_velocity_kps: '5.46',
      miss_distance_au: '0.149',
      orbit: { semi_major_axis_au: 1.458, eccentricity: 0.222, inclination_deg: 10.829, orbital_period_days: 643.2 },
      image_id: 'asteroid-1',
      imageUrl: imageMap.get('asteroid-1')!.imageUrl,
      imageHint: imageMap.get('asteroid-1')!.imageHint,
      description: imageMap.get('asteroid-1')!.description,
    },
    {
      id: 'sample-2',
      name: '1P/Halley',
      type: 'Comet',
      diameter_km: 11,
      is_potentially_hazardous: false,
      close_approach_date: '1986-Feb-09 20:00',
      relative_velocity_kps: '70.56',
      miss_distance_au: '0.417',
      orbit: { semi_major_axis_au: 17.834, eccentricity: 0.967, inclination_deg: 162.26, orbital_period_days: 27793 },
      image_id: 'comet-1',
      imageUrl: imageMap.get('comet-1')!.imageUrl,
      imageHint: imageMap.get('comet-1')!.imageHint,
      description: imageMap.get('comet-1')!.description,
    },
    {
      id: 'sample-3',
      name: '(101955) Bennu',
      type: 'Asteroid',
      diameter_km: 0.49,
      is_potentially_hazardous: true,
      close_approach_date: '2182-Sep-24 12:00',
      relative_velocity_kps: '0.27',
      miss_distance_au: '0.005',
      orbit: { semi_major_axis_au: 1.126, eccentricity: 0.203, inclination_deg: 6.034, orbital_period_days: 436.6 },
      image_id: 'asteroid-2',
      imageUrl: imageMap.get('asteroid-2')!.imageUrl,
      imageHint: imageMap.get('asteroid-2')!.imageHint,
      description: imageMap.get('asteroid-2')!.description,
    },
     {
      id: 'sample-4',
      name: '2P/Encke',
      type: 'Comet',
      diameter_km: 4.8,
      is_potentially_hazardous: false,
      close_approach_date: '2023-Oct-22',
      relative_velocity_kps: '29.3',
      miss_distance_au: '0.3',
      orbit: { semi_major_axis_au: 2.21, eccentricity: 0.84, inclination_deg: 11.9, orbital_period_days: 1204.5 },
      image_id: 'comet-2',
      imageUrl: imageMap.get('comet-2')!.imageUrl,
      imageHint: imageMap.get('comet-2')!.imageHint,
      description: imageMap.get('comet-2')!.description,
    }
  ];

  return sampleObjects;
}

export default function Home() {
  const { t } = useLanguage();
  const featuredObjects = getSampleData();
  const featuredAsteroids = featuredObjects.filter(obj => obj.type === 'Asteroid');
  const featuredComets = featuredObjects.filter(obj => obj.type === 'Comet');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        <section id="hero" className="relative h-[70vh] md:h-[90vh] flex items-center justify-center text-center overflow-hidden">
          <AnimatedStarfield />
          <div className="relative z-20 p-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">{t('home.hero.title')}</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              {t('home.hero.subtitle')}
            </p>
            <a href="#featured-asteroids">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {t('home.hero.cta')}
                <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
              </Button>
            </a>
          </div>
        </section>

        <section id="featured-asteroids" className="py-20 md:py-32">
          <div className="container mx-auto px-4 space-y-20">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-center mb-12">{t('home.featuredAsteroids.title')}</h2>
              <FeaturedObjectViewer objects={featuredAsteroids} />
            </div>
          </div>
        </section>
        
        <section id="featured-comets" className="py-20 md:py-32 bg-card/20">
          <div className="container mx-auto px-4 space-y-20">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-center mb-12">{t('home.featuredComets.title')}</h2>
              <FeaturedObjectViewer objects={featuredComets} />
            </div>

            <div className="text-center pt-8">
              <Link href="/explorer">
                <Button size="lg" variant="outline">
                  {t('home.viewAll.cta')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
