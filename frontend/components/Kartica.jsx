import stil from './Kartica.module.css'

function Kartica() {
 return (
 <div>
 <h1 className={stil.naslov}>Naslov kartice</h1>
 <p className={stil["odlomak"]}>Tekst kartice</p>
 </div>
 );
}

export default Kartica;
