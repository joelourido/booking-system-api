import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page (Default) */}
        <Route path="/" element={<LoginPage />} />

        {/* The Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App