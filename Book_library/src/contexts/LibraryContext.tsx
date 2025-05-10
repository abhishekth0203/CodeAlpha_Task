import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, SearchFilters } from '../types';
import { sampleBooks } from '../data/sampleBooks';

interface LibraryContextType {
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'dateAdded'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  getBook: (id: string) => Book | undefined;
  searchBooks: (filters: SearchFilters) => Book[];
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  updateBorrowStatus: (id: string, borrowed: Book['borrowed']) => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  genre: [],
  status: [],
  rating: null,
};

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  // Load sample books initially
  useEffect(() => {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      setBooks(sampleBooks);
    }
  }, []);

  // Save books to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const addBook = (bookData: Omit<Book, 'id' | 'dateAdded'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setBooks(prevBooks => [...prevBooks, newBook]);
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === id ? { ...book, ...bookData } : book
      )
    );
  };

  const deleteBook = (id: string) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };

  const getBook = (id: string) => {
    return books.find(book => book.id === id);
  };

  const updateBorrowStatus = (id: string, borrowed: Book['borrowed']) => {
    updateBook(id, { borrowed });
  };

  const searchBooks = (filters: SearchFilters): Book[] => {
    return books.filter(book => {
      // Filter by search query
      const matchesQuery = filters.query
        ? book.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          book.author.toLowerCase().includes(filters.query.toLowerCase()) ||
          book.description.toLowerCase().includes(filters.query.toLowerCase())
        : true;

      // Filter by genre
      const matchesGenre = filters.genre.length > 0
        ? filters.genre.some(genre => book.genre.includes(genre))
        : true;

      // Filter by status
      const matchesStatus = filters.status.length > 0
        ? filters.status.includes(book.status)
        : true;

      // Filter by rating
      const matchesRating = filters.rating
        ? book.rating >= filters.rating
        : true;

      return matchesQuery && matchesGenre && matchesStatus && matchesRating;
    });
  };

  const value = {
    books,
    addBook,
    updateBook,
    deleteBook,
    getBook,
    searchBooks,
    filters,
    setFilters,
    updateBorrowStatus
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};