import { useState } from 'react';
import Hero from '../components/Landing/Hero';
import StackCompatibility from '../components/Landing/StackCompatibility';
import Features from '../components/Landing/Features';
import Workflow from '../components/Landing/Workflow';
import DemoVideo from '../components/Landing/DemoVideo';
import CTASection from '../components/Landing/CTASection';
import Footer from '../components/Landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-black">
      <Hero/>
      <StackCompatibility />
      <Features />
      <Workflow />
      <DemoVideo />
      <CTASection />
      <Footer />
    </div>
  );
}