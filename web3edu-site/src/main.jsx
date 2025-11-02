import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import "./index.css";

import App from './App.jsx';
import Poe from './pages/PoE.jsx';
import Education from './pages/education/index.jsx';
import EducationGR from './pages/education/index-gr.jsx';
import NetworkCheck from './pages/education/network-check.jsx';
import NetworkCheckGR from './pages/education/network-check-gr.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/poe" element={<Poe />} />
        <Route path="/education" element={<Education />} />
        <Route path="/education-gr" element={<EducationGR />} />
        <Route path="/education/network-check" element={<NetworkCheck />} />
        <Route path="/education/network-check-gr" element={<NetworkCheckGR />} />
        {/* Add more routes as needed */}
      </Routes>
    </HashRouter>
  </React.StrictMode>
);