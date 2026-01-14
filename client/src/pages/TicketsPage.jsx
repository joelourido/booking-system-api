import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TicketsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/bookings", {
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
            {bookings.map((booking) => (
              <div 
                key={booking.booking_id} 
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col md:flex-row"
              >
                {/* Left: Status stripe */}
                <div className={`w-full md:w-4 ${
                  booking.status === 'CONFIRMED' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>

                {/* Content */}
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Booking #{booking.booking_id}</h2>
                      <p className="text-sm text-gray-400">
                        Purchased on {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      booking.status === 'CONFIRMED' 
                        ? 'bg-green-900/50 text-green-400 border border-green-800' 
                        : 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Booking details */}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500 mb-1">Session ID</p>
                      <p className="font-mono text-gray-300">{booking.session_id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Seats</p>
                      <div className="flex flex-wrap gap-2">
                        {/* Still need to implement seat/row display */}
                        {booking.seats && booking.seats.map(seatId => (
                          <span key={seatId} className="bg-gray-700 px-2 py-1 rounded text-xs text-white">
                            Seat {seatId}
                          </span>
                        ))}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}