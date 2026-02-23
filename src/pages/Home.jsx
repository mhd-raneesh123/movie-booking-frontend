import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies')
      .then(response => setMovies(response.data))
      .catch(error => console.error("Error fetching movies:", error));
  }, []);
const [searchTerm, setSearchTerm] = useState('');
const [selectedGenre, setSelectedGenre] = useState('All');

const filteredMovies = movies.filter(movie => {
  const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
  return matchesSearch && matchesGenre;
});
    const genres = ['All', ...new Set(movies.map(m => m.genre))];

return (
  <div className="p-8 bg-gray-50 min-h-screen">
    {/* Search and Filter UI */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Now Showing</h1>
      
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <input 
          type="text" 
          placeholder="Search for a movie..." 
          className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 outline-none w-full md:w-64 transition"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {genres.map(genre => (
            <button 
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                selectedGenre === genre 
                ? 'bg-red-600 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>

        {/* Movies Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {filteredMovies.length > 0 ? (
        filteredMovies.map(movie => (
          <Link 
            to={`/shows/${movie._id}`} 
            state={{ movie }} 
            key={movie._id} 
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition duration-500 border border-gray-100">
              <div className="relative overflow-hidden">
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-80 object-cover transform group-hover:scale-110 transition duration-500" />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md font-bold">
                  {movie.genre}
                </div>
              </div>
              <div className="p-5">
                        <h2 className="text-xl font-bold mb-1 text-gray-900 group-hover:text-red-600 transition">{movie.title}</h2>
                        <p className="text-sm font-semibold text-red-500 mb-2">{movie.genre}</p>
                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{movie.description}</p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="col-span-full text-center py-20">
          <p className="text-gray-400 text-xl italic font-medium">No movies found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  </div>
);
};

export default Home;