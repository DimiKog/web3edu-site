import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Poe from './pages/PoE.jsx';
import Education from './pages/education/index.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/poe" element={<Poe />} />
        <Route path="/education" element={<Education />} />
        {/* Add more routes here as needed */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);