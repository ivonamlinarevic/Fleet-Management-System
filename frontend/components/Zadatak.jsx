function Zadatak(props) {
    if (props.gotov) {
    return <p>{props.natpis} ✅</p>;
    }
    return <p>{props.natpis} 🕓🔄</p>;
   }
   export default Zadatak;
   