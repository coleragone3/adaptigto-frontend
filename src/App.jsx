import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import LandingPage from './components/LandingPage';
import TrialSimulator from './components/TrialSimulator';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'coleragone@gmail.com';

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trial" element={<TrialSimulator />} />
          {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App; 