import React from 'react'
import {useState, useEffect} from 'react'
import { Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {FaCheck, FaReply } from "react-icons/fa";

const AgregarUsuarioSupOld = ({onGuardar, onCancelar}) => {

    const guardar = () =>{
        var okEmail = true
        var okName = true
        setValidEmail("")
        setValidName("")
        if (usuarioSup.email =="" || !validateEmail(usuarioSup.email)){
            setValidEmail(" is-invalid")
            okEmail = false
        }
        if (usuarioSup.name ==""){
            setValidName(" is-invalid")
            okName = false
        }
        if (okEmail && okName){
            onGuardar(usuarioSup)
        }
    }
    
    //Valores
    const[usuarioSup, setUsuarioSup] = useState({"name":"", "email":""})
    const handleChangeEmail = (value) => {
        const newUA = {...usuarioSup, email : value}
        setUsuarioSup(newUA)
    }
    const handleChangeName = (value) => {
        const newUA = {...usuarioSup, name : value}
        setUsuarioSup(newUA)
    }

    //Validación----
    const[validEmail, setValidEmail] = useState("")
    const[validName,  setValidName]  = useState("")

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
                    <input type="text" 
                               class={"form-control form-control-sm " + validName}
                               value={usuarioSup.name}
                               onChange={(e) => handleChangeName(e.target.value)}/>
                    </div>
                </div>
            </td>

            <td>
                <div class="row">
                    <div class="col-md-8">
                    <input type="text" 
                               class={"form-control form-control-sm " + validEmail}
                               placeholder="Correo electrónico"
                                value={usuarioSup.email}
                                onChange={(e) => handleChangeEmail(e.target.value)}
                                onBlur={(e) => handleOnBlur(e.target.value)}
                               />
                            {/* <Form.Control type="text" readOnly size="sm" value={usuarioSup.email}/> */}


                    </div>

                    <div class="col-md-1">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="top1">Guardar Registro</Tooltip>} >                    
                        <button type="button" 
                                class="btn btn-outline-secondary  btn-sm" 
                                onClick={guardar}>
                            <FaCheck/> 
                        </button>
                        </OverlayTrigger> 
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
            </td>


            </tr>
            
        </>
    )
}

export default AgregarUsuarioSupOld
