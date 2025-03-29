import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Tablica from "../components/Tablica";
import UnosForma from "../components/UnosForma";
import Brisanje from "../components/Brisanje";
import Promjena from "../components/Promjena";

function App() {
  const [rezervacije, postaviRezervacije] = useState([]);
  const [lastId, setLastId] = useState(3);  // Pretpostavljamo da već imamo 3 rezervacije u početnom stanju
  
  useEffect(() => {
    axios
      .get("http://localhost:3001/rezervacije/")
      .then(res => {
        postaviRezervacije(res.data);
        // Ažuriraj zadnji ID na temelju podataka koje već imaš
        if (res.data.length > 0) {
          const maxId = Math.max(...res.data.map(item => Number(item.id)));
          setLastId(maxId);
        }
      });
  }, []);

  // Funkcija za dodavanje nove rezervacije
  const dodajRezervaciju = (novaRezervacija) => {
    const novaRezervacijaSaId = {
      ...novaRezervacija,
      id: (lastId + 1).toString(),  // Generiranje id na temelju posljednjeg
    };

    // Simulacija slanja podataka (spremanje u stanje, a u stvarnoj aplikaciji možeš koristiti axios za backend)
    postaviRezervacije([...rezervacije, novaRezervacijaSaId]);

    // Ažuriraj zadnji ID za sljedeći unos
    setLastId(lastId + 1);
  };

  return (
    <div className="App">
      <h2>Popis rezervacija</h2>
      <Tablica rezervacije={rezervacije} />
      <h2>Nova rezervacija</h2>
      <UnosForma dodaj={dodajRezervaciju} />
      <h2>Brisanje</h2>
      <Brisanje promjena={postaviRezervacije} />
    </div>
  );
}

export default App;
