import React from 'react'
import {useState, useEffect} from 'react'
import { Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {FaCheck, FaReply } from "react-icons/fa";

const AgregarUsuarioSup = ({onGuardar, onCancelar, usuariosClockify}) => {

    const guardar = () =>{
        var okEmail = true
        // setValidEmail("")
        var okId = true
        if (usuarioSup.email =="" || !validateEmail(usuarioSup.email)){
            setValidEmail(" is-invalid")    
            okEmail = false
        }
        if (usuarioSup.id =="0"){
            okId = false
        }
        if (okEmail && okId){
            onGuardar(usuarioSup)
        }
    }
    
    //Valores
    const [defaultValues, setDefaultValues] = useState({id:"0",email:"",name:""});
    const[usuarioSup, setUsuarioSup] = useState({...defaultValues});

    const[showForm, setShowForm] = useState(false)
    const handleChangeSelect = (value) => {
        setUsuarioSup({...defaultValues});

        for (const u of usuariosClockify){
            if(u.id == value){
                const newUA = {...usuarioSup, id : u.id, email:u.email, name:u.name}
                setUsuarioSup(newUA)
                break;
            }
        }
        setShowForm(true)
    }
    const handleChangeEmail = (value) => {
        const newUA = {...usuarioSup, email : value}
        setUsuarioSup(newUA)
    }

    //Validación----
    const[validEmail, setValidEmail] = useState("")

    const handleOnBlur = (value) => {
        setValidEmail("")
        if(value != "" && !validateEmail(value)){
            setValidEmail(" is-invalid")
        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

 
    return (
        <>
            <tr>
            <td>
                <div class="row">
                    <div class="col-md-12">

                    <select className="form-select form-select-sm" 
                            value={usuarioSup.id}
                            onChange={(e) => handleChangeSelect(e.target.value)}
                    >
                        <option value="0">-</option>
                        {usuariosClockify.map((u, i)=>(
                            <option key={i} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                    </div>
                </div>
            </td>
            <td>
                <div class="row">
                    <div class="col-md-5">
                        {showForm &&
                            <Form.Control type="text" readOnly size="sm" value={usuarioSup.email}/>
                        }
                    </div>
                    <div class="col">

                        <div class="row g-5">
                            <div class="col-md-1">
                            {showForm &&
                                <div>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="top1">Guardar Registro</Tooltip>} >                    
                                <button type="button" 
                                        class="btn btn-outline-secondary  btn-sm" 
                                        onClick={guardar}>
                                    <FaCheck/> 
                                </button>
                                </OverlayTrigger> 
                                </div>
                            }
                            </div>
                            <div class="col-auto">
                                <OverlayTrigger placement="top"  overlay={<Tooltip id="top1">Cancelar</Tooltip>} >                    
                                <button type="button" 
                                        class="btn btn-outline-secondary  btn-sm" 
                                        onClick={onCancelar}>
                                    <FaReply/> 
                                </button>
                                </OverlayTrigger>
                            </div>

                        </div>

                        </div>  
                </div>
            </td>



            </tr>
            
        </>
    )
}

export default AgregarUsuarioSup
