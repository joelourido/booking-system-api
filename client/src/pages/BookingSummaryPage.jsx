import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function BookingSummaryPage() {
  // Booking ID
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  // Simulate a payment processing delay
  const handleConfirm = async () => {
    try {
      setStatus("processing");
      const token = localStorage.getItem("token");
      
      // Call the confirm endpoint
      await api.post(`/bookings/${id}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus("success");
      
      // Go back to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);

    } catch (err) {
      console.error(err);
      alert("Payment failed or session expired.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="bg-green-600 p-4 rounded-full mb-4 text-4xl">✓</div>
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-400">See you at the movies.</p>
        <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">
          Confirm Booking #{id}
        </h1>

        <div className="space-y-4 mb-8">
          <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30 text-blue-200 text-sm">
            Please confirm your seats within <strong>10 minutes</strong> or they will be released.
          </div>
          <p className="text-gray-400 text-sm">
            Payment Method: <span className="text-white font-medium">Credit Card (Simulated)</span>
          </p>
        </div>

        <button 
          onClick={handleConfirm}
          disabled={status === "processing"}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            status === "processing" 
              ? "bg-gray-600 cursor-wait" 
              : "bg-green-600 hover:bg-green-500 shadow-lg hover:shadow-green-500/20"
          }`}
        >
          {status === "processing" ? "Processing..." : "Pay & Confirm Ticket"}
        </button>
        
        <button 
          onClick={() => navigate("/dashboard")}
          className="w-full mt-4 py-2 text-gray-500 hover:text-gray-300 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}