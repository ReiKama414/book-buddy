import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopularSubjects } from '../services/api';
import { Book, Search } from 'lucide-react';
import { Subject } from '../types';

const ExplorePage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getPopularSubjects();
        setSubjects(data.subjects);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectClick = (subject: Subject) => {
    navigate(`/subject/${encodeURIComponent(subject.name.toLowerCase())}`);
  };

  // Generate a color based on the subject name
  const getSubjectColor = (name: string, index: number) => {
    const colors = [
      'from-blue-100 to-blue-200 text-blue-800',
      'from-purple-100 to-purple-200 text-purple-800',
      'from-yellow-100 to-yellow-200 text-yellow-800',
      'from-pink-100 to-pink-200 text-pink-800',
      'from-green-100 to-green-200 text-green-800',
      'from-orange-100 to-orange-200 text-orange-800',
      'from-indigo-100 to-indigo-200 text-indigo-800',
      'from-teal-100 to-teal-200 text-teal-800',
    ];
    
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Explore Subjects</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="animate-pulse h-40 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Explore Subjects</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover books by your favorite topics and genres. Click on any subject to see related books.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject, index) => (
          <div 
            key={subject.name}
            onClick={() => handleSubjectClick(subject)}
            className={`bg-gradient-to-r ${getSubjectColor(subject.name, index)} p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{subject.name}</h3>
              {/* <span className="text-sm opacity-70">{subject.count} books</span> */}
            </div>
            
            <div className="flex items-center mt-4">
              <Book size={18} className="mr-2" />
              <span className="font-medium text-sm">Explore {subject.name}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-purple-50 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-purple-800 mb-3">Can't find what you're looking for?</h2>
        <p className="text-purple-700 mb-6">
          Use the search to find specific books, authors, or topics.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center px-5 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-200"
        >
          <Search size={18} className="mr-2" />
          Search for Books
        </button>
      </div>
    </div>
  );
};

export default ExplorePage;