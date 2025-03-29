import RedakTablice from "./RedakTablice";
 
function Tablica({ rezervacije }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Ime</th>
          <th>Prezime</th>
          <th>Polazište</th>
          <th>Odredište</th>
          <th>Klasa</th>
        </tr>
      </thead>
      <tbody>
        {rezervacije.map(r => (
          <RedakTablice key={r.id} rez={r} />
        ))}
      </tbody>
    </table>
  );
}
 
export default Tablica;