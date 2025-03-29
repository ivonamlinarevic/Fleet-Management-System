import axios from "axios";
import { useState } from "react";

function Brisanje({ promjena }) {
  const [idPodatka, postaviId] = useState("");

  async function brisiPodatak() {
    console.log(`Brišem podatak broj ${idPodatka}`);
    
    try {
      // Slanje DELETE zahtjeva
      await axios.delete(`http://localhost:3001/rezervacije/${idPodatka}`);
      
      // Dohvati ažurirane podatke s poslužitelja
      const odgovor = await axios.get("http://localhost:3001/rezervacije");
      
      // Ažuriraj stanje u roditeljskoj komponenti
      promjena(odgovor.data);
    } catch (error) {
      console.error("Greška pri brisanju podataka:", error);
    }
  }

  return (
    <div>
      <h2>Brisanje podataka</h2>
      <div>
        <label>
          Unesite ID podatka:
          <input
            type="number"
            name="id"
            value={idPodatka}
            onChange={e => postaviId(e.target.value)}
          />
        </label>
      </div>
      <button onClick={brisiPodatak}>Obriši rezervaciju</button>
    </div>
  );
}

export default Brisanje;
