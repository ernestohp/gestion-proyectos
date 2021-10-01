import {useState, useEffect} from 'react'
import { Tabs, Tab, Card} from 'react-bootstrap';

import ListaUsuarios from './TabUsuarios/ListaUsuarios';
import Parametros from './TabParametros/Parametros';
import CabeceraAlertas from './CabeceraAlertas';
import ListaUsuariosSup from './TabAdmin/ListaUsuariosSup';
import EjecutarBatch from './TabEjecutar/EjecutarBatch';
import * as apiAlertas from './../../apis/Alertas';

const Alertas = ({personas}) => {
    console.log("inicio.........")
    const[usuariosClockify,  setUsuariosClockify]  = useState([])
    const[usuariosAlerta,  setUsuariosAlerta]  = useState([])
    const[usuariosSup,  setUsuariosSup]  = useState([])
    const[parametros,  setParametros] = useState([]) 

    useEffect (
      () => {
          const getUsuariosClockify = async() => {
            const objsFromServer = await apiAlertas.obtenerUsuariosClockify()
            setUsuariosClockify(objsFromServer)
          }
          const getParametros = async() => {
            const objsFromServer =  await apiAlertas.obtenerParametros()
            setParametros(objsFromServer)
          }
          const getUsuariosAlerta = async() => {
            const objsFromServer = await apiAlertas.obtenerUsuarios()
            setUsuariosAlerta(objsFromServer)
            return objsFromServer
          }
          const getUsuariosSup = async() => {
            const objsFromServer = await apiAlertas.obtenerUsuariosSup()
            setUsuariosSup(objsFromServer)
            return objsFromServer
          }
          getUsuariosAlerta()
          getUsuariosSup()
          getUsuariosClockify()
          getParametros()
      },[])
    const onGuardarUsuario = async (userA) =>{
        const newUsuarios = [...usuariosAlerta, userA]
        setUsuariosAlerta(newUsuarios)
        const respFromServer = await apiAlertas.grabarUsuarioAlerta(userA)
        console.log("Resp de alertas", respFromServer)
    }

    const onGuardarUsuarioSup = async (userA) =>{
      const newUsuarios = [...usuariosSup, userA]
      setUsuariosSup(newUsuarios)
      const respFromServer = await apiAlertas.grabarUsuarioSup(userA)
      console.log("Guardar usuario Sup, Resp del servidor", respFromServer)
  }

    return (
        <>
        {/* ======Cabecera======== */}
        <CabeceraAlertas />      

        <Tabs defaultActiveKey="usuarios" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="usuarios" title="Usuarios">
            <ListaUsuarios usuariosClockify={usuariosClockify} 
                           usuariosAlerta={usuariosAlerta}
                           onGuardarUsuario={onGuardarUsuario}/>
        </Tab>

        <Tab eventKey="admin" title="Supervisores">
          <Card style={{ width: '50rem' }}>
            <Card.Body>
                <ListaUsuariosSup usuariosClockify={usuariosClockify} 
                                  usuariosSup={usuariosSup}
                                  onGuardarUsuarioSup={onGuardarUsuarioSup}/>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="parametros" title="Parámetros">
        <Card style={{ width: '50rem' }}>
            <Card.Body>
            {(parametros.length>0) &&
                <Parametros parametros={parametros}/>
            }
            </Card.Body>
          </Card>
        </Tab>


        <Tab eventKey="ejecutar" title="Ejecutar">
        {/* <Card style={{ width: '50rem' }}>
            <Card.Body> */}
                <EjecutarBatch usuariosAlerta={usuariosAlerta} usuariosSup={usuariosSup}/>
            {/* </Card.Body>
          </Card> */}
        </Tab>

        </Tabs>

        </>
    )
}

export default Alertas
