import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // State for loading and cold-start message
  const [loading, setLoading] = useState(false);
  const [showWakeUp, setShowWakeUp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    // Clear previous errors
    setError("");
    setLoading(true);
    setShowWakeUp(false);

    // Set up timer to show message if the server is offline (cold start)
    const timer = setTimeout(() => {
      setShowWakeUp(true);
    }, 3000);
    
    try {
      // Send data to backend
      const response = await api.post("/auth/login", {
        email: email,
        password: password
      });

      // Save the token
      localStorage.setItem("token", response.data.token);

      // Navigate to Dashboard
      navigate("/dashboard");

    } catch (err) {
      // If backend sends an error, displays it.
      setError(err.response?.data?.error || "Login failed");
    } finally {
      // Clear the timer and reset loading state when done
      clearTimeout(timer);
      setLoading(false);
      setShowWakeUp(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-gray-400">Sign in to manage your bookings</p>
        </div>

        {/* --- Cold start message (only shows after 3s delay) --- */}
        {showWakeUp && (
          <div className="bg-blue-500/10 border border-blue-500 text-blue-400 p-4 rounded-lg text-sm text-center animate-pulse">
            <p className="font-bold">Server Waking Up...</p>
            <p className="mt-1">
              This server is hosted in a free tier, it sleeps when inactive.
              Please allow <span className="font-bold text-white">40-80 seconds</span> for the initial login.
            </p>
          </div>
        )}

        {/* Error message box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-400"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition duration-200"
          >
            Sign In
          </button>
        </form>

        {/* Link to register sign up page  */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}