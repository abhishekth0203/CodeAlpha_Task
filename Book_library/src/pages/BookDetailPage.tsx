import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import BookDetail from '../components/books/BookDetail';
import { useLibrary } from '../contexts/LibraryContext';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBook } = useLibrary();
  
  // Get book by id
  const book = getBook(id || '');
  
  // If book doesn't exist, redirect to home page
  if (!book) {
    return <Navigate to="/" />;
  }
  
  return (
    <div>
      <BookDetail book={book} />
    </div>
  );
};

export default BookDetailPage;