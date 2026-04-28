import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Common/Home";
import Services from "../pages/Common/Services";
import How from "../pages/Common/How";
import About from "../pages/Common/About";
import Help from "../pages/Common/Help";
import FAQ from "../pages/Common/FAQ";
import NotFound from "../pages/Common/NotFound";
import RequestAssistance from "../pages/Common/RequestAssistance";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Profile from "../pages/User/Profile";
import History from "../pages/User/History";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/how" element={<How />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/request" element={<RequestAssistance />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};




export default AppRoutes;