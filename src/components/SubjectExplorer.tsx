import { useEffect, useState } from 'react';
import { Subject } from '../types';
import { getPopularSubjects } from '../services/api';
import SubjectBubble from './SubjectBubble';
import { useNavigate } from 'react-router-dom';

const SubjectExplorer = () => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-blue-100 h-12 w-12"></div>
          <div className="rounded-full bg-purple-100 h-12 w-20"></div>
          <div className="rounded-full bg-yellow-100 h-12 w-16"></div>
          <div className="rounded-full bg-pink-100 h-12 w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Explore by Subject</h2>
      <div className="flex flex-wrap gap-3">
        {subjects.map((subject) => (
          <SubjectBubble
            key={subject.name}
            subject={subject}
            onClick={handleSubjectClick}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectExplorer;