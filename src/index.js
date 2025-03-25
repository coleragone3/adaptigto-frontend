import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';

// Your Clerk publishable key
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

console.log('Environment:', process.env.NODE_ENV);
console.log('Clerk Key Available:', !!PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key");
  throw new Error("Missing Clerk Publishable Key");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => window.location.href = to}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

