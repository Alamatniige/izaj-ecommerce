"use client";

import React, { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useUserContext } from '../../context/UserContext';
import HeroSection from './HeroSection';
import ItemsCategory from './ItemsCategory';
import AboutUs from './AboutUs';
import MonthlyDeals from './MonthlyDeals';
import NewCollectionBanner from './NewCollectionBanner';
import FreshDrops from './FreshDrops';
import FeaturedProducts from './FeaturedProducts';
import FreeDesignConsultation from './FreeDesignConsultation';
import MoreToExplore from './MoreToExplore';
import SaleItem from './SaleItem';
import Link from 'next/link';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: 'easeOut',
    },
  }),
};

type MotionSectionProps = {
  children: ReactNode;
  delay?: number;
};

const MotionSection = ({ children, delay = 0 }: MotionSectionProps) => (
  <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={sectionVariants}
    custom={delay}
  >
    {children}
  </motion.section>
);

export default function Home() {
  const { user, logout } = useUserContext();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-white font-sans">
      {/* Main Content */}
      <main className="p-0 mx-0 w-full">
        <MotionSection>
          <HeroSection />
        </MotionSection>

        <MotionSection delay={0.1}>
          <ItemsCategory user={user} />
        </MotionSection>

        <MotionSection delay={0.15}>
          <AboutUs />
        </MotionSection>

        <MotionSection delay={0.2}>
          <MonthlyDeals />
        </MotionSection>

        <MotionSection delay={0.25}>
          <NewCollectionBanner />
        </MotionSection>

        <MotionSection delay={0.3}>
          <FreshDrops />
        </MotionSection>

        <MotionSection delay={0.35}>
          <FeaturedProducts />
        </MotionSection>

        <MotionSection delay={0.4}>
          <FreeDesignConsultation />
        </MotionSection>

        <MotionSection delay={0.45}>
          <SaleItem />
        </MotionSection>

        <MotionSection delay={0.5}>
          <MoreToExplore />
        </MotionSection>
      </main>
    </div>
  );
}
