import TemaContext from "../src/kontekst"

function Tipka(props) {
 return(
 <TemaContext.Consumer>
 { tema => <button className={tema} onClick={() => props.klik}>{props.natpis}</button> }
 </TemaContext.Consumer>
 ) 
}
