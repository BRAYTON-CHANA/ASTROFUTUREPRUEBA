'use client';

export function AnimatedStarfield() {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'}}>
      <div className="stars absolute top-0 left-0 right-0 bottom-0 w-full h-full block"></div>
      <div className="stars-2 absolute top-0 left-0 right-0 bottom-0 w-full h-full block"></div>
      <div className="stars-3 absolute top-0 left-0 right-0 bottom-0 w-full h-full block"></div>
    </div>
  );
}
