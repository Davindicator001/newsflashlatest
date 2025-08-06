import React,{ useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import './App.css';
import Blog from './pages/blog';
import Home from './pages/home';
import SupportMe from './pages/support_me';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/support-me" element={<SupportMe />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Router>
    );
}

export default App;
