import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
      <footer className="bg-secondary-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="font-serif font-bold text-lg">Book Library</span>
              <span className="text-sm">© {new Date().getFullYear()}</span>
            </div>
            <div className="text-sm text-secondary-200">
              Your personal library
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;