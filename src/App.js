import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import ChatBotComponent from "./ChatBotComponent";
import YogaRecommender from "./YogaRecommender";
import "./App.css"; // Import CSS file4
import Correction from "./Correction"
import React, { useState } from "react";



const App = () => {
    
    
    
    return (
<Router>
  <div className="app-container">
    <h1 className="title">🧘‍♂️ RAG-based Yoga Health Bot</h1>

    {/* Navigation Menu */}
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/" className="nav-item">🏠 Home</Link></li>
        <li><Link to="/chatbot" className="nav-item">💬 ChatBot</Link></li>
        <li><Link to="/yoga" className="nav-item">🧘 Yoga Recommender</Link></li>
        <li><Link to="/correction" className="nav-item">🧘 Correction</Link></li>
      </ul>
    </nav>

    {/* Page Content */}
    <div className="content-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<ChatBotComponent />} />
        <Route path="/yoga" element={<YogaRecommender />} />
        <Route path="/correction" element={<Correction />} />
      </Routes>
    </div>
  </div>
</Router>
    )
};

export default App;
