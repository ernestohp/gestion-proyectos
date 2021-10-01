import {useState, useEffect} from 'react'
import {Table} from 'react-bootstrap';
import { FaPlus } from "react-icons/fa";

import AgregarUsuarioSup from './AgregarUsuarioSup';

const ListaUsuariosSup = ({usuariosClockify, usuariosSup, onGuardarUsuarioSup}) => {
    const[showAgregar,  setShowAgregar]  = useState(false)
    // const[usuariosSup,  setUsuariosSup]  = useState([])
    const[usuariosClockifyFinal,  setUsuariosClockifyFinal]  = useState([])
    // useEffect (
    //     () => {
    //       const getUsuariosSup = async() => {
    //         const objsFromServer = await apiAlertas.obtenerUsuariosSup()
    //         setUsuariosSup(objsFromServer)
    //         return objsFromServer
    //       }
    //       getUsuariosSup()
    //     },[])

      const onCancelar = () => {
        setShowAgregar(false)
    }
    const onGuardar = async (userA) =>{
        onGuardarUsuarioSup(userA)
        // const newUsuarios = [...usuariosSup, userA]
        // setUsuariosSup(newUsuarios)
        // const respFromServer = await apiAlertas.grabarUsuarioSup(userA)
        // console.log("Guardar usuario Sup, Resp del servidor", respFromServer)
        setShowAgregar(false)
    }
    const onMostrarAgregar=()=>{
        var usuariosFinal = []
        usuariosFinal = usuariosClockify.filter(u => {
            const ua = usuariosSup.find(item => item.id == u.id)
            return !ua
          });          
        setUsuariosClockifyFinal(usuariosFinal)
        setShowAgregar(true)
    }
    return (
        <div>
        <Table hover bordered size="sm">
        <thead>
            <tr>
            <th width="15%">Nombre</th>
            <th width="30%">Correo</th>
            </tr>
        </thead>
        <tbody>
        {usuariosSup.map((user, i) => {
            return (
                    <>
                        <tr>
                            <td> {user.name} </td>
                            <td> {user.email} </td>
                        </tr>
                    </>
                    );
            })
        }
        {showAgregar &&
            <AgregarUsuarioSup onGuardar={onGuardar} 
                            onCancelar={onCancelar} 
                            usuariosClockify={usuariosClockifyFinal} 
                            />
        }
        </tbody>
        </Table>            
        
        <button type="button" 
                class="btn btn-outline-secondary  btn-sm" 
                onClick={onMostrarAgregar}>
                <FaPlus/> 
        </button>              

        </div>
    )
}

export default ListaUsuariosSup
