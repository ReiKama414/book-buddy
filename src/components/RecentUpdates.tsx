import { useEffect, useState } from 'react';
import { getRecentChanges, getCoverUrl } from '../services/api';
import { BookOpen, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentChange {
  key: string;
  timestamp: string;
  kind: string;
  title?: string;
  cover_id?: number;
  author?: string;
  comment?: string;
}

const RecentUpdates = () => {
  const [changes, setChanges] = useState<RecentChange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentChanges = async () => {
      try {
        const data = await getRecentChanges();
        // Filter for relevant changes and limit to 10
        const relevantChanges = data
          .filter((change: any) => 
            (change.kind === 'work' || change.kind === 'edition') && change.comment
          )
          .slice(0, 10);
        setChanges(relevantChanges);
      } catch (error) {
        console.error('Failed to fetch recent changes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentChanges();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleItemClick = (change: RecentChange) => {
    if (change.kind === 'work') {
      navigate(`/books${change.key}`);
    } else if (change.kind === 'author') {
      navigate(`/authors${change.key}`);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="bg-gray-200 rounded h-16 w-16"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (changes.length === 0) {
    return (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-blue-600">No recent updates available</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Updates</h2>
      <div className="space-y-4">
        {changes.map((change) => (
          <div 
            key={change.key} 
            className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            onClick={() => handleItemClick(change)}
          >
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-md overflow-hidden">
              {change.cover_id ? (
                <img 
                  src={getCoverUrl(change.cover_id, 'S')} 
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {change.kind === 'work' ? (
                    <BookOpen size={20} className="text-blue-400" />
                  ) : (
                    <User size={20} className="text-blue-400" />
                  )}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {change.title || change.comment || 'Updated item'}
              </p>
              <p className="text-xs text-gray-500">
                {change.kind === 'work' ? 'Book' : change.kind === 'author' ? 'Author' : 'Edition'} updated
              </p>
            </div>
            <div className="flex items-center text-xs text-gray-400">
              <Clock size={14} className="mr-1" />
              {formatTimestamp(change.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUpdates;