import {useState, useEffect} from 'react'
import {Card} from 'react-bootstrap';
import {FaCheck } from "react-icons/fa";

import { useAlert } from 'react-alert'
import * as apiAlertas from './../../../apis/Alertas'

const EjecutarBatch = ({usuariosAlerta, usuariosSup}) => {

    const alert = useAlert()

    const[parametro1,  setParametro1] = useState({"name": "frecuencia_usuario", "value2": "ultimo_dia"}) 
    const[parametro2,  setParametro2] = useState({"name": "frecuencia_sup", "value2": "ultimo_dia"}) 
    const[usersSelected,  setUsersSelected] = useState(["0"]) 
    const[usersSelectedSup,  setUsersSelectedSup] = useState(["0"]) 
    const[showSelect1,  setShowSelect1] = useState(false) 
    const[showSelect2,  setShowSelect2] = useState(false) 

    const handleClickParam1 = (value) => {
        const p = {}
        p.value2 = value
        setParametro1(p)
    }
    const handleClickParam2 = (value) => {
        const p = {}
        p.value2 = value
        setParametro2(p)
    }
    const handleChangeSelect1 = (e) => {
        let values = Array.from(e.target.selectedOptions, option => option.value);
        setUsersSelected(values)
    }
    const handleChangeSelect2 = (e) => {
        let values = Array.from(e.target.selectedOptions, option => option.value);
        setUsersSelectedSup(values)
    }

    const handleClickCheckbox1 = (checked, tipoAlerta) => {
        if (checked) {
            setUsersSelected(["0"])
            setShowSelect1(false)
        }
        else{
            setUsersSelected([])
            setShowSelect1(true)
        }
    }

    const handleClickCheckbox2 = (checked, tipoAlerta) => {
        if (checked) {
            setUsersSelectedSup(["0"])
            setShowSelect2(false)
        }
        else{
            setUsersSelectedSup([])
            setShowSelect2(true)
        }
    }

    //{ventana:"ultimo_dia", usuarios:[ids..]}
    const onEjecutarAlertas1 = async() => {
        if (usersSelected.length == 0)
            alert.error('Seleccione usuarios')
        else{
            // alert.info(usersSelected)
            alert.info("Generando alertas, espere...")
            const datos = {}
            datos.ventana=parametro1.value2
            datos.usuarios = usersSelected
            const respFromServer = await apiAlertas.generarAlertas(datos) 
            console.log("generar alertas, resp del servidor", respFromServer)
            // alert.info(respFromServer)
            alert.success("Se enviaron las alertas")

        }

    }

    const onEjecutarAlertas2 = async() => {
        if (usersSelectedSup.length == 0)
            alert.error('Seleccione usuarios')
        else {
            // alert.info(usersSelected)
            alert.info("Generando alertas, espere...")
            const datos = {}
            datos.ventana=parametro2.value2
            datos.usuarios = usersSelectedSup
            const respFromServer = await apiAlertas.generarAlertasSup(datos) 
            console.log("generar alertas, resp del servidor", respFromServer)
            // alert.info(respFromServer)
            alert.success("Se enviaron las alertas")
        }

    }



    const valores1 = ['diario', 'semanal', 'mensual']
    const valores2 = [  ['ultimo_dia', 'Último día'],
                        ['inicio_sem', 'Desde el inicio de semana'], 
                        ['ultima_sem', 'Últimos 7 días'], 
                        ['inicio_mes', 'Desde el inicio del mes'], 
                        ['ultimo_mes', 'Último mes'] ]

    return (
        <div>

        <table className="table2">
          <tr>
          <td width="35%" className="td2">
          {/* =========Alertas para usuarios=========== */}
          <Card style={{ width: '25rem', height: '25rem' }}>
            <Card.Header>Alerta para usuarios</Card.Header>
            <Card.Body>
                {/* -----Ventana de ejecución----- */}
                {valores2.map((type, i) => (
                <div className="form-check">
                    <input class="form-check-input" type="radio" name="ejecutar1" id={`ejecutar1-${i}`} 
                        value={type[0]}
                        onClick={(e) => handleClickParam1(e.target.value, 'value2')}
                        checked={parametro1.value2===type[0]}
                    />
                    <label class="form-check-label" for={`ejecutar1-${i}`}>
                        {type[1]}
                    </label>
                </div>
                ))}
                <br/>

                {/* -----Lista de usuarios----- */}
                Seleccione usuarios:
                <div class="form-check">
                        <input class="form-check-input" defaultChecked="true"
                               type="checkbox" 
                               id="alerta1"
                               onClick={(e) => handleClickCheckbox1(e.target.checked, "alerta1")}/>
                        <label for="alerta1">Todos los usuarios</label>
                </div>
                {!showSelect1 &&
                    <select class="form-select form-select-sm" multiple disabled size="3">
                    {usuariosAlerta.map((u, i) => (
                        <option key={i} value={u.id}>{u.name}</option>
                    ))}
                    </select> 
                }

                {showSelect1 &&
                    <select class="form-select form-select-sm" 
                            multiple
                            size="3"
                            onChange={(e) => handleChangeSelect1(e)}
                            >
                    {usuariosAlerta.map((u, i) => (
                        <option key={i} value={u.id}>{u.name}</option>
                    ))}
                    </select>
                }




                {/* -----Botón ejecutar----- */}
                <br/>
                <button type="button" 
                        class="btn btn-outline-secondary active btn-sm" 
                        onClick={onEjecutarAlertas1}>
                        <FaCheck/> Generar alertas
                </button>              


            </Card.Body>
          </Card>
          </td>

          {/* <td  className="td2"> &nbsp;&nbsp;&nbsp;</td> */}

          <td className="td2">
          {/* =========Alertas para supervisores=========== */}
          <Card style={{ width: '25rem', height: '25rem' }}>
            <Card.Header>Alertas para supervisores</Card.Header>
            <Card.Body>

                {/* -----Ventana de ejecución----- */}
                {valores2.map((type, i) => (
                <div className="form-check">
                    <input class="form-check-input" type="radio" name="ejecutar2" id={`ejecutar2-${i}`} 
                        value={type[0]}
                        onClick={(e) => handleClickParam2(e.target.value, 'value2')}
                        checked={parametro2.value2===type[0]}
                    />
                    <label class="form-check-label" for={`ejecutar2-${i}`}>
                        {type[1]}
                    </label>
                </div>
                ))}
                <br/>

                {/* -----Lista de usuarios supervisores----- */}
                Seleccione usuarios:
                <div class="form-check">
                        <input class="form-check-input" defaultChecked="true"
                            type="checkbox" 
                            id="alerta2"
                            onClick={(e) => handleClickCheckbox2(e.target.checked, "alerta2")}/>
                        <label for="alerta2">Todos los usuarios</label>
                </div>
                {!showSelect2 &&
                    <select class="form-select form-select-sm" multiple disabled size="3">
                    {usuariosAlerta.map((u, i) => (
                        <option key={i} value={u.id}>{u.name}</option>
                    ))}
                    </select> 
                }

                {showSelect2 &&
                    <select class="form-select form-select-sm" 
                            multiple
                            size="3"
                            onChange={(e) => handleChangeSelect2(e)}
                            >
                    {usuariosAlerta.map((u, i) => (
                        <option key={i} value={u.id}>{u.name}</option>
                    ))}
                    </select>
                }




                {/* -----Botón ejecutar----- */}
                <br/>
                <button type="button" 
                        class="btn btn-outline-secondary active  btn-sm" 
                        onClick={onEjecutarAlertas2}>
                        <FaCheck/> Generar alertas
                </button>              




            </Card.Body>
          </Card>


          </td>

          </tr>
        </table>


        </div>
    )
}

export default EjecutarBatch
