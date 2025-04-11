import { StrictMode } from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './context/UserContext'; // Uvezi UserProvider

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UserProvider> {/* Omotaj aplikaciju s UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>
);
