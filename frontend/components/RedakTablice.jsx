function RedakTablice({ rez }) {
    return (
      <tr>
        <td>{rez.id}</td>
        <td>{rez.osoba.ime}</td>
        <td>{rez.osoba.prezime}</td>
        <td>{rez.karta.pocetak}</td>
        <td>{rez.karta.kraj}</td>
        <td>{rez.karta.klasa}</td>
      </tr>
    );
  }
   
  export default RedakTablice;