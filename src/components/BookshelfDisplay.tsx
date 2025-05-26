import { useEffect, useState } from 'react';
import { Book } from '../types';
import BookCard from './BookCard';
import { getUserBookLists } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BookMarked, BookPlus } from 'lucide-react';

const BookshelfDisplay = () => {
  const [userBooks, setUserBooks] = useState<{
    read: Book[];
    reading: Book[];
    wantToRead: Book[];
  }>({ read: [], reading: [], wantToRead: [] });
  
  const navigate = useNavigate();

  useEffect(() => {
    const lists = getUserBookLists();
    setUserBooks(lists);
  }, []);

  const handleBookClick = (book: Book) => {
    navigate(`/books${book.key}`);
  };

  const renderShelf = (title: string, books: Book[], icon: React.ReactNode, emptyMessage: string) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="mr-2 text-purple-500">{icon}</div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <span className="ml-2 text-sm text-gray-500">({books.length})</span>
      </div>
      
      {books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <BookCard key={book.key} book={book} onClick={() => handleBookClick(book)} />
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <p className="text-blue-600 mb-2">{emptyMessage}</p>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
          >
            Discover Books
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-6">
      {renderShelf(
        "Currently Reading", 
        userBooks.reading,
        <BookOpen size={20} />,
        "You're not reading any books right now"
      )}
      
      {renderShelf(
        "Want to Read", 
        userBooks.wantToRead,
        <BookPlus size={20} />,
        "Add books you want to read in the future"
      )}
      
      {renderShelf(
        "Read", 
        userBooks.read,
        <BookMarked size={20} />,
        "Books you've finished will appear here"
      )}
    </div>
  );
};

export default BookshelfDisplay;