import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books, authors, or topics..."
          className="w-full pl-12 pr-14 py-4 rounded-full border-2 border-purple-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 text-gray-700 placeholder-gray-400 shadow-sm transition-all duration-300 overflow-hidden whitespace-nowrap text-ellipsis"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
          <Search size={20} />
        </div>
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-300"
        >
          <Search size={16} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;