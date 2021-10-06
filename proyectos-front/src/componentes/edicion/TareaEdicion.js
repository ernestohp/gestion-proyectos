import React from 'react'
import {useState} from 'react'
import { Alert, Badge, Card} from 'react-bootstrap';

import * as Fechas from './../../util/Fechas'

//DatePicker-----------
import DatePicker from 'react-datepicker'
import {registerLocale, setDefaultLocale} from  "react-datepicker";
import es from 'date-fns/locale/es';
//---------------------


const TareaEdicion = ({tareas, depth, personas, onChangeItem}) => {

    //DatePicker----
    registerLocale('es', es)
    setDefaultLocale('es')
    const [startDate, setStartDate] = useState([]);
    const [endDate,   setEndDate]   = useState([]);
    //Componentes-----
    const [personasArray, setPersonasArray] = useState([]);
    const [tiempoArray, setTiempoArray] = useState([]);
    const [inputStyle, setInputStyle] = useState([]);

    const addStartDate = (d1, id, i) => {
        var sd1 = [...startDate]
        sd1[i] = d1
        setStartDate(sd1); 
        const t = tareas.find(t => t.id == id)
        t.fecha_ini = d1
        colorTexto(t, i)
        // cambiarFechaInicioGroup(sd1, t)
    }
    const addEndDate = (d1, id, i) => {
        var sd1 = [...endDate]
        sd1[i] = d1
        setEndDate(sd1); 
        const t = tareas.find(t => t.id == id)
        t.fecha_fin = d1
        colorTexto(t, i)
        //onChangeItem()
    }
    const changePersona = (event, id, i) => {
        var p1 = [...personasArray]
        p1[i] = parseInt(event.target.value)
        setPersonasArray(p1);
        const t = tareas.find(t => t.id == id)
        t.persona = parseInt(event.target.value)
    };

    const changeTiempo = (value, id, i) => {
        //Valor del texto
        let isnum = /^\d+$/.test(value);
        var txtValue= (value!="" && isnum) ? parseInt(value) : "";

        //Visualizacion
        var t1 = [...tiempoArray]        
        t1[i] = txtValue
        setTiempoArray(t1);
        //JSON de tareas
        const t = tareas.find(tarea => tarea.id == id)
        t.tiempo_estimado = txtValue
        //Color del texto
        colorTexto(t, i)
        onChangeItem()
    };

    const colorTexto = (t, i) => {
        if (t.fecha_ini!=null && t.fecha_ini!="" && t.fecha_fin!=null && t.fecha_fin!=""){
            const horas = Fechas.horasLaborales(t.fecha_ini, t.fecha_fin)
            var horasIngresadas = (t.tiempo_estimado!="") ? parseInt(t.tiempo_estimado) : 0;

            var is = [...inputStyle]
            is[i] = (horasIngresadas > horas)?{borderColor:"brown",  color:"orange"}:{};
            setInputStyle(is);

            t.adv = (horasIngresadas > horas)?"horas":"";
            t.horas_entre_fechas = horas
        }
    }
    
    const cambiarFechaFinGroup=()=>{
        
    }
    const cambiarTiempoGroup=()=>{
        
    }


//===Sangria del nombre de Tarea=======
    const d1 = parseInt(depth)*2;
    const d2 = parseInt(depth)+1;
    const espacios = (d) =>{
        var text = "";
        for (let i = 0; i <= d; i++) {
            text += '\xa0\xa0';
        }
        return text;
    }

//===HTML principal=======
    return (
        <>
        {
            tareas.map((tarea, index) => {
            
            return (
                <>
                    <tr>
                        {/*===============NOMBRE======================*/}
                        <td> 
                            {espacios(d1)}  {tarea.nombre || tarea}
                        </td>

                        {/*===============PERSONAS======================*/}
                        <td>
                            {(!(tarea.hasOwnProperty("tareas") && tarea.tareas.length > 0)) &&
                            <select 
                                className="form-select form-select-sm" 
                                value={personasArray[index] || tarea.persona}
                                onChange={(e) => changePersona(e, tarea.id, index)}
                                >
                            <option value="0">-</option>
                            {personas.map((r, i)=>(
                                <option key={i} value={r.id}>{r.nombre}</option>
                            ))}
                            </select>
                            }
                        </td>
                        
                        {/*===============FECHA INICIO======================*/}
                        <td>
                        {((tarea.hasOwnProperty("tareas") && tarea.tareas.length > 0)) &&
                        // <Card style={{width: '12rem', height:'2.5rem' }}>
                        //     <Card.Header style={{width:'12rem', height:'2.5rem'}}>
                                <span>{tarea.fecha_ini_group}</span>
                        //     </Card.Header>
                        // </Card>
                        }                        

                        {(!(tarea.hasOwnProperty("tareas") && tarea.tareas.length > 0)) &&
                            <DatePicker
                                selected={startDate[index] || tarea.fecha_ini}
                                onChange={(date) => addStartDate(date, tarea.id, index)}
                                selectsStart
                                startDate={startDate[index]}
                                endDate={endDate[index]}
                                dateFormat="dd/MM/yyyy"
                            />
                            // <DatePicker selected={tarea.fecha_ini} onChange={(date) => addStartDate(date, index)} />
                        }
                        </td>

                        {/*===============FECHA FIN======================*/}
                        <td>
                        {((tarea.hasOwnProperty("tareas") && tarea.tareas.length > 0)) &&
                        // <Card style={{width:'12rem', height:'2.5rem'}}>
                        //     <Card.Header style={{width:'12rem', height:'2.5rem'}}>
                                <span>{tarea.fecha_fin_group}</span>
                        //     </Card.Header>
                        // </Card>
                        }                        


                        {(!(tarea.hasOwnProperty("tareas") && tarea.tareas.length > 0)) &&
                        <DatePicker
                            selected={endDate[index] || tarea.fecha_fin }
                            onChange={(date) => addEndDate(date, tarea.id, index)}
                            selectsEnd
                            startDate={startDate[index]}
                            endDate={endDate[index]}
                            minDate={startDate[index]}
                            dateFormat="dd/MM/yyyy"
                        />
                        // <DatePicker selected={tarea.fecha_fin} onChange={(date) => addEndDate(date, index)} />
                        }
                        </td>
                        {/*===============TIEMPO ESTIMADO======================*/}
                        <td>
                        {((tarea.hasOwnProperty("tareas") && tarea.tareas.length > 0)) &&
                        // <Card style={{width:'12rem', height:'2.5rem'}}>
                        //     <Card.Header style={{width:'12rem', height:'2.5rem'}}>
                            <span>{tarea.tiempo_group}</span>
                        //     </Card.Header>
                        // </Card>
                        }                        

                        {(!(tarea.hasOwnProperty("tareas") && tarea.tareas.length > 0)) &&
                        <input 
                            class="form-control form-control-sm" 
                            type="text" 
                            value={tiempoArray[index]||tarea.tiempo_estimado}
                            style={inputStyle[index]||tarea.input_style}
                            onChange={(e) => changeTiempo(e.target.value, tarea.id, index)}
                            />
                        }
                        </td>
                    </tr>
                    {(tarea.hasOwnProperty("tareas") && tarea.tareas.length > 0) &&
                        <TareaEdicion 
                            tareas={tarea.tareas} 
                            depth={d2} 
                            personas={personas}
                            onChangeItem = {onChangeItem}/>
                    }
                </>

            );
            })
        }
        </>
    )
}

export default TareaEdicion
