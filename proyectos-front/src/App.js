import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import "react-datepicker/dist/react-datepicker.css";

import Menu from "./componentes/Menu";
import ProyectoListado from './componentes/ProyectoListado';
import ProyectoEdicion from './componentes/ProyectoEdicion';
import Alertas from './componentes/alertas/Alertas';
import * as apiProyectos from './apis/Proyectos'
import * as Fechas from './util/Fechas'



function App() {


  const[proyectos, setProyectos] = useState([])
  const[proyectosOrig, setProyectosOrig] = useState([])
  const[personas,  setPersonas]  = useState([])

  useEffect (
    () => {
      const getProyectos = async () => {
        const prosFromServer = await apiProyectos.obtenerProyectos()
        setProyectos(prosFromServer)
        setProyectosOrig(prosFromServer)
      }
      const getPersonas = async () => {
        const objsFromServer = await apiProyectos.obtenerPersonas()
        setPersonas(objsFromServer)
      }
      getProyectos()
      getPersonas()
    },
    []
  )
  
//=================FILTRAR EL LISTADO=================
  const onFilter = (data) => {
    var newProyectos = [...proyectosOrig]
    if(data.cliente!==0){
      newProyectos = newProyectos.filter(function (entry) {
        return (entry.cliente_id === data.cliente);
      });
    }
    if(data.account_manager!==0){
      newProyectos = newProyectos.filter(function (entry) {
        return (entry.account_manager_id === data.account_manager);
      });
    }
    if(data.product_owner!==0){
      newProyectos = newProyectos.filter(function (entry) {
        return (entry.product_owner_id === data.product_owner);
      });
    }
    if(data.estado!==100){
      newProyectos = newProyectos.filter(function (entry) {
        return (entry.estado_id === data.estado);
      });
    }
    console.log("data", data)
    console.log("newProyectos", newProyectos)
    if(data.fecha_ini!=""){
      newProyectos = newProyectos.filter(function (entry) {
        const d1 = Fechas.getFecha1(entry.fecha_entrega)
        return (d1 >= data.fecha_ini);
      });
    }
    console.log("data", data)
    console.log("newProyectos", newProyectos)
    if(data.fecha_fin!=""){
      newProyectos = newProyectos.filter(function (entry) {
        const d1 = Fechas.getFecha1(entry.fecha_entrega)
        console.log(d1)
        return (d1 <= data.fecha_fin);
      });
    }
    console.log("newProyectos", newProyectos)
    setProyectos(newProyectos);
  }

//===============HTML========================
  return (
    <Router>
    <div>

      <Menu />

      <Route path={["/", "/proyectos"]} exact render={(props)=>(
          <ProyectoListado proyectos={proyectos} onFilter={onFilter} />
      )} />

      <Route path='/proyectos/:id' exact render={(props)=>(
         <ProyectoEdicion personas={personas}/>
      )} />

      <Route path='/alertas' exact render={(props)=>(
         <Alertas personas={personas}/>
      )} />
     
    </div>
    </Router>
  );
}

export default App;
