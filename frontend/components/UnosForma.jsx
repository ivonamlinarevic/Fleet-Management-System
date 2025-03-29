import axios from "axios";
import { useState, useEffect } from "react";
 
function UnosForma(props) {
    const [gradovi, postaviGradove] = useState([]);
    const [klase, postaviKlase] = useState([]);
    const [formaPodaci, postaviPodatke] = useState({
      ime: "",
      prezime: "",
      dob: "",
      pocetak: "",
      kraj: "",
      klasa: "",
    });
  
    function promjenaUlaza(event) {
      const { name, value } = event.target;
      postaviPodatke({ ...formaPodaci, [name]: value });
    }
  
    const saljiPodatke = event => {
      event.preventDefault();
      console.log(formaPodaci);
  
      const zaSlanje = obradiPodatke(formaPodaci);
      
      // Umjesto axios POST poziva, sada pozivamo dodaj funkciju iz App-a
      props.dodaj(zaSlanje);
    };
  
    function obradiPodatke(objekt){
      return {
        "osoba" : {
          "ime" : objekt.ime,
          "prezime": objekt.prezime,
          "dob": Number(objekt.dob)
        },
        "karta":{
          "pocetak": objekt.pocetak,
          "kraj": objekt.kraj,
          "klasa": objekt.klasa
        }
      };
    }
  
    useEffect(() => {
      Promise.all([
        axios.get("http://localhost:3001/gradovi"),
        axios.get("http://localhost:3001/klase"),
      ])
        .then(([rezGradovi, rezKlase]) => {
          postaviGradove(rezGradovi.data);
          postaviKlase(rezKlase.data);
        })
        .catch(err => console.log(err.message));
    }, []);
  
    return (
      <form onSubmit={saljiPodatke}>
        <div>
          <label>
            Ime:
            <input
              type='text'
              name='ime'
              value={formaPodaci.ime}
              onChange={promjenaUlaza}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Prezime:
            <input
              type='text'
              name='prezime'
              value={formaPodaci.prezime}
              onChange={promjenaUlaza}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Godina:
            <input
              type='number'
              name='dob'
              value={formaPodaci.dob}
              onChange={promjenaUlaza}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Početak putovanja:
            <select
              name='pocetak'
              value={formaPodaci.pocetak}
              onChange={promjenaUlaza}
              required
            >
              <option value=''>--Odaberi grad--</option>
              {gradovi.map(grad => (
                <option key={grad.id} value={grad.ime}>
                  {grad.ime}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Kraj putovanja:
            <select
              name='kraj'
              value={formaPodaci.kraj}
              onChange={promjenaUlaza}
              required
            >
              <option value=''>--Odaberi grad--</option>
              {gradovi.map(grad => (
                <option key={grad.id} value={grad.ime}>
                  {grad.ime}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Klasa:
            {klase.map(klasa => (
              <label key={klasa.oznaka}>
                <input
                  type='radio'
                  name='klasa'
                  value={klasa.oznaka}
                  checked={formaPodaci.klasa === klasa.oznaka}
                  onChange={promjenaUlaza}
                  required
                />{" "}
                {klasa.ime}
              </label>
            ))}
          </label>
        </div>
        <button type='submit'>Nova rezervacija</button>
      </form>
    );
  }
  
  export default UnosForma;
  