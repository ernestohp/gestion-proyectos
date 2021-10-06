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
        {/* <Table hover bordered size="sm"> */}
        <table>
        <thead>
            <tr>
            <td className="tdth" width="15%">Nombre</td>
            <td className="tdth" width="30%">Correo</td>
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
        </table>            
        
        <button type="button" 
                class="btn btn-outline-secondary  btn-sm" 
                onClick={onMostrarAgregar}>
                <FaPlus/> 
        </button>              


{/* Prueba */}
{/* <br/><br/>
<Table striped bordered hover>
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            <tr
                data-toggle="collapse"
                data-target=".multi-collapse1"
                aria-controls="multiCollapseExample1"
            >
                <td>1</td>
                <td>TEST 123</td>
                <td>test123@test.com</td>
            </tr>
            <tr class="collapse multi-collapse1" id="multiCollapseExample1">
                <td>Child col 1</td>
                <td>Child col 2</td>
                <td>Child col 3</td>
            </tr>
            <tr
                data-toggle="collapse"
                data-target=".multi-collapse2"
                aria-controls="multiCollapseExample2"
            >
                <td>2</td>
                <td>TEST 456</td>
                <td>test456@test.com</td>
            </tr>
            <tr class="collapse multi-collapse2" id="multiCollapseExample2">
                <td>Child col 1</td>
                <td>Child col 2</td>
                <td>Child col 3</td>
            </tr>
        </tbody>
    </Table> */}

{/* Prueba */}







        </div>
    )
}

export default ListaUsuariosSup
