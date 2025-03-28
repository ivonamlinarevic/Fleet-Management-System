import {useEffect} from "react"

function Prikaz(props) {

    useEffect(() => {
        const pritisak = () => alert("Klik");
        window.addEventListener("keyup", pritisak);
       
        return () => {
        window.removeEventListener("keyup", pritisak)
        }
        });
       
 
 return (
 <div>
 <p>Broj: {props.broj}</p> 
 </div>
 );
}
export default Prikaz
