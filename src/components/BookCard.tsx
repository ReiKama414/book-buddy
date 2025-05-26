import { getCoverUrl } from '../services/api';
import { Book } from '../types';
import { Book as BookIcon } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const BookCard = ({ book, onClick }: BookCardProps) => {
  return (
    <div 
      className="book-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-blue-50">
        {book.cover_i ? (
          <img 
            src={getCoverUrl(book.cover_i)} 
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-blue-100">
            <BookIcon size={48} className="text-blue-300" />
            <span className="sr-only">No cover available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
          {book.author_name?.join(', ') || 'Unknown author'}
        </p>
        {book.first_publish_year && (
          <p className="text-gray-500 text-xs">{book.first_publish_year}</p>
        )}
      </div>
    </div>
  );
};

export default BookCard;