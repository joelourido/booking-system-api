import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // If the string doesn't have 'Z' at the end, add it to force UTC conversion
  const getLocalTime = (dateString) => {
    if (!dateString) return new Date();
    const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    return new Date(utcString);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Get movie details
        const movieRes = await api.get(`/movies/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMovie(movieRes.data);

        // Get sessions (by using query param filter)
        const sessionRes = await api.get(`/sessions?movie_id=${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setSessions(sessionRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const dateKey = getLocalTime(session.start_time).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(session);
    return acc;
  }, {});

  const allDates = Object.keys(sessionsByDate);

  // Filter the amount of days of sessions that are shown
  const uniqueDates = allDates.filter(dateString => {
    const sessionDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return sessionDate >= today && sessionDate < nextWeek;
  }).sort((a, b) => new Date(a) - new Date(b));
  

  // Auto-select the first date if none selected
  useEffect(() => {
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates, selectedDate]);

  const currentSessions = selectedDate ? sessionsByDate[selectedDate] : [];

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  if (!movie) return <div className="text-white text-center mt-20">Movie not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <button 
        onClick={() => navigate("/dashboard")} 
        className="mb-6 text-gray-400 hover:text-white flex items-center transition"
      >
        ← Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        
        {/* Left: Poster and Info */}
        <div className="lg:col-span-1 space-y-6">
          <img 
            src={movie.img_url} 
            alt={movie.title} 
            className="w-full rounded-xl shadow-2xl border border-gray-800" 
          />
          <div>
            <h1 className="text-4xl font-extrabold mb-2">{movie.title}</h1>
            <p className="text-gray-400 text-sm mb-4">
               {new Date(movie.release_date).getFullYear()} • {movie.duration} min
            </p>
            <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
          </div>
        </div>

        {/* Right: Date and Time Selection */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">
              Select Showtimes
            </h2>
            
            {uniqueDates.length === 0 ? (
               <div className="text-gray-500 italic">No sessions scheduled.</div>
            ) : (
              <>
                {/* Date tabs */}
                <div className="flex overflow-x-auto pb-4 mb-6 gap-3 scrollbar-hide">
                  {uniqueDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-5 py-3 rounded-lg whitespace-nowrap transition-all font-medium border ${
                        selectedDate === date 
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg" 
                          : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </button>
                  ))}
                </div>

                {/* Time grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {currentSessions.map((session) => (
                    <button 
                      key={session.session_id}
                      onClick={() => navigate(`/session/${session.session_id}`)}
                      className="group relative bg-gray-700 hover:bg-blue-600 border border-gray-600 hover:border-blue-500 rounded-xl p-4 transition-all"
                    >
                      <div className="text-lg font-bold text-white">
                        {getLocalTime(session.start_time).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          hour12: false 
                        })}
                      </div>
                      <div className="text-xs text-gray-400 group-hover:text-blue-200 mt-1">
                        Room {session.room_id || 1}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}