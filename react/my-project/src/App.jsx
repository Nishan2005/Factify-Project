import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";

import Home from "./pages/Home.jsx";
import Verify from "./pages/Verify.jsx";
import Result from "./pages/Result.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import About from "./pages/About.jsx";
import Research from "./pages/Research.jsx";
import Api from "./pages/Api.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/result" element={<Result />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/research" element={<Research />} />
        <Route path="/api" element={<Api />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
