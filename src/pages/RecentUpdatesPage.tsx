import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentChanges, getCoverUrl } from '../services/api';
import { BookOpen, User, Clock, Calendar, RefreshCw } from 'lucide-react';

interface RecentChange {
  key: string;
  timestamp: string;
  kind: string;
  title?: string;
  author?: string;
  comment?: string;
  cover_id?: number;
}

const RecentUpdatesPage = () => {
  const [changes, setChanges] = useState<RecentChange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchRecentChanges = async () => {
    try {
      const data = await getRecentChanges();
      // Filter for relevant changes
      const relevantChanges = data
        .filter((change: any) => 
          (change.kind === 'work' || change.kind === 'edition' || change.kind === 'author') && 
          (change.comment || change.title)
        )
        .slice(0, 50);
      setChanges(relevantChanges);
    } catch (error) {
      console.error('Failed to fetch recent changes:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecentChanges();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRecentChanges();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleItemClick = (change: RecentChange) => {
    if (change.kind === 'work') {
      navigate(`/books${change.key}`);
    } else if (change.kind === 'author') {
      navigate(`/authors${change.key}`);
    }
  };

  const getChangeIcon = (kind: string) => {
    switch (kind) {
      case 'work':
        return <BookOpen size={20} className="text-blue-500" />;
      case 'author':
        return <User size={20} className="text-purple-500" />;
      default:
        return <Clock size={20} className="text-green-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Recent Updates</h1>
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-white rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Recent Updates</h1>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center px-4 py-2 rounded-full ${
            isRefreshing 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          } transition-colors duration-200`}
        >
          <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {changes.length > 0 ? (
        <div className="space-y-4">
          {changes.map((change) => (
            <div 
              key={`${change.key}-${change.timestamp}`} 
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => handleItemClick(change)}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-md overflow-hidden flex items-center justify-center">
                {change.cover_id ? (
                  <img 
                    src={getCoverUrl(change.cover_id, 'S')} 
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getChangeIcon(change.kind)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {change.title || 'Untitled'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  <span className="capitalize">{change.kind}</span>
                  {change.comment && `: ${change.comment}`}
                </p>
              </div>
              <div className="flex items-center text-xs text-gray-400 whitespace-nowrap">
                <Calendar size={14} className="mr-1" />
                {formatTimestamp(change.timestamp)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-blue-50 rounded-lg">
          <div className="flex justify-center mb-4">
            <Clock size={48} className="text-blue-300" />
          </div>
          <h3 className="text-xl font-semibold text-blue-700 mb-2">
            No recent updates
          </h3>
          <p className="text-blue-600 mb-6">
            There are no recent updates to display at this time.
          </p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
          >
            Check Again
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentUpdatesPage;