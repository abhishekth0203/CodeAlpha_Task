import React from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { BookOpen, Calendar, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const BorrowingHistoryPage: React.FC = () => {
  const { books } = useLibrary();
  
  // Get all borrowed books
  const borrowedBooks = books.filter(book => book.borrowed?.isLoaned);
  const hasHistory = borrowedBooks.length > 0;
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary-800">
        Borrowing History
      </h1>
      
      {hasHistory ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Loaned To
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Loan Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Expected Return
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {borrowedBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-7 flex-shrink-0 overflow-hidden rounded">
                          <img 
                            src={book.coverImage} 
                            alt={`Cover of ${book.title}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <Link 
                            to={`/book/${book.id}`}
                            className="text-sm font-medium text-secondary-900 hover:text-primary-600"
                          >
                            {book.title}
                          </Link>
                          <div className="text-xs text-secondary-500">{book.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserCheck size={16} className="text-secondary-400 mr-2" />
                        <span className="text-sm text-secondary-900">{book.borrowed?.loanedTo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={16} className="text-secondary-400 mr-2" />
                        <span className="text-sm text-secondary-900">{formatDate(book.borrowed?.loanDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-secondary-900">{formatDate(book.borrowed?.returnDate)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-secondary-100 text-secondary-800">
                        Loaned
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <BookOpen size={48} className="mx-auto text-secondary-300 mb-4" />
          <h2 className="text-xl font-medium text-secondary-700 mb-2">No Borrowing History</h2>
          <p className="text-secondary-500 mb-4">
            You don't have any books currently loaned out. When you loan a book, it will appear here.
          </p>
          <Link 
            to="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Return to Library
          </Link>
        </div>
      )}
    </div>
  );
};

export default BorrowingHistoryPage;