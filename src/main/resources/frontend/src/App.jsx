import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Login from "./pages/Login.jsx";
import {Home} from "lucide-react";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import HodDashboard from "./pages/HodDashboard.jsx";
import PublicVerify from "./pages/PublicVerify.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import BonafideLandingPage from "./pages/HomePage.jsx";


const App = () => {
  return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgetPassword/>} />
                <Route path="/register" element={<Register />} />
                  <Route path="/" element={<BonafideLandingPage />}/>

                  <Route
                      path="/student-dashboard"
                      element={
                      <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
                          <StudentDashboard />
                      </ProtectedRoute>
                  }/>

                  <Route
                      path="/hod"
                      element={
                      <ProtectedRoute allowedRoles={"ROLE_HOD"}>
                          <HodDashboard />
                      </ProtectedRoute>
                      }/>

                  <Route
                      path="/admin"
                      element={
                      <ProtectedRoute allowedRoles={"ROLE_ADMIN"}>
                          <AdminDashboard />
                      </ProtectedRoute>
                      }/>

                  <Route path="/verify/:token" element={<PublicVerify />} />
                  <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
        </main>
        <Footer />
      </div>
  );
}

export default App;
