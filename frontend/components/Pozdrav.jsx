function Pozdrav(props) {
    const ime = props.ime
    const god = props.god
    const godRod = () => {
    let rez = new Date().getFullYear() - god
    return rez
    }
    return (
    <>
    <h3>Pozdrav od React funkcijske komponente</h3>
    <p>Dobar dan, {ime}</p>
    <p>Imaš {god} godina.</p>
    <p>Vjerojatno si rođen(a) {godRod()}. godine</p>
    </>
    )
   }
   
   export default Pozdrav
   