// pages/Profile.jsx
import React, { useContext } from 'react';
import UserContext from '../context/UserContext';

const Profile = () => {
  const { user, loading, logoutUser } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Molimo prijavite se</div>;

  return (
    <div>
      <h1>Dobrodošli, {user.name}</h1>
      <p>Email: {user.email}</p>
      <button onClick={logoutUser}>Odjava</button>
    </div>
  );
};

export default Profile;
