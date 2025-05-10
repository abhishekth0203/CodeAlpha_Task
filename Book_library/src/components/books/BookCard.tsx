import React from 'react';
import { Book } from '../../types';
import { Link } from 'react-router-dom';
import { BookOpen, Star, BookMarked, Users } from 'lucide-react';
import Badge from '../ui/Badge';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  // Get status display properties
  const getStatusProps = () => {
    switch (book.status) {
      case 'reading':
        return { text: 'Reading', variant: 'primary' as const, icon: <BookOpen size={14} /> };
      case 'completed':
        return { text: 'Completed', variant: 'secondary' as const, icon: <BookMarked size={14} /> };
      case 'to-read':
        return { text: 'To Read', variant: 'accent' as const, icon: <BookOpen size={14} /> };
      case 'on-hold':
        return { text: 'On Hold', variant: 'default' as const, icon: <BookOpen size={14} /> };
      default:
        return { text: 'Unknown', variant: 'default' as const, icon: null };
    }
  };

  const { text: statusText, variant: statusVariant, icon: statusIcon } = getStatusProps();

  return (
    <Link
      to={`/book/${book.id}`}
      className="group bg-white rounded-lg shadow-sm overflow-hidden border border-neutral-200 hover:shadow-md transition-all duration-200 flex flex-col h-full"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        {book.borrowed?.isLoaned && (
          <div className="absolute top-0 right-0 bg-secondary-600 text-white px-2 py-1 text-xs font-semibold">
            Loaned
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="font-serif font-bold text-lg text-secondary-800 group-hover:text-primary-600 transition-colors mb-1">
            {book.title}
          </h3>
          <p className="text-sm text-secondary-600 mb-2">{book.author}</p>
          
          <div className="flex items-center space-x-1 mb-3">
            <Star size={16} className="text-accent-400 fill-accent-400" />
            <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
          </div>
          
          <div className="mb-3 flex flex-wrap gap-1">
            {book.genre.slice(0, 2).map((genre, index) => (
              <Badge key={index} variant="secondary" size="sm">
                {genre}
              </Badge>
            ))}
            {book.genre.length > 2 && (
              <Badge size="sm">+{book.genre.length - 2}</Badge>
            )}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {statusIcon}
              <span className="text-xs font-medium">{statusText}</span>
            </div>
            
            {book.borrowed?.isLoaned && (
              <div className="flex items-center space-x-1 text-xs text-secondary-600">
                <Users size={14} />
                <span>{book.borrowed.loanedTo}</span>
              </div>
            )}
          </div>
          
          {book.status === 'reading' && (
            <div className="mt-2">
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full" 
                  style={{ width: `${book.progress}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-right text-secondary-600">
                {book.progress}%
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;