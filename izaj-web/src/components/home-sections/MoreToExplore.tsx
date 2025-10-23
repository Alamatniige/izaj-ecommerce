import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function MoreToExplore() {
  const exploreItems = [
    {
      id: 1,
      title: "Premium Ceiling Lights",
      subtitle: "Illuminate Your Space with Style",
      description: "Transform any room with our stunning collection of ceiling lights. From elegant chandeliers to modern flush mounts, our premium fixtures combine exceptional craftsmanship with contemporary design. Perfect for creating the perfect ambiance in your home or office.",
      image: "/bey.jpg",
      link: "/product-list?category=Ceiling Light"
    },
    {
      id: 2,
      title: "Elegant Chandeliers",
      subtitle: "Centerpiece Lighting for Every Room",
      description: "Make a statement with our exquisite chandelier collection. Each piece is carefully selected to bring sophistication and charm to your space. Whether you prefer classic crystal designs or modern minimalist styles, our chandeliers will become the focal point of any room.",
      image: "/bey2.jpg",
      link: "/product-list?category=Chandelier"
    },
    {
      id: 3,
      title: "Modern Pendant Lights",
      subtitle: "Sleek Design Meets Functionality",
      description: "Add contemporary flair to your space with our modern pendant light collection. These versatile fixtures are perfect for kitchen islands, dining areas, or as accent lighting. With clean lines and innovative designs, they seamlessly blend style with practical illumination.",
      image: "/bey3.jpg",
      link: "/product-list?category=Pendant Light"
    }
  ];

  return (
    <section className="w-full bg-white py-2 sm:py-3 md:py-4">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Jost, sans-serif' }}>
            More To Explore
          </h2>
        </div>

        {/* Content Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {exploreItems.map((item) => (
            <div key={item.id} className="group">
              <Link href={item.link} className="block">
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={250}
                    className="w-full h-64 sm:h-72 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Jost, sans-serif' }}>
                    {item.title}
                  </h3>
                  
                  <p className="text-lg font-medium text-gray-700" style={{ fontFamily: 'Jost, sans-serif' }}>
                    {item.subtitle}
                  </p>
                  
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed" style={{ fontFamily: 'Jost, sans-serif' }}>
                    {item.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
