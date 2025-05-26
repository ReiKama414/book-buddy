import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchBooks } from '../services/api';
import BookCard from '../components/BookCard';
import { Book } from '../types';
import { Search, BookX, Filter, X } from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setIsLoading(true);
      try {
        const data = await searchBooks(query);
        setResults(data.docs);
        setTotalResults(data.numFound);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleBookClick = (book: Book) => {
    navigate(`/books${book.key}`);
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  // Sample filters (in a real app, these would be generated from API data)
  const availableFilters = {
    'Fiction': true,
    'Non-fiction': true,
    'Fantasy': true,
    'Science Fiction': true,
    'Mystery': true,
    'Biography': true,
    'History': true,
    'Romance': true,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          Found {isLoading ? '...' : totalResults} books matching your search
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Mobile Toggle */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
          >
            <Filter size={16} className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Panel */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Filters</h3>
              {activeFilters.length > 0 && (
                <button 
                  onClick={clearFilters}
                  className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                >
                  Clear all <X size={14} className="ml-1" />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Genres</h4>
                <div className="space-y-2">
                  {Object.entries(availableFilters).map(([filter, _]) => (
                    <label key={filter} className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={activeFilters.includes(filter)}
                        onChange={() => toggleFilter(filter)}
                        className="rounded text-purple-500 focus:ring-purple-400"
                      />
                      <span className="ml-2 text-sm text-gray-700">{filter}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((book) => (
                <BookCard 
                  key={book.key} 
                  book={book} 
                  onClick={() => handleBookClick(book)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <BookX size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No books found
              </h3>
              <p className="text-gray-500 mb-6">
                We couldn't find any books matching "{query}"
              </p>
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors duration-200"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;