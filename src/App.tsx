import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import BookDetailPage from "./pages/BookDetailPage";
import AuthorPage from "./pages/AuthorPage";
import SubjectPage from "./pages/SubjectPage";
import MyBooksPage from "./pages/MyBooksPage";
import ExplorePage from "./pages/ExplorePage";
import RecentUpdatesPage from "./pages/RecentUpdatesPage";

function App() {
	return (
		<Router>
			<div className="min-h-screen bg-gray-50 flex flex-col lg:pt-24 pt-36">
				<Header />
				<main className="flex-grow">
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/search" element={<SearchResultsPage />} />
						<Route path="/books/works/:key" element={<BookDetailPage />} />
						<Route path="/authors/:key" element={<AuthorPage />} />
						<Route path="/subject/:subject" element={<SubjectPage />} />
						<Route path="/my-books" element={<MyBooksPage />} />
						<Route path="/explore" element={<ExplorePage />} />
						<Route path="/recent" element={<RecentUpdatesPage />} />
					</Routes>
				</main>
				<footer className="bg-white border-t border-gray-200 py-4">
					<div className="container mx-auto px-4 text-center text-gray-500 text-sm">
						<p>BookBuddy - Discover your next favorite book</p>
						<p className="mt-1">Data provided by Open Library API</p>
						<p className="mt-1">
							&copy; {new Date().getFullYear()}{" "}
							<Link to="https://reikama-414-site-v3.vercel.app" target="_blank">
								ReiKama414
							</Link>
						</p>
					</div>
				</footer>
			</div>
		</Router>
	);
}

export default App;
