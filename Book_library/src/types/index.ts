export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  genre: string[];
  pages: number;
  year: number;
  isbn: string;
  rating: number;
  tags: string[];
  status: 'reading' | 'completed' | 'to-read' | 'on-hold';
  progress: number;
  borrowed?: {
    isLoaned: boolean;
    loanedTo?: string;
    loanDate?: string;
    returnDate?: string;
  };
  notes: string;
  dateAdded: string;
}

export type BookFormData = Omit<Book, 'id' | 'dateAdded'>;

export interface SearchFilters {
  query: string;
  genre: string[];
  status: string[];
  rating: number | null;
}