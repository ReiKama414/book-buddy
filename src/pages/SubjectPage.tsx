import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubject } from "../services/api";
import BookCard from "../components/BookCard";
import { Book, ChevronLeft } from "lucide-react";
import { Book as BookType } from "../types";

const SubjectPage = () => {
	const { subject } = useParams<{ subject: string }>();
	const [subjectData, setSubjectData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSubject = async () => {
			if (!subject) return;

			setIsLoading(true);
			try {
				const normalizedSubject = subject.replace(/\s+/g, "_");
				const data = await getSubject(normalizedSubject);
				setSubjectData(data);
			} catch (error) {
				console.error("Error fetching subject:", error);
				setError("Failed to load subject. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchSubject();
	}, [subject]);

	const handleBookClick = (book: BookType) => {
		navigate(`/books${book.key}`);
	};

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
						{[...Array(10)].map((_, i) => (
							<div key={i}>
								<div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
								<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div className="h-3 bg-gray-200 rounded w-1/2"></div>
							</div>
						))}
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
					<h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Subject</h2>
					<p className="text-red-600 mb-4">{error}</p>
					<button
						onClick={() => navigate(-1)}
						className="px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors duration-200">
						Go Back
					</button>
				</div>
			</div>
		);
	}

	if (!subjectData) return null;

	return (
		<div className="container mx-auto px-4 py-8">
			<button onClick={() => navigate(-1)} className="flex items-center text-purple-600 hover:text-purple-800 mb-6">
				<ChevronLeft size={20} className="mr-1" />
				Back
			</button>

			<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize">{subject}</h1>
				<p className="text-gray-600">{subjectData.work_count} books in this category</p>
			</div>

			{subjectData.works && subjectData.works.length > 0 ? (
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
					{subjectData.works.map((work: any) => {
						const book: BookType = {
							key: work.key,
							title: work.title,
							author_name: work.authors?.map((a: any) => a.name),
							cover_i: work.cover_id,
							first_publish_year: work.first_publish_year,
						};
						return <BookCard key={book.key} book={book} onClick={() => handleBookClick(book)} />;
					})}
				</div>
			) : (
				<div className="text-center py-12">
					<div className="flex justify-center mb-4">
						<Book size={48} className="text-gray-300" />
					</div>
					<h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
					<p className="text-gray-500 mb-6">We couldn't find any books in this subject category.</p>
					<button
						onClick={() => navigate("/")}
						className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors duration-200">
						Explore Other Subjects
					</button>
				</div>
			)}
		</div>
	);
};

export default SubjectPage;
