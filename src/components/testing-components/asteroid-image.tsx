'use client';

import Image from 'next/image';
import smallImage from '../../images/small.jpg';
import mediumImage from '../../images/medium.jpg';
import largeImage from '../../images/large.jpg';

// Use imported local images
const ASTEROID_IMAGES = {
  small: {
    src: smallImage,
    alt: 'Un pequeño asteroide o roca en el espacio',
  },
  medium: {
    src: mediumImage,
    alt: 'Un asteroide de tamaño mediano flotando en el espacio',
  },
  large: {
    src: largeImage,
    alt: 'Un asteroide muy grande o un planetoide en el espacio profundo',
  },
};

/**
 * Determines the size category of an asteroid based on its maximum estimated diameter in kilometers.
 * @param {number} diameter - The maximum estimated diameter of the asteroid in kilometers.
 * @returns {'small' | 'medium' | 'large'} The size category.
 */
const getAsteroidSizeCategory = (diameter: number): 'small' | 'medium' | 'large' => {
  if (diameter < 0.1) { // Menos de 100 metros
    return 'small';
  }
  if (diameter < 1) { // Entre 100 metros y 1 kilómetro
    return 'medium';
  }
  return 'large'; // Más de 1 kilómetro
};

interface AsteroidImageProps {
  diameter: number;
}

export function AsteroidImage({ diameter }: AsteroidImageProps) {
  const sizeCategory = getAsteroidSizeCategory(diameter);
  const { src, alt } = ASTEROID_IMAGES[sizeCategory];

  return (
    <div className="relative w-full h-32 mb-4 overflow-hidden rounded-t-lg">
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 hover:scale-110"
        placeholder="blur" // Optional: add a blur placeholder while loading
      />
    </div>
  );
}
