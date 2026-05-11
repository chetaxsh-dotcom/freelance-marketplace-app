import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ServiceDetails from "./pages/ServiceDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import PaymentHistory from "./pages/PaymentHistory";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Hire from "./pages/Hire";
import ForgotPassword from "./pages/forgotPassword";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* JOBS */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* SERVICES FIX */}
        <Route path="/services/:id" element={<ServiceDetails />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* FEATURES */}
        <Route path="/payments" element={<PaymentHistory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/hire/:id" element={<Hire />} />
        <Route path="/forgot-password" element={<ForgotPassword />}/>

        {/* PROFILE */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;