'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import RecommendedProfiles from '../components/RecommendedProfiles';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar - hidden on mobile unless toggled */}
        <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out w-64 bg-white shadow-lg pt-16' : 'w-64 border-r border-gray-200'} ${isMobile && !showSidebar ? '-translate-x-full' : 'translate-x-0'}`}>
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-5">
            {children}
          </div>
        </div>

        {/* Right Sidebar - hidden on mobile */}
        <div className="hidden lg:block w-80 border-l border-gray-200 overflow-auto">
          <div className="p-4">
            <RecommendedProfiles />
          </div>
        </div>
      </div>

      {/* Mobile Navigation at bottom */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 z-40">
          <button className="text-primary flex flex-col items-center text-xs">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            Hem
          </button>
          <button className="text-gray-600 flex flex-col items-center text-xs">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
            </svg>
            Chatt
          </button>
          <button className="text-gray-600 flex flex-col items-center text-xs">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.419-4.419-4.419 4.419A1 1 0 014 16V4zm5 0a1 1 0 00-1 1v6.586l.293-.293a1 1 0 011.414 0l.293.293V5a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            Flöde
          </button>
          <button className="text-gray-600 flex flex-col items-center text-xs">
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
            Profil
          </button>
        </div>
      )}

      {/* Overlay when mobile sidebar is open */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
} 