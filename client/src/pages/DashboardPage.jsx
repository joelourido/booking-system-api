import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/movies", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMovies(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load movies. Session might be expired.");
        setLoading(false);
      }
    };

    fetchMovies();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return <div className="text-white text-center mt-20 text-xl">Loading Movies...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        {/* Left side: Title */}
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Now Showing
        </h1>

        {/* Right side: Button group */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/tickets")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition text-sm font-medium shadow-lg shadow-blue-900/20"
          >
            My Tickets
          </button>
          
          <button 
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 px-5 py-2 rounded-full transition duration-300 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && <div className="text-red-400 text-center mb-6 bg-red-900/20 p-4 rounded-lg border border-red-900">{error}</div>}

      {/* Movie grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border border-gray-700">
            
            {/* Poster image */}
            <div className="relative h-64 overflow-hidden group">
              <img 
                src={movie.img_url} 
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
              
              {/* Year badge */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md border border-gray-600">
                {new Date(movie.release_date).getFullYear()}
              </div>
            </div>
            
            {/* Content body */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white mb-2 leading-tight">{movie.title}</h2>
                
                {/* Synopsis */}
                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                  {movie.synopsis || "No synopsis available."}
                </p>
              </div>
              
              {/* Footer information */}
              <div className="mt-auto pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="flex items-center text-gray-300">
                    <span className="mr-1">⏱</span> {movie.duration} min
                  </span>
                  
                  {/* Trailer */}
                  {movie.yt_id && (
                    <a 
                      href={`https://www.youtube.com/watch?v=${movie.yt_id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-400 hover:text-red-300 flex items-center transition-colors"
                    >
                      <span className="mr-1">▶</span> Trailer
                    </a>
                  )}
                </div>

                <button 
                  onClick={() => navigate(`/movie/${movie.movie_id}`)} 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-900/30"
                >
                  Book Tickets
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}