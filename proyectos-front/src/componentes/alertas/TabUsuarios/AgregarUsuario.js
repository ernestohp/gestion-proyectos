import React from 'react'
import {useState, useEffect} from 'react'
import { Form, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {FaCheck, FaReply } from "react-icons/fa";

const AgregarUsuario = ({onGuardar, onCancelar, usuariosClockify}) => {

    const guardar = () =>{
        var okEmail = true
        // setValidEmail("")
        var okHMin = true
        var okHMax = true
        var okId = true
        setValidHMin("")
        setValidHMax("")
        if (usuarioAlerta.email =="" || !validateEmail(usuarioAlerta.email)){
            setValidEmail(" is-invalid")
            okEmail = false
        }
        if (usuarioAlerta.horas_min ==""){
            setValidHMin(" is-invalid")
            okHMin = false
        }
        if (usuarioAlerta.horas_max ==""){
            setValidHMax(" is-invalid")
            okHMax = false
        }
        if (usuarioAlerta.id =="0"){
            okId = false
        }
        if (okEmail && okHMin && okHMax && okId){
            onGuardar(usuarioAlerta)
        }
    }
    
    //Valores
    const [defaultValues, setDefaultValues] = useState({id:"0",email:"",name:"", horas_min:"", horas_max:"",
                                                        alerta1:1, alerta2:1, alerta3:1 });
   const[usuarioAlerta, setUsuarioAlerta] = useState({...defaultValues});

    const[showForm, setShowForm] = useState(false)
    const handleChangeSelect = (value) => {
        setUsuarioAlerta({...defaultValues});
        for (const u of usuariosClockify){
            if(u.id == value){
                const newUA = {...usuarioAlerta, id : u.id, email:u.email, name:u.name}
                setUsuarioAlerta(newUA)
                break;
            }
        }
        setShowForm(true)
    }
    const handleChangeEmail = (value) => {
        const newUA = {...usuarioAlerta, email : value}
        setUsuarioAlerta(newUA)
    }
    const handleChangeHMin = (value) => {
        let isnum = /^\d+$/.test(value);
        var txtValue= (value!="" && isnum) ? parseInt(value) : "";
        const newUA = {...usuarioAlerta, horas_min : txtValue}
        setUsuarioAlerta(newUA)
    }
    const handleChangeHMax = (value) => {
        let isnum = /^\d+$/.test(value);
        var txtValue= (value!="" && isnum) ? parseInt(value) : "";
        const newUA = {...usuarioAlerta, horas_max : txtValue}
        setUsuarioAlerta(newUA)
    }
    const handleClickCheckbox = (checked, alerta) => {
        const i = (checked) ? 1 : 0
        var newUA = {}
        if (alerta == "alerta1"){
            newUA = {...usuarioAlerta, alerta1 : i}
        }
        if (alerta == "alerta2"){
            newUA = {...usuarioAlerta, alerta2 : i}
        }
        if (alerta == "alerta3"){
            newUA = {...usuarioAlerta, alerta3 : i}
        }
        setUsuarioAlerta(newUA)
    }

    //Validación----
    const[validEmail, setValidEmail] = useState("")
    const[validHMin,  setValidHMin]  = useState("")
    const[validHMax,  setValidHMax]  = useState("")

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
                            value={usuarioAlerta.id}
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
                    <div class="col-md-12">
                        {/* <input type="text" 
                               class={"form-control form-control-sm " + validEmail}
                               placeholder="Correo electrónico"
                                value={usuarioAlerta.email}
                                onChange={(e) => handleChangeEmail(e.target.value)}
                                onBlur={(e) => handleOnBlur(e.target.value)}
                               /> */}
                        {showForm &&
                            <Form.Control type="text" readOnly size="sm" value={usuarioAlerta.email}/>
                        }
                    </div>
                </div>
            </td>
            <td>
            <div class="row">
                <div class="col-md-5">
                {showForm &&
                    <div class="input-group input-group-sm">
                        <div class="input-group-text input-group-text-sm">Rango</div>
                        <input type="text" 
                               class={"form-control form-control-sm " + validHMin}
                               value={usuarioAlerta.horas_min}
                               onChange={(e) => handleChangeHMin(e.target.value)}/>
                    </div>
                }
                </div>
                <div class="col-md-1">-</div>
                <div class="col-md-3">
                {showForm &&
                    <input type="text" 
                           class={"form-control form-control-sm " + validHMax}
                           value={usuarioAlerta.horas_max}
                           onChange={(e) => handleChangeHMax(e.target.value)}/>
                }
                </div>
            </div>
            </td>
            <td>
            <div class="row g-5">
                <div class="col-auto">
                {showForm &&
                <div>
                    <div class="form-check">
                        <input class="form-check-input" defaultChecked="true"
                               type="checkbox" 
                               id="alerta1"
                               onClick={(e) => handleClickCheckbox(e.target.checked, "alerta1")}/>
                        <label for="alerta1">Registros sin tarea</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" defaultChecked="true"
                               type="checkbox" 
                               id="alerta2"
                               onClick={(e) => handleClickCheckbox(e.target.checked, "alerta2")}/>
                        <label for="alerta2">Registros sin tarea ni proyecto</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" defaultChecked="true"
                               type="checkbox" 
                               id="alerta3"
                               onClick={(e) => handleClickCheckbox(e.target.checked, "alerta3")}/>
                        <label for="alerta3">Rango de horas</label>
                    </div>
                </div>
                }
                </div>
                
                <div class="col-auto">&nbsp;&nbsp;</div>
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

export default AgregarUsuario
