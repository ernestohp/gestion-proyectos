import React from 'react'
import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import { useAlert } from 'react-alert'
import DetallesEditar from './edicion/DetallesEditar'
import CabeceraEditar from './edicion/CabeceraEditar'
import ProyectoGraficos from './edicion/ProyectoGraficos'
import DescripcionProyecto from './edicion/DescripcionProyecto'
import * as apiProyectos from "./../apis/Proyectos";
import * as apiClockify from "./../apis/Clockify";
import * as apiOpenProject from "./../apis/Openproject"

import * as Fechas from './../util/Fechas'
import * as Util from './../util/Util'
import plantilla from "./../apis/PlantillaProyecto"


const ProyectoEdicion = ({personas}) => {
    const alert = useAlert()
    let {id} = useParams();
    const[proyecto, setProyecto] = useState([])
    const [showGrafico, setShowGrafico] = useState(false)

    useEffect (() => {
        const getTareas = async (_id) => {
            const proyFromServer = await apiProyectos.obtenerProyecto(_id)
            const objsFromServer = await apiProyectos.obtenerTareas(_id);
            // const p = proyectos.find(item => item.id == id)
            const p = proyFromServer
            p.tareas = objsFromServer
            setProyecto(p)
        };
        getTareas(id)
    },[])
    

    const plantillaGlobal = plantilla.PlantillaGlobal
    //======AGREGAR ID A LA PLANTILLA======
    const agregarIds = (tts, prefijo) => {
        for (var k in tts){
            var j=parseInt(k)+1
            if(prefijo!=="")
                tts[k].id = prefijo + "-" + (j)
            else
                tts[k].id = prefijo + (j)

            tts[k].persona = "0"
            tts[k].fecha_ini = ""
            tts[k].fecha_fin = ""
            tts[k].tiempo_estimado = ""
            if ((proyecto.hasOwnProperty("tareas") && proyecto.tareas.length > 0)){
                const tarea = proyecto.tareas.find(t => t.plantilla_id == tts[k].id)
                if(tarea){
                    var fechaIni = ""
                    var fechaFin = ""
                    if(tarea.fecha_ini!=null && tarea.fecha_ini!=""){
                        fechaIni = new Date(tarea.fecha_ini)
                        fechaIni.setTime(fechaIni.getTime()+((5*60*60*1000)))
                    }
                    if(tarea.fecha_fin!=null && tarea.fecha_fin!=""){
                        fechaFin = new Date(tarea.fecha_fin)
                        fechaFin.setTime(fechaFin.getTime()+((5*60*60*1000)))
                    }
                    var tiempo_estimado = (tarea.tiempo_estimado==0)?"":tarea.tiempo_estimado;

                    tts[k].persona = tarea.persona
                    tts[k].fecha_ini = fechaIni
                    tts[k].fecha_fin = fechaFin
                    tts[k].tiempo_estimado = tiempo_estimado
                }
            }
            
            //Campos horas_entre_fechas y adv
            if (tts[k].fecha_ini!="" && tts[k].fecha_fin!=""){
                const horas = Fechas.horasLaborales(tts[k].fecha_ini, tts[k].fecha_fin)
                var horasIngresadas = (tts[k].tiempo_estimado!="") ? parseInt(tts[k].tiempo_estimado) : 0;
                tts[k].horas_entre_fechas = horas
                tts[k].adv=(horasIngresadas > horas)?"horas":"";   
                //Solo para el estilo del texto e tiempo estimado
                tts[k].input_style = (horasIngresadas>horas)?{borderColor:"brown", color:"orange"}:{};
            }
            if (tts[k].hasOwnProperty("tareas") && tts[k].tareas.length > 0){
                tts[k].fecha_ini_group = Fechas.fechaMin([...tts[k].tareas]);
                tts[k].fecha_fin_group = Fechas.fechaMax(tts[k].tareas);
                tts[k].tiempo_group    = Util.sumarTiempos(tts[k].tareas);
                agregarIds(tts[k].tareas, tts[k].id)
            }
        }
    }
    agregarIds(plantillaGlobal.tareas, "")
    //Totales para plantillaGlobal
    console.log("antes de llamar a group de plantilla global")
    plantillaGlobal.fecha_ini_group = Fechas.fechaMin([...plantillaGlobal.tareas]);
    plantillaGlobal.fecha_fin_group = Fechas.fechaMax(plantillaGlobal.tareas);
    plantillaGlobal.tiempo_group    = Util.sumarTiempos(plantillaGlobal.tareas);

    console.log("plantillaOut",plantillaGlobal.tareas)
    const onChangeItem = () => {
        // console.log("plantillaIn",plantillaGlobal.tareas)
    }

    const getTareasFinal = (tareasFlat) => {
        const tareasF = []
        console.log("guardando")
        console.log("guardando",tareasFlat)
        tareasFlat.map((t)=>{
            const tarea = {}
            tarea.proyecto = proyecto.id
            tarea.fecha_ini = (t.fecha_ini!=null&&t.fecha_ini!="")?Fechas.fechaFormat1(t.fecha_ini):"";
            tarea.fecha_fin = (t.fecha_fin!=null&&t.fecha_fin!="")?Fechas.fechaFormat1(t.fecha_fin):"";
            tarea.id = t.id
            tarea.nombre = t.nombre
            tarea.persona = t.persona
            tarea.tiempo_estimado = t.tiempo_estimado
            tareasF.push(tarea)
        })
        return tareasF
    }

    const getTareasFinalClockify = (tareasFlat) => {
        const tareasFC = []
        tareasFlat.map((t)=>{
            tareasFC.push(t.nombre)
        })
        return tareasFC
    }

    const getTareasFinalOpenProject = (tareasFlat) => {
        const tareasFOP = []
        const tareaGlobal = {"nombre":"GLOBAL", "fecha_ini":"", "fecha_fin":"", 
                             "tiempo_estimado": "", "persona":"", "parent":""}
        tareasFOP.push(tareaGlobal)
        tareasFlat.map((t)=>{
            const newT = {}
            newT.nombre = t.nombre
            newT.fecha_ini = (t.fecha_ini!=null&&t.fecha_ini!="")?Fechas.fechaFormat1(t.fecha_ini):"";
            newT.fecha_fin = (t.fecha_fin!=null&&t.fecha_fin!="")?Fechas.fechaFormat1(t.fecha_fin):"";
            newT.tiempo_estimado = t.tiempo_estimado
            newT.persona = (t.persona!="")? Util.getNombre(personas, t.persona):""
            newT.parent  = (t.parent!="") ? t.parent: "GLOBAL" 
            tareasFOP.push(newT)
        })
        console.log("tareasFOP",tareasFOP)
        return tareasFOP
    }



    const guardarBorrador = async(tareasFlat) => {
        alert.info("GUARDANDO BORRADOR...")      
        const tareasFinal = getTareasFinal(tareasFlat)
        console.log("guardando",tareasFlat)
        // console.log("tareas JSON",JSON.stringify({"tareas": tareasFinal}))
       
        //Grabar tareas--------
        const respuestaGrabar = await apiProyectos.grabarTareas(tareasFinal);
        console.log(respuestaGrabar)
        //Grabar descripcion del proyecto------
        const respDescripcion = await apiProyectos.grabarProyectoDescripcion(proyecto);
        console.log(respDescripcion)
        alert.success("SE GUARDÓ EL BORRADOR CORRECTAMENTE")
        // guardarProyecto(proyecto)
        // window.location.reload();
    }
    const guardarEnviar = async(tareasFlat, tareasFlatCompletas) => {
        alert.info("ENVIANDO PLANIFICACION...")      
        const tareasFinal = getTareasFinal(tareasFlat)
        //Grabar tareas--------
        const respuestaGrabar = await apiProyectos.grabarTareas(tareasFinal);
        console.log(respuestaGrabar)
        //Grabar descripcion del proyecto------
        const respDescripcion = await apiProyectos.grabarProyectoDescripcion(proyecto);
        console.log(respDescripcion)

        //Grabar en clockify
        const tareasFinalClockify = getTareasFinalClockify(tareasFlat)
        console.log("enviar a clockify, proyecto", proyecto)
        console.log("enviar a clockify, tareas", tareasFinalClockify)
        const respClockify = await apiClockify.grabarProyectoTareas(proyecto,tareasFinalClockify)
        console.log("respuesta clockify", respClockify)  
        alert.success("SE ENVIÓ EL PROYECTO A CLOCKIFY CORRECTAMENTE")      

        //Grabar en openproject
        const tareasFinalOpenproject = getTareasFinalOpenProject(tareasFlatCompletas)
        proyecto.tareas = tareasFinalOpenproject
        console.log("enviar proyecto openproject:", proyecto)
        const respOpenProject = await apiOpenProject.grabarProyectoTareas(proyecto)
        console.log("respuesta openproject:", respOpenProject)
        alert.success("SE ENVIÓ EL PROYECTO Y LAS TAREAS A OPENPROJECT CORRECTAMENTE")      

        // window.location.reload();
    }
    

    return (
        <div>
            <CabeceraEditar 
                proyecto={proyecto}
                tareas={plantillaGlobal.tareas} 
                guardarBorrador={guardarBorrador}
                onShowGrafico = {() => setShowGrafico(!showGrafico)} 
                showGrafico = {showGrafico}
                guardarEnviar={guardarEnviar}
            />
            {showGrafico &&
            <ProyectoGraficos plantillaGlobal={plantillaGlobal} personas={personas}/>
            }
            <DetallesEditar 
                proyecto={proyecto} 
                personas={personas}
                plantillaGlobal={plantillaGlobal}
                onChangeItem={onChangeItem}
            />
            <DescripcionProyecto proyecto={proyecto} />

        </div>
    )
}

export default ProyectoEdicion
