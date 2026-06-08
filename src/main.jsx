// Adjusted routing configuration with ProtectedRoute
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FluentProvider } from "@fluentui/react-components";
import { AuthProvider } from "./AuthContext.tsx";
import darkTheme from "./themes.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import MembershipProtectedRoute from "./MembershipProtectedRoute.tsx";
import Landing from "./pages/Landing Page/Landing.tsx";
import Tracker from "./components/organisms/TrackerPages/Tracker Page/Tracker.tsx";
import Community from "./pages/Community Page/Community.tsx";
import Membership from "./pages/Membership Page/Membership.tsx";
import Login from "./pages/Login Page/Login.tsx";
import FitnessCalendar from "./components/organisms/TrackerPages/FitnessCalendar/FitnessCalendar.tsx";
import FitnessPlans from "./components/organisms/TrackerPages/FitnessPlans/FitnessPlans.tsx";
import TrackerDashboard from "./pages/TrackerDashboard/TrackerDashboard.tsx";
import CreateAcc from "./pages/CreateAcc Page/CreateAcc.tsx";
import ForgotPassword from "./pages/ForgotPassword Page/ForgotPassword.tsx";
import ChooseMembership from "./pages/ChooseMembership Page/ChooseMembership.tsx";
import PaymentCheckout from './pages/PaymentCheckout Page/PaymentCheckout.tsx'
import Manager from "./pages/Manager Page/Manager.tsx";
import Nutrition from "./components/organisms/TrackerPages/Nutrition/Nutrition.tsx";
import Trainers from "./pages/Trainers Page/Trainers.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <FluentProvider theme={darkTheme}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/Membership" element={<Membership />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/CreateAcc" element={<CreateAcc />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/Manager" element={<Manager />} />
            <Route path="/Trainers" element={<Trainers />} />
            <Route
              path="/TrackerDashboard"
              element={
                <ProtectedRoute>
                  <TrackerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Tracker"
              element={
                <MembershipProtectedRoute>
                  <Tracker />
                </MembershipProtectedRoute>
              }
            />
            <Route
              path="/Community"
              element={
                <MembershipProtectedRoute>
                  <Community />
                </MembershipProtectedRoute>
              }
            />
            <Route
              path="/FitnessCalendar"
              element={
                <ProtectedRoute>
                  <FitnessCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/FitnessPlans"
              element={
                <ProtectedRoute>
                  <FitnessPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Nutrition"
              element={
                <ProtectedRoute>
                  <Nutrition />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ChooseMembership"
              element={
                <ProtectedRoute>
                  <ChooseMembership />
                </ProtectedRoute>
              }
            />
            <Route
              path="/PaymentCheckout"
              element={
                <ProtectedRoute>
                  <PaymentCheckout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </FluentProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);