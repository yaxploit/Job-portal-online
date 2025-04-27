import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

/**
 * BaseLayout component - provides consistent layout for all pages
 * Includes the Navbar at the top and Footer at the bottom
 * Any content passed as children will appear between them
 */
export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}