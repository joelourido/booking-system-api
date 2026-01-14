import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SessionPage() {
  // Session id 
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [seats, setSeats] = useState([]);
  // Array of seats id 
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Get session details
        const sessionRes = await axios.get(`http://localhost:3000/api/sessions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSession(sessionRes.data);

        // Get seat map
        const seatsRes = await axios.get(`http://localhost:3000/api/sessions/${id}/seats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSeats(seatsRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Could not load session data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Toggle seat selection ---
  const handleSeatClick = (seat) => {
    // If seat is taken, do nothing
    if (seat.status === 'TAKEN') return;

    // Check if already selected
    const isSelected = selectedSeats.includes(seat.seat_id);

    if (isSelected) {
      // Unselect, remove seat from array
      setSelectedSeats(selectedSeats.filter(id => id !== seat.seat_id));
    } else {
      // Select: Add to array
      setSelectedSeats([...selectedSeats, seat.seat_id]);
    }
  };

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Create the PENDING booking
      const response = await axios.post('http://localhost:3000/api/bookings', {
        session_id: session.session_id,
        seat_ids: selectedSeats
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Extract the new Booking ID from the backend response
      const { booking_id } = response.data;

      // Redirect to the Payment/Confirmation page
      navigate(`/booking/${booking_id}`);

    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 409) {
        alert("Oh no! Someone just took those seats. Please pick others.");
      } else {
        alert("Booking failed. Please try again.");
      }
    }
  };

  // Organize the seats into rows
  const rows = [...new Set(seats.map(s => s.row))].sort();


  if (loading) return <div className="text-white text-center mt-20">Loading Seat Map...</div>;
  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">← Back</button>
        <h1 className="text-2xl font-bold">Select Seats</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Screen visual */}
      <div className="w-full max-w-3xl mb-12 flex flex-col items-center">
        <div className="w-full h-2 bg-gray-500 rounded-full mb-2 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"></div>
        <p className="text-gray-500 text-sm tracking-widest uppercase">Screen</p>
      </div>

      {/* Seat grid */}
      <div className="flex flex-col gap-4 mb-12">
        {rows.map(rowLabel => (
          <div key={rowLabel} className="flex items-center gap-4">
            {/* Row label */}
            <div className="w-8 text-gray-400 font-bold text-center">{rowLabel}</div>
            
            {/* Seats in the row */}
            <div className="flex gap-2">
              {seats
                .filter(s => s.row === rowLabel)
                .sort((a, b) => a.seat_number - b.seat_number)
                .map(seat => {
                  const isSelected = selectedSeats.includes(seat.seat_id);
                  const isTaken = seat.status === 'TAKEN';
                  
                  // Dynamic classes based on status
                  let seatColor = "bg-gray-700 hover:bg-gray-600 cursor-pointer"; // Default color
                  if (isTaken) seatColor = "bg-red-900 cursor-not-allowed opacity-50";
                  if (isSelected) seatColor = "bg-green-500 hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]";

                  return (
                    <button
                      key={seat.seat_id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={isTaken}
                      className={`w-10 h-10 rounded-t-lg text-xs font-medium transition-all duration-200 ${seatColor}`}
                      title={`Row ${seat.row} Seat ${seat.seat_number}`}
                    >
                      {seat.seat_number}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-8 mb-8 text-sm text-gray-400">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-700 rounded"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div> Selected</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-900 rounded"></div> Taken</div>
      </div>

      {/* Footer / Confirm Button */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 border-t border-gray-700 p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">${selectedSeats.length * 12}.00</p>
            </div>
            <button 
              onClick={handleBooking}
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-transform transform active:scale-95"
            >
              Confirm Booking ({selectedSeats.length})
            </button>
          </div>
        </div>
      )}

    </div>
  );
}