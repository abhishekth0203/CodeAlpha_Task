import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import BookList from '../components/books/BookList';
import { SearchFilters } from '../types';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { books, searchBooks, filters, setFilters } = useLibrary();
  
  // Filter books based on search filters
  const filteredBooks = searchBooks(filters);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary-800">
          My Library
        </h1>
        
        <Link to="/add">
          <Button variant="primary" icon={<Plus size={18} />}>
            Add New Book
          </Button>
        </Link>
      </div>
      
      <BookList 
        books={filteredBooks} 
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default HomePage;