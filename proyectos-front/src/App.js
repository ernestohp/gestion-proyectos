import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import "react-datepicker/dist/react-datepicker.css";

import Menu from "./componentes/Menu";
import ProyectoListado from './componentes/proyectos/ProyectoListado';
import ProyectoEdicion from './componentes/proyectos/ProyectoEdicion';
import ProyectoEdicion2 from './componentes/proyectos/ProyectoEdicion2';
import Alertas from './componentes/alertas/Alertas';
import SeleccionarPlantilla from './componentes/proyectos/plantilla/SeleccionarPlantilla';
import * as apiProyectos from './apis/Proyectos'


function App() {

  const[personas,  setPersonas]  = useState([])
  useEffect (
    () => {
      const getPersonas = async () => {
        const objsFromServer = await apiProyectos.obtenerPersonas()
        setPersonas(objsFromServer)
      }
      getPersonas()
    },
    []
  )

//===============HTML========================
  return (
    <Router>
    <div>

      <Menu />

      <Routes>

      <Route path="/proyectos" exact element={
        <ProyectoListado personas={personas}/>
      } ></Route>

      <Route path="/" exact element={
        <ProyectoListado personas={personas}/>
      } ></Route>

      <Route path="/proyectos/:id" exact element={
         <ProyectoEdicion2 personas={personas}/>
      } />

      <Route path="/proyectos/plantilla/:id" exact element={
         <SeleccionarPlantilla />
      } />

      <Route path="/alertas" exact element={
         <Alertas personas={personas}/>
      } />
     </Routes>
    </div>
    </Router>
  );
}

export default App;
