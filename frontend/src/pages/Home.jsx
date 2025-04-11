import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Dobrodošli u sustav za upravljanje voznim parkom</h1>
      <p>Ovdje možete upravljati vozilima, rezervacijama, i pregledavati status vaših zahtjeva.</p>
      <div className="home-actions">
        <button onClick={() => window.location.href = '/vehicles'}>Pregledaj vozila</button>
        <button onClick={() => window.location.href = '/profile'}>Moj profil</button>
      </div>
    </div>
  );
};

export default Home;
