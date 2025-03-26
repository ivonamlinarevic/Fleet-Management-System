import './App.css'
import Pozdrav from '../components/Pozdrav'

function App(){
  const datum = new Date()
  const a = 10
  const b = 20
  const osoba = "John Doe";
 
  return (
  <div>
  <p>Dobar dan React, danas je {datum.toString()}</p>
  <p className='izracun'>
  {a} plus {b} je {a + b}
  </p>
  <Pozdrav ime="Ivona" god="23"/>
  </div>
  )
 } 
 
export default App
