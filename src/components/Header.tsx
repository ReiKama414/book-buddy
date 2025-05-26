import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Book, Home, Grid, Bookmark } from "lucide-react";
import SearchBar from "./SearchBar";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navigate = useNavigate();

	const handleSearch = (query: string) => {
		navigate(`/search?q=${encodeURIComponent(query)}`);
	};

	return (
		<header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-100 via-purple-100 to-yellow-100 shadow-sm z-50">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<Link to="/" className="flex items-center space-x-2">
						<Book className="h-8 w-8 text-purple-500" />
						<span className="text-xl font-bold text-purple-700 font-quicksand">BookBuddy</span>
					</Link>

					<div className="hidden lg:block flex-grow mx-8">
						<SearchBar onSearch={handleSearch} />
					</div>

					<nav className="hidden lg:flex items-center space-x-1">
						<NavLink to="/" icon={<Home size={18} />} text="Home" />
						<NavLink to="/explore" icon={<Grid size={18} />} text="Explore" />
						<NavLink to="/my-books" icon={<Bookmark size={18} />} text="My Books" />
						<NavLink to="/recent" icon={<Book size={18} />} text="Recent" />
					</nav>

					<button className="lg:hidden text-purple-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
						</svg>
					</button>
				</div>

				{/* Mobile search bar */}
				<div className="mt-4 lg:hidden">
					<SearchBar onSearch={handleSearch} />
				</div>

				{/* Mobile menu */}
				<div
					className={`overflow-hidden transition-all duration-300 ease-in-out ${
						isMenuOpen ? "max-h-96 opacity-100 mt-4 lg:hidden" : "max-h-0 opacity-0"
					}`}>
					<nav className="flex flex-col space-y-2">
						<MobileNavLink to="/" icon={<Home size={18} />} text="Home" onClick={() => setIsMenuOpen(false)} />
						<MobileNavLink
							to="/explore"
							icon={<Grid size={18} />}
							text="Explore"
							onClick={() => setIsMenuOpen(false)}
						/>
						<MobileNavLink
							to="/my-books"
							icon={<Bookmark size={18} />}
							text="My Books"
							onClick={() => setIsMenuOpen(false)}
						/>
						<MobileNavLink to="/recent" icon={<Book size={18} />} text="Recent" onClick={() => setIsMenuOpen(false)} />
					</nav>
				</div>
			</div>
		</header>
	);
};

// Desktop Navigation Link
const NavLink = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => (
	<Link
		to={to}
		className="flex items-center px-3 py-2 rounded-full text-purple-600 hover:bg-purple-100 transition-colors duration-200">
		<span className="mr-1">{icon}</span>
		<span>{text}</span>
	</Link>
);

// Mobile Navigation Link
const MobileNavLink = ({
	to,
	icon,
	text,
	onClick,
}: {
	to: string;
	icon: React.ReactNode;
	text: string;
	onClick: () => void;
}) => (
	<Link
		to={to}
		className="flex items-center px-4 py-3 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors duration-200"
		onClick={onClick}>
		<span className="mr-2">{icon}</span>
		<span>{text}</span>
	</Link>
);

export default Header;
