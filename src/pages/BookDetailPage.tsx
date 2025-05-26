import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookDetails, getCoverUrl, addBookToList, getUserBookLists } from '../services/api';
import { Book, User, Tag, Calendar, BookHeart, BookOpen, BookCheck, Clock, ChevronLeft } from 'lucide-react';

const BookDetailPage = () => {
  const { key } = useParams<{ key: string }>();
  const [book, setBook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!key) return;
      
      setIsLoading(true);
      try {
        // The key from useParams includes the initial slash, but we need to add /works to make it work with the API
        const fullKey = key.startsWith('/works') ? key : `/works/${key}`;
        const data = await getBookDetails(fullKey);
        setBook(data);
        
        // Check if this book is in any of the user's lists
        const userLists = getUserBookLists();
        if (userLists.read.some(b => b.key === fullKey)) {
          setUserStatus('read');
        } else if (userLists.reading.some(b => b.key === fullKey)) {
          setUserStatus('reading');
        } else if (userLists.wantToRead.some(b => b.key === fullKey)) {
          setUserStatus('wantToRead');
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [key]);

  const handleAddToList = (listType: 'read' | 'reading' | 'wantToRead') => {
    if (!book) return;
    
    const simplifiedBook = {
      key: book.key,
      title: book.title,
      author_name: book.authors?.map((author: any) => author.name) || ['Unknown'],
      cover_i: book.covers?.[0]
    };
    
    addBookToList(simplifiedBook, listType);
    setUserStatus(listType);
  };
  
  const handleAuthorClick = (authorKey: string) => {
    navigate(`/authors${authorKey}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
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
          <Book size={48} className="mx-auto text-red-300 mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Book</h2>
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

  if (!book) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-600 hover:text-purple-800 mb-6"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back to results
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Book cover */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {book.covers?.[0] ? (
              <img 
                src={getCoverUrl(book.covers[0], 'L')} 
                alt={book.title}
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="aspect-[2/3] bg-blue-50 flex items-center justify-center">
                <Book size={64} className="text-blue-200" />
              </div>
            )}
          </div>

          {/* Book actions */}
          <div className="mt-6 space-y-3">
            <ActionButton 
              icon={<BookHeart size={18} />}
              text="Want to Read"
              active={userStatus === 'wantToRead'}
              onClick={() => handleAddToList('wantToRead')}
            />
            <ActionButton 
              icon={<BookOpen size={18} />}
              text="Currently Reading"
              active={userStatus === 'reading'}
              onClick={() => handleAddToList('reading')}
            />
            <ActionButton 
              icon={<BookCheck size={18} />}
              text="Read"
              active={userStatus === 'read'}
              onClick={() => handleAddToList('read')}
            />
          </div>
        </div>

        {/* Book details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
          
          {/* Authors */}
          <div className="mb-4">
            {book.authors ? (
              <div className="flex flex-wrap items-center gap-2">
                <User size={16} className="text-gray-500" />
                {book.authors.map((author: any, index: number) => (
                  <span key={author.key}>
                    <button 
                      onClick={() => handleAuthorClick(author.key)}
                      className="text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      {author.name}
                    </button>
                    {index < book.authors.length - 1 && ", "}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <User size={16} className="mr-2" />
                Unknown author
              </div>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">About this book</h2>
            <div className="text-gray-700 leading-relaxed">
              {book.description ? (
                typeof book.description === 'string' ? (
                  <p>{book.description}</p>
                ) : (
                  <p>{book.description.value}</p>
                )
              ) : (
                <p className="text-gray-500 italic">No description available for this book.</p>
              )}
            </div>
          </div>
          
          {/* Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Book Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {book.first_publish_date && (
                <DetailItem 
                  icon={<Calendar size={16} />}
                  label="First published"
                  value={book.first_publish_date}
                />
              )}
              {book.subjects && (
                <DetailItem 
                  icon={<Tag size={16} />}
                  label="Subjects"
                  value={book.subjects.slice(0, 5).join(", ")}
                />
              )}
              {book.number_of_pages && (
                <DetailItem 
                  icon={<Book size={16} />}
                  label="Pages"
                  value={book.number_of_pages.toString()}
                />
              )}
              {book.latest_revision && (
                <DetailItem 
                  icon={<Clock size={16} />}
                  label="Last updated"
                  value={new Date(book.latest_revision).toLocaleDateString()}
                />
              )}
            </div>
          </div>
          
          {/* Subjects/Tags */}
          {book.subjects && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {book.subjects.map((subject: string) => (
                  <button 
                    key={subject}
                    onClick={() => navigate(`/subject/${encodeURIComponent(subject.toLowerCase())}`)}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors duration-200"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Action button component
const ActionButton = ({ 
  icon, 
  text, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  text: string; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-center py-3 px-4 rounded-full transition-all duration-200 ${
      active 
        ? 'bg-purple-600 text-white hover:bg-purple-700' 
        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
    }`}
  >
    <span className="mr-2">{icon}</span>
    <span className="font-medium">{text}</span>
  </button>
);

// Detail item component
const DetailItem = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) => (
  <div className="flex items-start">
    <div className="text-gray-500 mr-2 mt-1">{icon}</div>
    <div>
      <span className="text-sm text-gray-500 block">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  </div>
);

export default BookDetailPage;