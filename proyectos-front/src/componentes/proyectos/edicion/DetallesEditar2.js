import React from 'react'
import {useState, useEffect} from 'react'
import * as Fechas from './../../util/Fechas'
import * as TareasUtil from './TareasUtil'

//DatePicker-----------
import DatePicker from 'react-datepicker'
import {registerLocale, setDefaultLocale} from  "react-datepicker";
import es from 'date-fns/locale/es';
//---------------------

const DetallesEditar2 = ({proyecto, personas, tareasFlatPlantillaTemp, onChangeItem, setTareasFlatPlantilla,tareasFlatPlantilla}) => {
    console.log("proyecto", proyecto)

    const [personasArray, setPersonasArray] = useState([]);
    const [tiempoArray, setTiempoArray] = useState([]);
    const [inputStyle, setInputStyle] = useState([]);
    
    //--Clase tarea Global---
    const [claseGlobal, setClaseGlobal] = useState("");


    //DatePicker----
    registerLocale('es', es)
    setDefaultLocale('es')
    const [startDate, setStartDate] = useState([]);
    const [endDate,   setEndDate]   = useState([]);
    
    //======Cambio de los controles======
    const changePersona = (e, id, i) => {
        //---grabar en el array de tareas local
        var p1 = [...personasArray]
        p1[i] = parseInt(e.target.value)
        setPersonasArray(p1);

        //---Grabar en la variable de tareas principal
        const valor = parseInt(e.target.value)
        var tTemp = TareasUtil.actualizar_campo('persona', valor, id, 
                                                tareasFlatPlantillaTemp, 
                                                tareasFlatPlantilla, personas)
        console.log("tTemp despues, persona", tTemp)
        setTareasFlatPlantilla(tTemp)
    };

    const changeTiempo = (value, id, i) => {
        console.log("value", ","+value+",")
        var isnum = /^\d+$/.test(value);
        if(value=="") isnum = true;
        console.log("isnum", isnum)
        if (isnum){
            var txtValue= (value!="") ? parseInt(value) : "";
            console.log("txtValue", txtValue)

            //JSON de tareas
            var tTemp = TareasUtil.actualizar_campo('tiempo_estimado',txtValue, id, 
                                                    tareasFlatPlantillaTemp, 
                                                    tareasFlatPlantilla, personas)
            tTemp = TareasUtil.actualizarTotales(tTemp)
            console.log("tTemp despues, tiempo_estimado", tTemp)
            setTareasFlatPlantilla(tTemp)

            //Actualizar tootales visualizacion
            var t1 = [...tiempoArray]
            t1[i] = txtValue
            var tArray = TareasUtil.actualizarTotalesVisualizacionTE(t1, tTemp)
            setTiempoArray(tArray);
            console.log("tArray, despues", tArray)
            
            //Color del texto
            const t = tTemp.find(tarea => tarea.id == id)
            colorTexto(t, i)
            onChangeItem()

            //---clase tarea global---
            var x_horas = 0
            if (proyecto.x_horas_estimadas != null)
                x_horas = proyecto.x_horas_estimadas
            var horasGlobales = tTemp[0].tiempo_group
            const cGlobal = (horasGlobales > x_horas)?"textRed":"textGreen";
            setClaseGlobal(cGlobal)

        }
    };

    const addStartDate = (d1, id, i) => {

        //JSON de tareas
        var tTemp = TareasUtil.actualizar_campo('fecha_ini',d1, id, 
                                                tareasFlatPlantillaTemp, 
                                                tareasFlatPlantilla, personas)
        tTemp = TareasUtil.actualizarTotales(tTemp)
        console.log("tTemp despues, fecha_ini", tTemp)
        setTareasFlatPlantilla(tTemp)
        
        //Actualizar tootales visualizacion
        var sd1 = [...startDate]
        sd1[i] = d1
        var dArray = TareasUtil.actualizarTotalesVisualizacionSD(sd1, tTemp)
        setStartDate(dArray);
        console.log("dArray, despues", dArray)

        const t = tTemp.find(tarea => tarea.id == id)
        colorTexto(t, i)
    }
    const addEndDate = (d1, id, i) => {
        //JSON de tareas
        var tTemp = TareasUtil.actualizar_campo('fecha_fin',d1, id, 
                                                tareasFlatPlantillaTemp, 
                                                tareasFlatPlantilla, personas)
        tTemp = TareasUtil.actualizarTotales(tTemp)
        console.log("tTemp despues, fecha_fin", tTemp)
        setTareasFlatPlantilla(tTemp)
        
        //Actualizar tootales visualizacion
        var ed1 = [...endDate]
        ed1[i] = d1
        var dArray = TareasUtil.actualizarTotalesVisualizacionED(ed1, tTemp)
        setEndDate(dArray);
        console.log("dArray, despues", dArray)

        const t = tTemp.find(tarea => tarea.id == id)
        colorTexto(t, i)        
    }


    const colorTexto = (t, i) => {
        if (t.fecha_ini!=null && t.fecha_ini!="" && t.fecha_fin!=null && t.fecha_fin!=""){
            const arr_ausencias = TareasUtil.obtenerAusencias(personas,t.persona)
            const horas = Fechas.horasLaborales2(t.fecha_ini, t.fecha_fin, arr_ausencias)
            var horasIngresadas = (t.tiempo_estimado!="") ? parseInt(t.tiempo_estimado) : 0;
    
            var is = [...inputStyle]
            is[i] = (horasIngresadas > horas)?{borderColor:"brown",  color:"orange"}:{};
            setInputStyle(is);
    
            // t.adv = (horasIngresadas > horas)?"horas":"";
            // t.horas_entre_fechas = horas
        }
    }
       

    return (
            <table className='hoverTable1'>
            <thead >
                <tr>
                <th width="25%">Asunto</th>
                <th width="17%">Persona</th>
                <th width="20%">Fecha Inicio</th>
                <th width="20%">Fecha Fin</th>
                <th>Tiempo estimado (h)</th>
                </tr>
            </thead>
            <tbody>
            {tareasFlatPlantillaTemp.map((t, i)=> {

            return (
                <tr>
                    {/*===============NOMBRE======================*/}
                    <td className={(t.hijo_global||i==0)?"td4":""}>
                        {t.nombre_sangria}
                    </td>

                    {/*===============PERSONAS======================*/}
                    <td className={(t.hijo_global||i==0)?"td4":""}>
                        
                        {(t.nombre=='Account Manager' || t.nombre=='Project Owner') &&
                        <select className="form-select form-select-sm" value={t.persona} disabled>
                        <option value="0">-</option>
                        {personas.map((p, i)=>(
                            <option key={i} value={p.id}>{p.name}</option>
                        ))}
                        </select>
                        }

                        {(!t.tiene_hijos) && (t.tipo!="milestone") && 
                         (t.nombre!='Account Manager' && t.nombre!='Project Owner') &&
                        <select className="form-select form-select-sm" 
                                value={(typeof(personasArray[i]) != "undefined")?personasArray[i]:t.persona}
                                onChange={(e) => changePersona(e, t.id, i)}
                                
                        >
                        <option value="0">-</option>
                        {personas.map((p, i)=>(
                            <option key={i} value={p.id}>{p.name}</option>
                        ))}
                        </select>
                        }


                    </td>

                    {/*===============FECHA INICIO======================*/}
                    <td className={(t.hijo_global||i==0)?"td4":""}>
                    {/* <td> */}
                        {t.tiene_hijos &&
                            <span>{startDate[i] ||t.fecha_ini_group}</span>
                        }

                        {(!t.tiene_hijos) &&
                            <DatePicker
                                selected={startDate[i] || t.fecha_ini}
                                onChange={(date) => addStartDate(date, t.id, i)}
                                selectsStart
                                startDate={startDate[i]}
                                endDate={endDate[i]}
                                dateFormat="dd/MM/yyyy"
                            />
                        }
                    </td>

                    {/*===============FECHA FIN======================*/}
                    <td className={(t.hijo_global||i==0)?"td4":""}>
                    {/* <td> */}
                        {t.tiene_hijos &&
                            <span>{endDate[i] ||t.fecha_fin_group}</span>
                        }

                        {(!t.tiene_hijos) &&
                        <DatePicker
                            selected={endDate[i] || t.fecha_fin }
                            onChange={(date) => addEndDate(date, t.id, i)}
                            selectsEnd
                            startDate={startDate[i]}
                            endDate={endDate[i]}
                            minDate={startDate[i]}
                            dateFormat="dd/MM/yyyy"
                        />
                        }

                    </td>

                    {/*===============TIEMPO ESTIMADO======================*/}
                    <td className={(t.hijo_global||i==0)?"td4":""}>
                        {t.tiene_hijos && (t.tipo!="milestone") &&
                            <span className={(t.nombre=="GLOBAL")?claseGlobal||t.clase_global:""}>
                            {(typeof(tiempoArray[i]) != "undefined")?tiempoArray[i]:t.tiempo_group}
                            </span>
                        }

                        {(!t.tiene_hijos) && (t.tipo!="milestone") &&
                        <div>
                        <input 
                            class="form-control form-control-sm" 
                            type="text" 
                            // value={tiempoArray[i]||t.tiempo_estimado}
                            value={(typeof(tiempoArray[i]) != "undefined")?tiempoArray[i]:t.tiempo_estimado}
                            style={inputStyle[i]||t.input_style}
                            onChange={(e) => changeTiempo(e.target.value, t.id, i)}
                            />
                        </div>
                        }
                    </td>
                </tr>
            )}
            )}

            </tbody>
            </table>

    )
}

export default DetallesEditar2
