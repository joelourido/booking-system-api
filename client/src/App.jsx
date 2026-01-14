import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MoviePage from "./pages/MoviePage";
import SessionPage from "./pages/SessionPage";
import BookingSummaryPage from "./pages/BookingSummaryPage";
import TicketsPage from "./pages/TicketsPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page (default) */}
        <Route path="/" element={<LoginPage />} />

        {/* The sign up page */}
        <Route path="/register" element={<RegisterPage />} />

        {/* The dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* The movie page */}
        <Route path="/movie/:id" element={<MoviePage />} />
        
        {/* The session page */}
        <Route path="/session/:id" element={<SessionPage />} />

        {/* The booking summary page */}
        <Route path="/booking/:id" element={<BookingSummaryPage />} />

        {/* The booked tickets by the user page */}
        <Route path="/tickets" element={<TicketsPage />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App