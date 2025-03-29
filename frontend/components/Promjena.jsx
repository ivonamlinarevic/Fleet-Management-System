import axios from "axios";

function Promjena() {
 function saljiZahtjev() {
 axios.patch("http://localhost:3001/klase/4b34", {
 oznaka: "P",
 })
 .then(rez => console.log(rez))
 }
 return <button onClick={saljiZahtjev}>Promjena kategorije</button>;
}

export default Promjena;
