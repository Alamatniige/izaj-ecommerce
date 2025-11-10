"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const CategoriesPage: React.FC = () => {
  const allItems = [
    { id: 1, name: "Chandelier", image: "chandelier.webp" },
    { id: 2, name: "Bulb", image: "bulb.webp" },
    { id: 3, name: "Pendant Light", image: "pendant.jpg" },
    { id: 4, name: "Ceiling Light", image: "ceiling.webp" },
    { id: 5, name: "Wall Lamp", image: "wall.webp" },
    { id: 6, name: "Table Lamp", image: "table.webp" },
    { id: 7, name: "Floor Lamp", image: "floor.webp" },
    { id: 8, name: "Track Lighting", image: "track.webp" },
    { id: 9, name: "Recessed Lighting", image: "recessed.webp" },
    { id: 10, name: "Outdoor Lighting", image: "out.webp" },
    { id: 11, name: "Smart Lighting", image: "smart.webp" },
    { id: 12, name: "LED Strip", image: "led.webp" },
    { id: 13, name: "Lantern", image: "lantern.jpg" },
    { id: 14, name: "Spotlight", image: "spotlight.webp" },
    { id: 15, name: "Emergency Light", image: "emergency.webp" },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen">
      <main className="bg-white min-h-screen px-4 sm:px-8 md:px-16 lg:px-24 py-10 md:py-16">
        <style>
          {`
            .category-tile {
              transition: transform 0.3s;
              background: transparent;
              box-shadow: none;
            }
            .category-tile:hover, .category-tile:active {
              transform: scale(1.07) translateY(-4px);
              z-index: 2;
              box-shadow: none;
            }
            .category-img {
              transition: transform 0.3s;
              background: transparent;
              box-shadow: none;
            }
            .category-tile:hover .category-img, .category-tile:active .category-img {
              transform: scale(1.10);
              box-shadow: none;
            }
          `}
        </style>

        {/* Header Section */}
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
            All Categories
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
            Explore our complete collection of premium lighting solutions. 
            From elegant chandeliers to modern LED fixtures, find the perfect lighting to illuminate your style.
          </p>
        </div>

        {/* Categories Grid - 3 columns */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {allItems.map((item, idx) => (
              <Link
                key={item.id}
                href={`/product-list?category=${encodeURIComponent(item.name)}`}
                className="category-tile overflow-hidden relative flex flex-col w-full group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`category-img w-full h-72 sm:h-96 object-cover transition-all duration-300 ${
                      hoveredIndex === idx ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h3 className={`text-white text-lg sm:text-xl md:text-2xl font-medium text-center transition-all duration-500 ${
                      hoveredIndex === idx ? 'scale-110 -translate-y-3' : 'scale-100 translate-y-0'
                    }`} style={{
                      fontFamily: 'Jost, sans-serif',
                      fontWeight: 500,
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                    }}>
                      {item.name}
                    </h3>
                    <div
                      className={`text-black py-2 px-4 hover:opacity-80 transition-all duration-500 text-xs text-center block rounded-sm border ${
                        hoveredIndex === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                      style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500, backgroundColor: 'white', borderColor: 'white', letterSpacing: '0.1em' }}
                    >
                      VIEW
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoriesPage;

