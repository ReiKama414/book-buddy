import { useState, useEffect } from 'react';
import { getUserBookLists, saveUserBookLists, removeBookFromList } from '../services/api';
import BookshelfDisplay from '../components/BookshelfDisplay';
import { Book, Plus, List, X } from 'lucide-react';
import { UserBookStatus } from '../types';

const MyBooksPage = () => {
  const [userLists, setUserLists] = useState<UserBookStatus>({
    read: [],
    reading: [],
    wantToRead: []
  });
  const [customLists, setCustomLists] = useState<any[]>([]);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    // Load user book lists
    const lists = getUserBookLists();
    setUserLists(lists);
    
    // In a real app, custom lists would be loaded from API/localStorage
    // This is a placeholder implementation
    const storedCustomLists = localStorage.getItem('customBookLists');
    if (storedCustomLists) {
      setCustomLists(JSON.parse(storedCustomLists));
    }
  }, []);

  const handleRemoveBook = (bookKey: string, listType: 'read' | 'reading' | 'wantToRead') => {
    removeBookFromList(bookKey, listType);
    const updatedLists = getUserBookLists();
    setUserLists(updatedLists);
  };

  const handleAddCustomList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      const newList = {
        id: Date.now().toString(),
        name: newListName.trim(),
        books: []
      };
      const updatedLists = [...customLists, newList];
      setCustomLists(updatedLists);
      localStorage.setItem('customBookLists', JSON.stringify(updatedLists));
      setNewListName('');
      setShowNewListForm(false);
    }
  };

  const handleRemoveCustomList = (listId: string) => {
    const updatedLists = customLists.filter(list => list.id !== listId);
    setCustomLists(updatedLists);
    localStorage.setItem('customBookLists', JSON.stringify(updatedLists));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
            <h2 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
              <Book size={18} className="mr-2 text-purple-500" />
              My Book Lists
            </h2>
            
            <nav className="space-y-1 mb-6">
              <NavLink 
                icon={<Book size={16} />}
                text="All Books"
                active={true}
              />
              <NavLink 
                icon={<Book size={16} />}
                text="Currently Reading"
                count={userLists.reading.length}
              />
              <NavLink 
                icon={<Book size={16} />}
                text="Want to Read"
                count={userLists.wantToRead.length}
              />
              <NavLink 
                icon={<Book size={16} />}
                text="Read"
                count={userLists.read.length}
              />
            </nav>
            
            {customLists.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-sm text-gray-600 mb-2">Custom Lists</h3>
                <nav className="space-y-1">
                  {customLists.map(list => (
                    <div key={list.id} className="flex items-center justify-between group">
                      <NavLink 
                        icon={<List size={16} />}
                        text={list.name}
                        count={list.books?.length || 0}
                      />
                      <button 
                        onClick={() => handleRemoveCustomList(list.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity duration-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </nav>
              </div>
            )}
            
            {showNewListForm ? (
              <form onSubmit={handleAddCustomList} className="mb-4">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm mb-2"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button 
                    type="submit"
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200 transition-colors"
                  >
                    Create
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowNewListForm(false)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setShowNewListForm(true)}
                className="flex items-center text-sm text-purple-600 hover:text-purple-800"
              >
                <Plus size={16} className="mr-1" />
                Create new list
              </button>
            )}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Books</h1>
          <BookshelfDisplay />
        </div>
      </div>
    </div>
  );
};

// Navigation link component
const NavLink = ({ 
  icon, 
  text, 
  count, 
  active = false 
}: { 
  icon: React.ReactNode; 
  text: string; 
  count?: number;
  active?: boolean;
}) => (
  <a 
    href="#" 
    className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors duration-200 ${
      active 
        ? 'bg-purple-100 text-purple-700' 
        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
    }`}
  >
    <div className="flex items-center">
      <span className="mr-2">{icon}</span>
      <span>{text}</span>
    </div>
    {count !== undefined && (
      <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1">
        {count}
      </span>
    )}
  </a>
);

export default MyBooksPage;