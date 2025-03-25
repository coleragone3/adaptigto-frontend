import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUser, SignIn } from '@clerk/clerk-react';
import LandingPage from './components/LandingPage';
import TrialSimulator from './components/TrialSimulator';
import AdminPanel from './components/AdminPanel';
import './App.css';

// Your Clerk publishable key
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'coleragone@gmail.com';

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trial" element={<TrialSimulator />} />
          <Route path="/sign-in/*" element={
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
              <SignIn routing="path" path="/sign-in" />
            </div>
          } />
          {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App; 