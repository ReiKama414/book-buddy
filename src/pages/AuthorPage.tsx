import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthor } from '../services/api';
import BookCard from '../components/BookCard';
import { User, Book, Calendar, MapPin, ChevronLeft } from 'lucide-react';
import { Book as BookType } from '../types';

const AuthorPage = () => {
  const { key } = useParams<{ key: string }>();
  const [author, setAuthor] = useState<any>(null);
  const [authorWorks, setAuthorWorks] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!key) return;
      
      setIsLoading(true);
      try {
        const data = await getAuthor(key);
        setAuthor(data);
        
        // In a real app, we would fetch the author's works as well
        // This is mock data for demonstration
        setAuthorWorks([
          {
            key: '/works/OL45883W',
            title: data.name ? `Best work by ${data.name}` : 'Unknown title',
            cover_i: 10583200,
            first_publish_year: data.birth_date ? parseInt(data.birth_date) + 30 : 2000
          },
          {
            key: '/works/OL45884W',
            title: data.name ? `Another work by ${data.name}` : 'Unknown title',
            cover_i: 10583201,
            first_publish_year: data.birth_date ? parseInt(data.birth_date) + 35 : 2005
          }
        ]);
      } catch (error) {
        console.error('Error fetching author:', error);
        setError('Failed to load author details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthor();
  }, [key]);

  const handleBookClick = (book: BookType) => {
    navigate(`/books${book.key}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="bg-gray-200 h-64 w-64 rounded-full mx-auto"></div>
            </div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <User size={48} className="mx-auto text-red-300 mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Author</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!author) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Author avatar */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col items-center">
          <div className="w-48 h-48 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden mb-4">
            <User size={64} className="text-purple-300" />
          </div>
          
          {/* Author metadata */}
          <div className="space-y-3 w-full">
            {author.birth_date && (
              <MetadataItem 
                icon={<Calendar size={16} />}
                label="Born"
                value={author.birth_date}
              />
            )}
            {author.death_date && (
              <MetadataItem 
                icon={<Calendar size={16} />}
                label="Died"
                value={author.death_date}
              />
            )}
            {author.location && (
              <MetadataItem 
                icon={<MapPin size={16} />}
                label="Location"
                value={author.location}
              />
            )}
          </div>
        </div>

        {/* Author details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{author.name}</h1>
          
          {/* Author bio */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Biography</h2>
            <div className="text-gray-700 leading-relaxed">
              {author.bio ? (
                typeof author.bio === 'string' ? (
                  <p>{author.bio}</p>
                ) : (
                  <p>{author.bio.value}</p>
                )
              ) : (
                <p className="text-gray-500 italic">No biography available for this author.</p>
              )}
            </div>
          </div>
          
          {/* Author works */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Books by {author.name}</h2>
            {authorWorks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {authorWorks.map((book) => (
                  <BookCard 
                    key={book.key} 
                    book={book} 
                    onClick={() => handleBookClick(book)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No books available for this author.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Metadata item component
const MetadataItem = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) => (
  <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
    <div className="text-purple-500 mr-3">{icon}</div>
    <div>
      <span className="text-xs text-gray-500 block">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  </div>
);

export default AuthorPage;