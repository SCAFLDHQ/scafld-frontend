import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Landing/Header";

const Landing = () => {

  return (
    <div className="dark bg-background-dark text-primary-text font-body min-h-screen">

    <Header />
      {/* Main Content */}
      <main className="w-full max-w-5xl px-4 mx-auto">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-32">
          <h1 className="font-display text-3xl md:text-6xl font-bold text-white leading-tight">
            Build production-ready APIs in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8A2BE2] to-[#4169E1]">minutes, not days</span>
          </h1>
          <p className="font-body text-base md:text-lg text-primary-text mt-4 max-w-2xl mx-auto px-4">
            Visually design your database and instantly generate robust Django or Express.js code.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to='/register' className="flex justify-center">
              <button className="w-full sm:w-auto px-8 py-4 rounded-lg font-bold text-white gradient-btn text-base font-display">
                Start Building Now
              </button>
            </Link>
            <a href='https://youtu.be/VHSyADee8zQ' className="flex justify-center">
              <button className="w-full sm:w-auto px-8 py-4 rounded-lg font-bold text-white border border-gray-600 hover:border-gray-400 transition-colors text-base font-display">
                View Demo
              </button>
            </a>
          </div>
        </section>

        {/* Visualization Section */}
        <section className="py-12 md:py-24">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-white">
              Visualize and Build with Ease
            </h2>
            <p className="font-body text-primary-text mt-2 max-w-2xl mx-auto px-4">
              An animated diagram showing database tables and their relationships.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-4xl p-4 md:p-8 shadow-neumorphic rounded-xl">
              <img 
                alt="Animated visualization of a database schema with tables for Users, Posts, and Comments, showing relationships between them."
                className="w-full h-auto rounded-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNGo7t314CTZfxGbnKyXAY2Mok70i5ne_RcSSYMgtneI1gyTHmogr_kDzUXYwW2fxTUri7P-ISZuXOtEuvlWj3CD2ipCe7sMOGHD7f2Q7api_ilZOP505F8prJSyBCXk6fj0RcirmE3Nf8JRMVB8oVSSbcID2-CX2EpQf0yRQjBLt3oBTt6fEKpr47Wz6mRASXv7pizpWDG1hYdACMjE6TE-WNi-ZAbJ-5IXn0SGWxh7hI-72cCE7sZHJ8PMfvzcBGrK27IBxQpM0W"
              />
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-12 md:py-24">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-white">
              A Simple, Three-Step Process
            </h2>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center max-w-xs mx-auto">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full shadow-neumorphic mb-4">
                <span className="text-xl md:text-2xl font-bold font-display text-white">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold font-display text-white">Design Your Schema</h3>
              <p className="text-primary-text mt-2 text-sm md:text-base">Drag and drop to create your database models and relationships.</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center max-w-xs mx-auto mt-8 md:mt-0">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full shadow-neumorphic mb-4">
                <span className="text-xl md:text-2xl font-bold font-display text-white">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold font-display text-white">Customize Your API</h3>
              <p className="text-primary-text mt-2 text-sm md:text-base">Configure endpoints, permissions, and business logic.</p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center max-w-xs mx-auto mt-8 md:mt-0">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full shadow-neumorphic mb-4">
                <span className="text-xl md:text-2xl font-bold font-display text-white">3</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold font-display text-white">Generate Your Code</h3>
              <p className="text-primary-text mt-2 text-sm md:text-base">Export production-ready Django or Express.js code instantly.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 md:py-32">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-white max-w-2xl mx-auto px-4">
            Ready to accelerate your backend development?
          </h2>
          <Link to='/register'>
            <button className="mt-8 px-8 py-4 rounded-lg font-bold text-white gradient-btn text-base font-display">
              Get Started Free
            </button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl py-8 px-4 mx-auto mt-16 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © 2025 SCAFLD. All rights reserved.
          </p>
          <div className="flex gap-6 order-3 md:order-2">
            <Link to='/privacy-policy' className="text-sm text-gray-400 hover:text-white" href="#">
              Privacy Policy
            </Link>
            <a className="text-sm text-gray-400 hover:text-white" href="#">
              Terms of Service
            </a>
          </div>
          <div className="flex gap-4 order-2 md:order-3">
            <a className="text-gray-400 hover:text-white" href="#">
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
            <a className="text-gray-400 hover:text-white" href="#">
              <span className="material-symbols-outlined">code</span>
            </a>
            <a className="text-gray-400 hover:text-white" href="#">
              <span className="material-symbols-outlined">work</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;