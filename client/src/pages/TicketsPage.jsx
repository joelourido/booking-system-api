import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
    CONFIRMED: {
      stripe: 'bg-green-500',
      badge: 'bg-green-900/50 text-green-400 border border-green-800'
    },
    PENDING: {
      stripe: 'bg-yellow-500',
      badge: 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
    },
    // Default covers ('EXPIRED' and 'CANCELLED')
    DEFAULT: {
      stripe: 'bg-red-500',
      badge: 'bg-red-900/50 text-red-400 border border-red-800'
    }
  };

export default function TicketsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    // Define colors depending on the status of the booking
  

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading Tickets...</div>;
  console.log("Booking Data:", bookings);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Tickets</h1>
          <button onClick={() => navigate("/dashboard")} className="text-gray-400 hover:text-white">
            ← Back to Movies
          </button>
        </div>

        {/* Tickets list */}
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-lg mb-4">You haven't booked any tickets yet.</p>
            <button 
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const styles = STATUS_STYLES[booking.status] || STATUS_STYLES.DEFAULT;
              return(
                <div 
                  key={booking.booking_id} 
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col md:flex-row"
                >
                  {/* Status stripe */}
                  <div className={`w-full md:w-4 ${styles.stripe}`}></div>

                  {/* Mini poster image */}
                  <div className="w-full md:w-32 h-32 md:h-auto shrink-0 relative bg-gray-900">
                    {booking.img_url ? (
                      <img 
                        src={booking.img_url} 
                        alt={booking.movie_title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      // Fallback if no image
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <span className="text-xs">No Poster</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-white">{booking.movie_title}</h2>
                        <p className="text-sm text-gray-400">
                          {new Date(booking.start_time).toLocaleDateString()} at {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                        </p>
                        <p className="text-sm text-gray-400">
                          Purchased on {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles.badge}`}>
                        {booking.status}
                      </span>
                    </div>

                    {/* Booking details */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-500 mb-1">Cinema Info</p>
                        <p className="font-medium text-gray-300">{booking.room_name}</p>
                        <p className="text-xs text-gray-500">Booking #{booking.booking_id}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 mb-1">Seats</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.seats && booking.seats.length > 0 ? (
                            booking.seats.map((seat, idx) => (
                              <span key={idx} className="bg-gray-700 px-2 py-1 rounded text-xs text-white">
                                {seat.row}{seat.number}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-600 italic text-xs">No seats recorded</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {booking.status === 'PENDING' && (
                        <button 
                          onClick={() => navigate(`/booking/${booking.booking_id}`)}
                          className="text-yellow-400 hover:text-yellow-300 text-sm font-bold underline"
                        >
                          Complete Payment →
                        </button>
                    )}
                  </div>
                </div>
                )
            })}
          </div>
        )}
      </div>
    </div>
  );
}