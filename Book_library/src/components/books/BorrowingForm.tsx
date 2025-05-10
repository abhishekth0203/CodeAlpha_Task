import React, { useState } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';
import Button from '../ui/Button';
import { Book } from '../../types';

interface BorrowingFormProps {
  bookId: string;
  currentBorrowing?: Book['borrowed'];
  onClose: () => void;
}

const BorrowingForm: React.FC<BorrowingFormProps> = ({ 
  bookId, 
  currentBorrowing,
  onClose 
}) => {
  const { updateBorrowStatus } = useLibrary();
  const isReturning = currentBorrowing?.isLoaned;
  
  const [formData, setFormData] = useState({
    loanedTo: currentBorrowing?.loanedTo || '',
    loanDate: currentBorrowing?.loanDate || new Date().toISOString().split('T')[0],
    returnDate: currentBorrowing?.returnDate || '',
    isLoaned: currentBorrowing?.isLoaned || true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReturning && !formData.loanedTo) {
      // Handle book return
      updateBorrowStatus(bookId, { isLoaned: false });
    } else {
      // Handle book loan
      updateBorrowStatus(bookId, {
        isLoaned: true,
        loanedTo: formData.loanedTo,
        loanDate: formData.loanDate,
        returnDate: formData.returnDate
      });
    }
    
    onClose();
  };

  const handleReturn = () => {
    updateBorrowStatus(bookId, { isLoaned: false });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isReturning ? (
        <>
          <div className="mb-6">
            <p className="text-secondary-700 mb-4">
              This book is currently loaned to <strong>{currentBorrowing.loanedTo}</strong>.
            </p>
            <div className="flex space-x-3">
              <Button 
                type="button" 
                variant="primary"
                onClick={handleReturn}
                fullWidth
              >
                Mark as Returned
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setFormData(prev => ({ ...prev, isLoaned: true }))}
                fullWidth
              >
                Update Loan Details
              </Button>
            </div>
          </div>
        </>
      ) : null}

      {(!isReturning || formData.isLoaned) && (
        <>
          <div>
            <label htmlFor="loanedTo" className="block text-sm font-medium text-secondary-700 mb-1">
              Loaned To
            </label>
            <input
              type="text"
              id="loanedTo"
              name="loanedTo"
              value={formData.loanedTo}
              onChange={handleChange}
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              required
            />
          </div>
          
          <div>
            <label htmlFor="loanDate" className="block text-sm font-medium text-secondary-700 mb-1">
              Loan Date
            </label>
            <input
              type="date"
              id="loanDate"
              name="loanDate"
              value={formData.loanDate}
              onChange={handleChange}
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              required
            />
          </div>
          
          <div>
            <label htmlFor="returnDate" className="block text-sm font-medium text-secondary-700 mb-1">
              Expected Return Date
            </label>
            <input
              type="date"
              id="returnDate"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isReturning ? 'Update Loan' : 'Loan Book'}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default BorrowingForm;