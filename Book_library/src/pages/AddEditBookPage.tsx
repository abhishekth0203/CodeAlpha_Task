import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '../contexts/LibraryContext';
import { BookFormData } from '../types';
import Button from '../components/ui/Button';
import { ArrowLeftCircle, Plus, Minus } from 'lucide-react';

const AddEditBookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBook, addBook, updateBook } = useLibrary();
  const isEditing = !!id;
  
  // Default empty form data
  const emptyFormData: BookFormData = {
    title: '',
    author: '',
    coverImage: '',
    description: '',
    genre: [],
    pages: 0,
    year: new Date().getFullYear(),
    isbn: '',
    rating: 0,
    tags: [],
    status: 'to-read',
    progress: 0,
    notes: ''
  };
  
  const [formData, setFormData] = useState<BookFormData>(emptyFormData);
  const [genreInput, setGenreInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load book data if editing
  useEffect(() => {
    if (isEditing) {
      const book = getBook(id || '');
      if (book) {
        setFormData(book);
      } else {
        navigate('/');
      }
    }
  }, [id, isEditing, getBook, navigate]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle number fields
    if (name === 'pages' || name === 'year' || name === 'rating') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error if field is fixed
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as BookFormData['status'];
    const progress = status === 'completed' ? 100 : status === 'to-read' ? 0 : formData.progress;
    setFormData({ ...formData, status, progress });
  };
  
  // Handle genre input
  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genre.includes(genreInput.trim())) {
      setFormData({ ...formData, genre: [...formData.genre, genreInput.trim()] });
      setGenreInput('');
    }
  };
  
  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };
  
  // Remove a genre
  const handleRemoveGenre = (genre: string) => {
    setFormData({ ...formData, genre: formData.genre.filter(g => g !== genre) });
  };
  
  // Remove a tag
  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (!formData.coverImage) newErrors.coverImage = 'Cover image URL is required';
    if (formData.genre.length === 0) newErrors.genre = 'At least one genre is required';
    if (formData.pages <= 0) newErrors.pages = 'Pages must be greater than 0';
    if (formData.year < 1000 || formData.year > new Date().getFullYear()) {
      newErrors.year = `Year must be between 1000 and ${new Date().getFullYear()}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (isEditing) {
      updateBook(id!, formData);
      navigate(`/book/${id}`);
    } else {
      addBook(formData);
      navigate('/');
    }
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
          <span>Go Back</span>
        </button>
        
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-secondary-800 mb-6">
          {isEditing ? 'Edit Book' : 'Add New Book'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full rounded-md ${errors.title ? 'border-red-300' : 'border-neutral-300'} shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-secondary-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={`w-full rounded-md ${errors.author ? 'border-red-300' : 'border-neutral-300'} shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50`}
                />
                {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
              </div>
              
              <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-secondary-700 mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="text"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className={`w-full rounded-md ${errors.coverImage ? 'border-red-300' : 'border-neutral-300'} shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50`}
                />
                {errors.coverImage && <p className="mt-1 text-sm text-red-600">{errors.coverImage}</p>}
                {formData.coverImage && (
                  <div className="mt-2 h-40 w-28 overflow-hidden rounded border border-neutral-200">
                    <img 
                      src={formData.coverImage} 
                      alt="Book cover preview" 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/4170629/pexels-photo-4170629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Genre *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={genreInput}
                    onChange={(e) => setGenreInput(e.target.value)}
                    className="flex-grow rounded-l-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    placeholder="Add a genre"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())}
                  />
                  <button
                    type="button"
                    onClick={handleAddGenre}
                    className="rounded-r-md bg-primary-600 px-3 py-2 text-white hover:bg-primary-700"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre}</p>}
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.genre.map((genre, index) => (
                    <div 
                      key={index} 
                      className="inline-flex items-center rounded-full bg-secondary-100 px-3 py-1 text-sm text-secondary-800"
                    >
                      {genre}
                      <button
                        type="button"
                        onClick={() => handleRemoveGenre(genre)}
                        className="ml-1.5 text-secondary-600 hover:text-secondary-800"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-secondary-700 mb-1">
                  Reading Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleStatusChange}
                  className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                >
                  <option value="reading">Currently Reading</option>
                  <option value="completed">Completed</option>
                  <option value="to-read">To Read</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              
              {formData.status === 'reading' && (
                <div>
                  <label htmlFor="progress" className="block text-sm font-medium text-secondary-700 mb-1">
                    Reading Progress ({formData.progress}%)
                  </label>
                  <input
                    type="range"
                    id="progress"
                    name="progress"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={handleChange}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
              )}
            </div>
            
            {/* Right column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pages" className="block text-sm font-medium text-secondary-700 mb-1">
                    Pages
                  </label>
                  <input
                    type="number"
                    id="pages"
                    name="pages"
                    value={formData.pages}
                    onChange={handleChange}
                    min="1"
                    className={`w-full rounded-md ${errors.pages ? 'border-red-300' : 'border-neutral-300'} shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50`}
                  />
                  {errors.pages && <p className="mt-1 text-sm text-red-600">{errors.pages}</p>}
                </div>
                
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-secondary-700 mb-1">
                    Year Published
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="1000"
                    max={new Date().getFullYear()}
                    className={`w-full rounded-md ${errors.year ? 'border-red-300' : 'border-neutral-300'} shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50`}
                  />
                  {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="isbn" className="block text-sm font-medium text-secondary-700 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-secondary-700 mb-1">
                  Rating ({formData.rating}/5)
                </label>
                <input
                  type="range"
                  id="rating"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.5"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-accent-400"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-secondary-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Tags
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-grow rounded-l-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-r-md bg-primary-600 px-3 py-2 text-white hover:bg-primary-700"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div 
                      key={index} 
                      className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-sm text-accent-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1.5 text-accent-600 hover:text-accent-800"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditing ? 'Update Book' : 'Add Book'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditBookPage;