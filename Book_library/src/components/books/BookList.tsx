import React, { useState } from 'react';
import { Book, SearchFilters } from '../../types';
import BookCard from './BookCard';
import { Filter, SortDesc, SortAsc, Grid, List } from 'lucide-react';
import Button from '../ui/Button';

interface BookListProps {
  books: Book[];
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
}

type SortOption = 'title' | 'author' | 'rating' | 'dateAdded';
type ViewMode = 'grid' | 'list';

const BookList: React.FC<BookListProps> = ({ books, filters, setFilters }) => {
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get all unique genres from books
  const allGenres = Array.from(new Set(books.flatMap(book => book.genre))).sort();
  
  // Get all unique statuses
  const allStatuses = ['reading', 'completed', 'to-read', 'on-hold'];

  // Handle sort change
  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('asc');
    }
  };

  // Handle filter changes
  const handleGenreFilter = (genre: string) => {
    setFilters(prev => {
      if (prev.genre.includes(genre)) {
        return { ...prev, genre: prev.genre.filter(g => g !== genre) };
      } else {
        return { ...prev, genre: [...prev.genre, genre] };
      }
    });
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => {
      if (prev.status.includes(status)) {
        return { ...prev, status: prev.status.filter(s => s !== status) };
      } else {
        return { ...prev, status: [...prev.status, status] };
      }
    });
  };

  const handleRatingFilter = (rating: number | null) => {
    setFilters(prev => ({ ...prev, rating }));
  };

  const clearFilters = () => {
    setFilters({ query: '', genre: [], status: [], rating: null });
  };

  // Sort books
  const sortedBooks = [...books].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'author':
        comparison = a.author.localeCompare(b.author);
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'dateAdded':
        comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            icon={<Filter size={16} />}
            onClick={() => setShowFilters(!showFilters)}
            className={`${showFilters ? 'bg-neutral-100' : ''}`}
          >
            Filters
          </Button>
          
          <span className="text-sm text-secondary-600">
            {books.length} {books.length === 1 ? 'book' : 'books'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm text-secondary-700">
            <span className="mr-2 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as SortOption)}
              className="bg-white border border-neutral-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="rating">Rating</option>
              <option value="dateAdded">Date Added</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="ml-1 p-1 rounded hover:bg-neutral-100"
            >
              {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
            </button>
          </div>
          
          <button
            onClick={toggleViewMode}
            className="p-2 rounded-md hover:bg-neutral-100 text-secondary-700"
          >
            {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
          </button>
        </div>
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm animate-fade-in">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-secondary-800 mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreFilter(genre)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      filters.genre.includes(genre)
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-secondary-700 hover:bg-neutral-200'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-secondary-800 mb-2">Status</h3>
              <div className="flex flex-wrap gap-2">
                {allStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={`px-2 py-1 text-xs rounded-full capitalize transition-colors ${
                      filters.status.includes(status)
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-secondary-700 hover:bg-neutral-200'
                    }`}
                  >
                    {status.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-secondary-800 mb-2">Rating</h3>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingFilter(filters.rating === rating ? null : rating)}
                    className={`p-1 rounded transition-colors ${
                      filters.rating === rating
                        ? 'text-accent-400'
                        : 'text-neutral-400 hover:text-accent-300'
                    }`}
                  >
                    <Star size={20} className={filters.rating === rating || filters.rating && rating <= filters.rating ? 'fill-accent-400' : ''} />
                  </button>
                ))}
                
                {(filters.genre.length > 0 || filters.status.length > 0 || filters.rating !== null) && (
                  <button
                    onClick={clearFilters}
                    className="ml-auto text-xs text-primary-600 hover:text-primary-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Book grid/list */}
      {sortedBooks.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {sortedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBooks.map((book) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                className="flex bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-neutral-200"
              >
                <div className="w-16 h-24 flex-shrink-0 overflow-hidden">
                  <img 
                    src={book.coverImage} 
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="ml-3 flex-grow">
                  <h3 className="font-serif text-secondary-800 font-semibold">{book.title}</h3>
                  <p className="text-sm text-secondary-600">{book.author}</p>
                  <div className="flex mt-1 items-center">
                    <Star size={14} className="text-accent-400 fill-accent-400" />
                    <span className="text-xs ml-1">{book.rating.toFixed(1)}</span>
                    <span className="mx-2 text-neutral-300">•</span>
                    <span className="text-xs text-secondary-600 capitalize">{book.status.replace('-', ' ')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-secondary-600">No books found matching your criteria</p>
          {(filters.query || filters.genre.length > 0 || filters.status.length > 0 || filters.rating) && (
            <button
              onClick={clearFilters}
              className="mt-3 text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookList;