import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { FaCarSide } from 'react-icons/fa';

const Header = () => {
  const { user, logoutUser, loading } = useUser();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      logoutUser();
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <FaCarSide className="header-icon" />
        <h1 className="header-title">Fleet Management System</h1>
      </div>

      <div className="header-right">
        <NavLink to="/" className="nav-link" aria-label="Home">Home</NavLink>
        <button onClick={handleAuthClick} className="nav-button" aria-label={user ? 'Log out' : 'Log in'}>
          {user ? 'Odjava' : 'Prijava'}
        </button>
        <div className="user-email">
          {loading ? 'Loading...' : user ? user.email : 'Not logged in'}
        </div>
      </div>
    </header>
  );
};

export default Header;
