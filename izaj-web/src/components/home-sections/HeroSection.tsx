import React, { useState } from 'react';
import { useHeroSlideshow, HeroSlide } from '../../hooks/useHeroSlideshow';

export default function HeroSection() {
  const [isPaused, setIsPaused] = useState(false);

  // Hero images for desktop
  const desktopHeroImages: HeroSlide[] = [
    {
      image: "hero1.jpg",
      heading: "Soft Light, Slow Days",
      subheading: "In a space where textures breathe and sunlight dances,\nsoft lighting enhances the feeling of ease.",
    },
    {
      image: "hero2.jpg",
      heading: "Gentle Light, Quiet Moments",
      subheading: "Soft luminance warms your space while the rain whispers outside.",
    },
    {
      image: "hero3.jpg",
      heading: "Warmth in Every Corner",
      subheading: "A warm glow that embraces your space, creating a cozy atmosphere.",
    },
  ];

  // Use desktop hero images for all breakpoints to keep design consistent
  const heroImages = desktopHeroImages;

  const { currentIndex, goToSlide, nextSlide, prevSlide } = useHeroSlideshow(heroImages, isPaused ? 0 : 5000);

  return (
    <div 
      className="relative w-full h-[480px] sm:h-[480px] md:h-[600px] lg:h-[720px] overflow-hidden z-0 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Hero Image with smooth transition */}
      <img 
        src={`/${heroImages[currentIndex].image}`}
        alt={`${heroImages[currentIndex].heading} - ${heroImages[currentIndex].subheading.split('\n')[0]}`}
        className="w-full h-full object-cover object-center transition-all duration-1000 ease-in-out group-hover:scale-105"
        loading={currentIndex === 0 ? "eager" : "lazy"}
      />

      {/* Navigation Arrows hidden */}
      <button className="hidden" aria-hidden="true" />
      <button className="hidden" aria-hidden="true" />

      {/* Slide Indicators hidden */}
      <div className="hidden" aria-hidden="true" />

      {/* Overlay Text with improved animations */}
      <div className="absolute inset-0 w-full bg-gradient-to-r from-black/70 via-black/40 to-transparent text-white p-4 sm:p-6 md:p-8 flex items-end">
        <div className="max-w-4xl animate-fade-in-up">
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 drop-shadow-lg animate-slide-in-left"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            {heroImages[currentIndex].heading}
          </h1>
          <p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl whitespace-pre-line drop-shadow-md animate-slide-in-left animation-delay-200"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            {heroImages[currentIndex].subheading}
          </p>
        </div>
      </div>

    </div>
  );
}
