import { useState } from "react";
import axios from "axios"

function App() {
 const [podatak, postaviPodatak] = useState({
 body: "",
 id: null,
 title: "",
 userId: null,
 });

/*  function dohvatiPodatke() {
 fetch("https://jsonplaceholder.typicode.com/posts/1")
 .then(res => res.json())
 .then(data => postaviPodatak(data))
   .catch(err => alert(err))
 }
  */
 function dohvatiPodatke() {
   axios.get("https://jsonplaceholder.typicode.com/posts/11")
   .then(res => postaviPodatak(res.data))
   .catch(err => alert(err))
   }
  
 return (
 <div className='App'>
 <h1>Dohvat podataka</h1>
 <button onClick={dohvatiPodatke}>Dohvati podatke</button>
 <div>
 <h3>{podatak.title}</h3>
 <p>{podatak.body}</p>
 </div>
 </div>
 );
}


export default App;