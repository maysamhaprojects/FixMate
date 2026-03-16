/**
 * FixMate - App.jsx
 * FILE: src/App.jsx
 *
 * IMPORTANT: LanguageProvider MUST wrap BrowserRouter
 * so language state persists across all route changes.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";

/* Pages */
import LandingPage from "./pages/log";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ClientDashboard from "./pages/ClientDashboard";
import BookaPro from "./pages/BookaPro";
import SnapAnIssue from "./pages/SnapAnIssue";
import MindMap from "./pages/MindMap";
import RatePro from "./pages/RatePro";
import ProDashboard from "./pages/ProDashboard";
import ProProfile from "./pages/ProProfile";
import ManageOrders from "./pages/ManageOrders";
import ProAvailability from "./pages/ProAvailability";
import AdminDashboard from "./pages/AdminDashboard";


export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/search" element={<BookaPro />} />
          <Route path="/client/snap" element={<SnapAnIssue />} />
          <Route path="/client/mindmap" element={<MindMap />} />
          <Route path="/client/rate" element={<RatePro />} />
          <Route path="/pro/dashboard" element={<ProDashboard />} />
          <Route path="/pro/profile" element={<ProProfile />} />
          <Route path="/pro/orders" element={<ManageOrders />} />
          <Route path="/pro/availability" element={<ProAvailability />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}