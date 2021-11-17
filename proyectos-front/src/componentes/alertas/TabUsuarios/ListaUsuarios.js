import {useState, useEffect} from 'react'
import {Table} from 'react-bootstrap';
import { FaPlus, FaCheck } from "react-icons/fa";


import AgregarUsuario from './AgregarUsuario';
import * as apiAlertas from './../../../apis/Alertas'

const ListaUsuarios = ({usuariosClockify, usuariosAlerta, onGuardarUsuario}) => {
    const[showAgregar,  setShowAgregar]  = useState(false)
    // const[usuariosAlerta,  setUsuariosAlerta]  = useState([])
    const[usuariosClockifyFinal,  setUsuariosClockifyFinal]  = useState([])
    // useEffect (
    //     () => {
    //       const getUsuariosAlerta = async() => {
    //         const objsFromServer = await apiAlertas.obtenerUsuarios()
    //         setUsuariosAlerta(objsFromServer)
    //         return objsFromServer
    //       }
    //       getUsuariosAlerta()
    //     },[])

      const onCancelar = () => {
        setShowAgregar(false)
    }
    const onGuardar = async (userA) =>{
        onGuardarUsuario(userA)
        // const newUsuarios = [...usuariosAlerta, userA]
        // setUsuariosAlerta(newUsuarios)
        // const respFromServer = await apiAlertas.grabarUsuarioAlerta(userA)
        // console.log("Resp de alertas", respFromServer)
        setShowAgregar(false)
    }
    const onMostrarAgregar=()=>{
        var usuariosFinal = []
        usuariosFinal = usuariosClockify.filter(u => {
            const ua = usuariosAlerta.find(item => item.id == u.id)
            return !ua
          });          
        setUsuariosClockifyFinal(usuariosFinal)
        setShowAgregar(true)
    }
    return (
        <div>
        {/* <Table hover bordered size="sm"> */}
        <table className="table2">
        <thead>
            <tr>
            <td className="tdth" width="12%">Nombre</td>
            <td className="tdth" width="15%">Correo</td>
            <td className="tdth"width="20%">Rango de Horas (min-max)</td>
            <td className="tdth"width="15%">Horas extras(festivos)</td>
            <td className="tdth">Alertas</td>
            </tr>
        </thead>
        <tbody>
        {usuariosAlerta.map((user, i) => {
            return (
                    <>
                        <tr>
                            <td> {user.name} </td>
                            <td> {user.email} </td>
                            <td> {user.horas_min} - {user.horas_max}</td>
                            <td> 
                                {(user.extras==1)&&
                                    <FaCheck/>
                                }
                            </td>
                            <td> 
                                <ul>
                                {(user.alerta1==1)&&
                                    <li>Registros sin tarea</li>
                                }
                                {(user.alerta2==1)&&
                                    <li>Registros sin tarea ni proyecto</li>
                                }
                                {(user.alerta3==1)&&
                                    <li>Rango de horas</li>
                                }
                                </ul>                                

                            </td>
                        </tr>
                    </>
                    );
            })
        }
        {showAgregar &&
            <AgregarUsuario onGuardar={onGuardar} 
                            onCancelar={onCancelar} 
                            usuariosClockify={usuariosClockifyFinal} />
        }
        </tbody>
        </table>            
        
        <button type="button" 
                class="btn btn-outline-secondary  btn-sm" 
                onClick={onMostrarAgregar}>
                <FaPlus/> 
        </button>              

        </div>
    )
}

export default ListaUsuarios


