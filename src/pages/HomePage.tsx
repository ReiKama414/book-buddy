import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SubjectExplorer from '../components/SubjectExplorer';
import RecentUpdates from '../components/RecentUpdates';
import BookCard from '../components/BookCard';
import { searchBooks } from '../services/api';
import { Book, BookHeart, Library, Search } from 'lucide-react';
import { Book as BookType } from '../types';

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        // Fetch some popular books to display
        const result = await searchBooks('subject:bestseller');
        setFeaturedBooks(result.docs.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch featured books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleBookClick = (book: BookType) => {
    navigate(`/books${book.key}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
            Discover Your Next Favorite Book
          </h1>
          <p className="text-gray-600 mb-8">
            Explore millions of books, create reading lists, and find your perfect read.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex justify-center mt-8 space-x-6">
            <FeatureButton 
              icon={<Search size={20} />}
              text="Search Books"
              onClick={() => {}} // Just visual
            />
            <FeatureButton 
              icon={<BookHeart size={20} />}
              text="Create Lists"
              onClick={() => navigate('/my-books')}
            />
            <FeatureButton 
              icon={<Library size={20} />}
              text="Explore Topics"
              onClick={() => navigate('/explore')}
            />
          </div>
        </div>
      </div>

      {/* Featured books */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Books</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredBooks.map((book) => (
              <BookCard 
                key={book.key} 
                book={book} 
                onClick={() => handleBookClick(book)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Subjects explorer */}
      <section className="mb-12">
        <SubjectExplorer />
      </section>

      {/* Recent updates */}
      <section>
        <RecentUpdates />
      </section>
    </div>
  );
};

// Feature button component
const FeatureButton = ({ icon, text, onClick }: { icon: React.ReactNode; text: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    <div className="text-purple-500 mb-2">{icon}</div>
    <span className="text-sm font-medium text-gray-700">{text}</span>
  </button>
);

export default HomePage;