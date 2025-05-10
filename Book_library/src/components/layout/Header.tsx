import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, Search, X } from 'lucide-react';
import SearchBar from '../ui/SearchBar';
import { useLibrary } from '../../contexts/LibraryContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { filters, setFilters } = useLibrary();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearch = (query: string) => {
    setFilters({ ...filters, query });
    setIsSearchOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-primary-600"
          onClick={() => setIsMenuOpen(false)}
        >
          <BookOpen size={28} className="text-primary-600" />
          <span className="font-serif font-bold text-xl">Book Library</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link 
            to="/" 
            className={`font-medium ${location.pathname === '/' ? 'text-primary-600' : 'text-secondary-800 hover:text-primary-500'} transition-colors`}
          >
            Library
          </Link>
          <Link 
            to="/add" 
            className={`font-medium ${location.pathname === '/add' ? 'text-primary-600' : 'text-secondary-800 hover:text-primary-500'} transition-colors`}
          >
            Add Book
          </Link>
          <Link 
            to="/history" 
            className={`font-medium ${location.pathname === '/history' ? 'text-primary-600' : 'text-secondary-800 hover:text-primary-500'} transition-colors`}
          >
            Borrowing History
          </Link>
          <button 
            onClick={toggleSearch}
            className="p-2 rounded-full hover:bg-neutral-50 transition-colors text-secondary-800"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </nav>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center space-x-1">
          <button 
            onClick={toggleSearch}
            className="p-2 rounded-full hover:bg-neutral-50 transition-colors text-secondary-800"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-neutral-50 transition-colors text-secondary-800"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 animate-slide-up">
          <nav className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`font-medium ${location.pathname === '/' ? 'text-primary-600' : 'text-secondary-800'} py-2`}
              onClick={toggleMenu}
            >
              Library
            </Link>
            <Link 
              to="/add" 
              className={`font-medium ${location.pathname === '/add' ? 'text-primary-600' : 'text-secondary-800'} py-2`}
              onClick={toggleMenu}
            >
              Add Book
            </Link>
            <Link 
              to="/history" 
              className={`font-medium ${location.pathname === '/history' ? 'text-primary-600' : 'text-secondary-800'} py-2`}
              onClick={toggleMenu}
            >
              Borrowing History
            </Link>
          </nav>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md border-t border-neutral-100 animate-slide-up p-4">
          <SearchBar 
            onSearch={handleSearch} 
            initialValue={filters.query}
            onClose={toggleSearch}
          />
        </div>
      )}
    </header>
  );
};

export default Header;