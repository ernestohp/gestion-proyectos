import React from 'react'
import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import { useAlert } from 'react-alert'

import DetallesEditar2 from './edicion/DetallesEditar2'
import CabeceraEditar from './edicion/CabeceraEditar'
import ProyectoGraficos from './edicion/ProyectoGraficos'
import ProyectoGraficos2 from './edicion/ProyectoGraficos2'
import ProyectoGraficos3 from './edicion/ProyectoGraficos3'
import DescripcionProyecto from './edicion/DescripcionProyecto'

import * as apiProyectos   from "./../../apis/Proyectos";
import * as apiClockify    from "./../../apis/Clockify";
import * as apiOpenProject from "./../../apis/Openproject"

import * as Fechas from './../util/Fechas'
import * as Util from './../util/Util'
import * as TareasUtil from './edicion/TareasUtil'


const ProyectoEdicion2 = ({personas}) => {
    const alert = useAlert()
    let {id} = useParams();
    const[proyecto, setProyecto] = useState([])
    const [showGrafico, setShowGrafico] = useState(false)
    const[tareasFlatPlantilla, setTareasFlatPlantilla] = useState([])
    

    useEffect (() => {
        const getTareas = async (_id) => {
            const proyFromServer = await apiProyectos.obtenerProyecto(_id)
            const objsFromServer = await apiProyectos.obtenerTareas(_id);
            const p = proyFromServer
            p.tareas = objsFromServer
            setProyecto(p)
        };
        getTareas(id)
    },[])

    //Seleccionar plantilla
    var plantillaGlobal = ""
    const ctx = require.context('./templates', false, /\.(png|json)$/)
    const files = ctx.keys().map(ctx)
    for (const file of files) {
        if(proyecto.plantilla == file.nombre){
            plantillaGlobal = file.detalle
            break
        }
    }
   

    const tareasFlatPlantillaTemp = TareasUtil.getTareasPlantilla(plantillaGlobal, proyecto)
    console.log("ttflat", tareasFlatPlantillaTemp)

    const onChangeItem = () => {
        // console.log("plantillaIn",plantillaGlobal.tareas)
    }

    const handleShowGrafico = () => {
        if (tareasFlatPlantilla.length ==0){
            setTareasFlatPlantilla(tareasFlatPlantillaTemp)
            console.log("tareasFlatPlantillaTemp vacio")
        }
        setShowGrafico(!showGrafico)
    }
    
    

    const guardarBorrador = async(tareasFlat) => {
        alert.info("GUARDANDO BORRADOR...")      
        const tareasFinalBorrador = TareasUtil.getTareasFinalBorrador(tareasFlat, proyecto)
        console.log("guardando tareasFinal",tareasFinalBorrador)
       
        //Grabar tareas--------
        const respuestaGrabar = await apiProyectos.grabarTareas(tareasFinalBorrador);
        console.log(respuestaGrabar)
        
        //Grabar descripcion del proyecto------        
        const respDescripcion = await apiProyectos.grabarProyectoDescripcion_AM_PO(proyecto);
        console.log(respDescripcion)
        alert.success("SE GUARDÓ EL BORRADOR CORRECTAMENTE")
        // guardarProyecto(proyecto)
        // window.location.reload();
    }
    const guardarEnviar = async(tareasFlat, tareasFlatCompletas) => {
        alert.info("ENVIANDO PLANIFICACION...")      
        const tareasFinalBorrador = TareasUtil.getTareasFinalBorrador(tareasFlat, proyecto)
        console.log("guardando tareasFinal",tareasFinalBorrador)
        //Grabar tareas--------
        const respuestaGrabar = await apiProyectos.grabarTareas(tareasFinalBorrador);
        console.log(respuestaGrabar)
        //Grabar descripcion del proyecto------
        const respDescripcion = await apiProyectos.grabarProyectoDescripcion(proyecto);
        console.log(respDescripcion)

        //Grabar en clockify
        const tareasFinalClockify = TareasUtil.getTareasFinalClockify(tareasFlat)
        console.log("enviar a clockify, proyecto", proyecto)
        console.log("enviar a clockify, tareas", tareasFinalClockify)
        const respClockify = await apiClockify.grabarProyectoTareas(proyecto,tareasFinalClockify)
        console.log("respuesta clockify", respClockify)  
        alert.success("SE ENVIÓ EL PROYECTO A CLOCKIFY CORRECTAMENTE")      

        //Grabar en openproject
        console.log("enviar proyecto openproject, tareasFlat:", tareasFlat)
        const tareasFinalOpenproject = TareasUtil.getTareasFinalOpenProject(tareasFlat,personas)
        proyecto.tareas = tareasFinalOpenproject
        console.log("enviar proyecto openproject:", proyecto)
        const respOpenProject = await apiOpenProject.grabarProyectoTareas(proyecto)
        console.log("respuesta openproject:", respOpenProject)
        alert.success("SE ENVIÓ EL PROYECTO Y LAS TAREAS A OPENPROJECT CORRECTAMENTE")      

        window.location.reload();
    }
    

    return (
        <div>
            <CabeceraEditar 
                proyecto={proyecto}
                // tareas={plantillaGlobal.tareas} 
                tareasFlatPlantillaTemp={tareasFlatPlantillaTemp}
                tareasFlatPlantilla = {tareasFlatPlantilla}
                guardarBorrador={guardarBorrador}
                onShowGrafico = {handleShowGrafico} 
                showGrafico = {showGrafico}
                guardarEnviar={guardarEnviar}
            />
            {showGrafico &&
                <ProyectoGraficos3 tareasFlatPlantilla={tareasFlatPlantilla} personas={personas}/>
            }
            <DetallesEditar2 
                proyecto={proyecto} 
                personas={personas}
                tareasFlatPlantillaTemp={tareasFlatPlantillaTemp}
                onChangeItem={onChangeItem}
                setTareasFlatPlantilla = {setTareasFlatPlantilla}
                tareasFlatPlantilla = {tareasFlatPlantilla}
            />
            <DescripcionProyecto proyecto={proyecto} />

        </div>
    )
}

export default ProyectoEdicion2
