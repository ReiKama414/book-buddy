import { Subject } from '../types';

interface SubjectBubbleProps {
  subject: Subject;
  onClick: (subject: Subject) => void;
}

const SubjectBubble = ({ subject, onClick }: SubjectBubbleProps) => {
  // Generate a pastel background color based on the subject name
  const getColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-yellow-100 text-yellow-700 border-yellow-200',
      'bg-pink-100 text-pink-700 border-pink-200',
      'bg-green-100 text-green-700 border-green-200',
      'bg-orange-100 text-orange-700 border-orange-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-teal-100 text-teal-700 border-teal-200',
    ];

    // Simple hash function to determine color index
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const colorClasses = getColor(subject.name);

  return (
    <div
      className={`subject-bubble ${colorClasses} px-4 py-2 rounded-full border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center justify-between`}
      onClick={() => onClick(subject)}
    >
      <span className="font-medium">{subject.name}</span>
      {/* <span className="ml-2 text-xs opacity-70">{subject.count}</span> */}
    </div>
  );
};

export default SubjectBubble;