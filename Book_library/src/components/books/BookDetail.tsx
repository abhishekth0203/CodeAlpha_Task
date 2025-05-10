import React, { useState } from 'react';
import { Book } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Star, Edit, Trash2, Users, BookOpen, ArrowLeftCircle, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useLibrary } from '../../contexts/LibraryContext';
import BorrowingForm from './BorrowingForm';

interface BookDetailProps {
  book: Book;
}

const BookDetail: React.FC<BookDetailProps> = ({ book }) => {
  const navigate = useNavigate();
  const { updateBook, deleteBook } = useLibrary();
  const [showBorrowingForm, setShowBorrowingForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value);
    updateBook(book.id, { progress: newProgress });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateBook(book.id, { 
      status: e.target.value as Book['status'],
      progress: e.target.value === 'completed' ? 100 : book.progress
    });
  };

  const handleDelete = () => {
    deleteBook(book.id);
    navigate('/');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 md:p-6">
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-secondary-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <ArrowLeftCircle size={16} className="mr-1" />
          <span>Back to Library</span>
        </button>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Book cover */}
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-md relative">
              <img 
                src={book.coverImage} 
                alt={`Cover of ${book.title}`} 
                className="w-full h-full object-cover"
              />
              {book.borrowed?.isLoaned && (
                <div className="absolute top-0 right-0 bg-secondary-600 text-white px-3 py-1 text-sm font-semibold">
                  Loaned
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-4">
              {book.status === 'reading' && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-secondary-700">Reading Progress</span>
                    <span className="text-sm text-secondary-600">{book.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={book.progress}
                    onChange={handleProgressChange}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-secondary-700 mb-1">
                  Reading Status
                </label>
                <select
                  id="status"
                  value={book.status}
                  onChange={handleStatusChange}
                  className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                >
                  <option value="reading">Currently Reading</option>
                  <option value="completed">Completed</option>
                  <option value="to-read">To Read</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              
              <div className="flex flex-col space-y-2">
                {book.borrowed?.isLoaned ? (
                  <Button 
                    variant="secondary" 
                    fullWidth 
                    onClick={() => setShowBorrowingForm(true)}
                  >
                    Update Loan
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    fullWidth 
                    icon={<Users size={16} />}
                    onClick={() => setShowBorrowingForm(true)}
                  >
                    Loan This Book
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  fullWidth
                  icon={<Edit size={16} />}
                  onClick={() => navigate(`/edit/${book.id}`)}
                >
                  Edit Book
                </Button>
                
                <Button 
                  variant="danger"
                  fullWidth
                  icon={<Trash2 size={16} />}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Book
                </Button>
              </div>
            </div>
          </div>
          
          {/* Book details */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary-800 mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-secondary-600 mb-4">{book.author}</p>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={20} 
                    className={`${star <= book.rating ? 'text-accent-400 fill-accent-400' : 'text-neutral-300'} mr-1`} 
                  />
                ))}
              </div>
              <span className="ml-2 text-secondary-600">({book.rating.toFixed(1)})</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {book.genre.map((genre, index) => (
                <Badge key={index} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="prose max-w-none mb-8">
              <h3 className="text-lg font-medium text-secondary-800 mb-2">Description</h3>
              <p className="text-secondary-700">{book.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="text-lg font-medium text-secondary-800 mb-2">Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-secondary-600">Pages</dt>
                    <dd className="font-medium text-secondary-800">{book.pages}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-secondary-600">Published</dt>
                    <dd className="font-medium text-secondary-800">{book.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-secondary-600">ISBN</dt>
                    <dd className="font-medium text-secondary-800">{book.isbn}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-secondary-600">Added to Library</dt>
                    <dd className="font-medium text-secondary-800">{new Date(book.dateAdded).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
              
              {book.borrowed?.isLoaned && (
                <div>
                  <h3 className="text-lg font-medium text-secondary-800 mb-2">Borrowing Details</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-secondary-600">Loaned To</dt>
                      <dd className="font-medium text-secondary-800">{book.borrowed.loanedTo}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-secondary-600">Loan Date</dt>
                      <dd className="font-medium text-secondary-800">
                        {book.borrowed.loanDate ? new Date(book.borrowed.loanDate).toLocaleDateString() : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-secondary-600">Return Date</dt>
                      <dd className="font-medium text-secondary-800">
                        {book.borrowed.returnDate ? new Date(book.borrowed.returnDate).toLocaleDateString() : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
            
            {book.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-secondary-800 mb-2">Notes</h3>
                <p className="text-secondary-700 bg-neutral-50 p-3 rounded-md border border-neutral-200">{book.notes}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {book.tags.map((tag, index) => (
                <Badge key={index} variant="accent" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Borrowing form modal */}
      {showBorrowingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-6">
              <h2 className="text-xl font-serif font-bold text-secondary-800 mb-4">
                {book.borrowed?.isLoaned ? 'Update Loan Details' : 'Loan This Book'}
              </h2>
              <BorrowingForm 
                bookId={book.id}
                currentBorrowing={book.borrowed}
                onClose={() => setShowBorrowingForm(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-6">
              <h2 className="text-xl font-serif font-bold text-secondary-800 mb-4">
                Delete Book
              </h2>
              <p className="text-secondary-700 mb-6">
                Are you sure you want to delete "{book.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;