import React from 'react';
import Auth from './Components/Auth/Auth';
import AdminDash from './Components/Dashboard/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/Dashboard" element={<AdminDash />} />
      </Routes>
    </Router>
  );
}

export default App;
