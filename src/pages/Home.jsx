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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Now Showing</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map(movie => (
          <Link 
            to={`/shows/${movie._id}`} 
            state={{ movie }} 
            key={movie._id} 
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition duration-300">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-80 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-1 text-gray-900">{movie.title}</h2>
                <p className="text-sm font-semibold text-red-500 mb-2">{movie.genre}</p>
                <p className="text-gray-600 text-sm line-clamp-3">{movie.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;