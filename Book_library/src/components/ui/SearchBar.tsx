import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialValue = '',
  placeholder = 'Search by title, author, or description...',
  onClose
}) => {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-3 text-secondary-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 text-secondary-400 hover:text-secondary-600"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 bg-primary-600 text-white py-1 px-2 rounded text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Search
        </button>
      </div>
      
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-sm text-secondary-600 hover:text-primary-600 transition-colors"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default SearchBar;