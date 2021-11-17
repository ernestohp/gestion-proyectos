import * as Fechas from './../../util/Fechas'
import * as Util from './../../util/Util'

export const getTareasPlantilla = (plantillaGlobal, proyecto) => {
    const tareasBD = proyecto.tareas
    agregarIds(plantillaGlobal.tareas, "", tareasBD, 1)

    const tareaGlobal = {}
    tareaGlobal.nombre = plantillaGlobal.nombre
    if(plantillaGlobal.hasOwnProperty("tareas") && plantillaGlobal.tareas.length > 0){
        tareaGlobal.fecha_ini_group = Fechas.fechaMin(plantillaGlobal.tareas);
        tareaGlobal.fecha_fin_group = Fechas.fechaMax(plantillaGlobal.tareas);
        tareaGlobal.tiempo_group    = Util.sumarTiempos(plantillaGlobal.tareas);
        //---clase tarea global---
        var x_horas = 0
        if (proyecto.x_horas_estimadas != null)
            x_horas = proyecto.x_horas_estimadas
        tareaGlobal.clase_global = (tareaGlobal.tiempo_group > x_horas)?"textRed":"textGreen";
    }
    tareaGlobal.nombre_sangria = tareaGlobal.nombre
    tareaGlobal.tiene_hijos = true

    const tareasFlat = [] 
    tareasFlat.push(tareaGlobal)
    if(plantillaGlobal.hasOwnProperty("tareas") && plantillaGlobal.tareas.length > 0){
        getTareasFlatPlantilla(tareasFlat, plantillaGlobal.tareas, proyecto)
    }

    //---tareas hitos---
    var idN = 100
    const name = "Hito "
    const fecha = "x_fecha_hito_"
    for (var k=1; k<=6; k++) {
        const n = name + k
        const f = fecha + k
        if(proyecto[f]!=null && proyecto[f]!=""){
            const tareahito = {}
            tareahito.id = idN.toString()
            idN = idN + 1
            tareahito.nombre = n
            tareahito.fecha_ini = new Date(proyecto[f])
            tareahito.fecha_fin = new Date(proyecto[f])
            tareahito.persona=0
            tareahito.tiempo_estimado = "0"
            tareahito.nombre_sangria = espacios(2) + tareahito.nombre
            tareahito.tiene_hijos = false
            tareahito.tipo = "milestone"
            tareahito.hijo_global = true
            tareahito.parent= ""
            const tarea = tareasBD.find(t => t.plantilla_id == tareahito.id)
            if(tarea){
                if(tarea.fecha_ini!=null && tarea.fecha_ini!=""){
                    var fechaIni = new Date(tarea.fecha_ini)
                    tareahito.fecha_ini = fechaIni
                }
                if (tarea.fecha_fin!=null && tarea.fecha_fin!=""){
                    var fechaFin = new Date(tarea.fecha_fin)
                    tareahito.fecha_fin = fechaFin
                }
            }
            tareasFlat.push(tareahito)
        }

    }

    if(proyecto != null){
        if(proyecto.x_prev_final!=null && proyecto.x_prev_final!=""){
            const tareaFE = {}
            tareaFE.id = idN.toString()
            tareaFE.nombre = "Entrega del Proyecto"
            tareaFE.fecha_ini = new Date(proyecto.x_prev_final)
            tareaFE.fecha_fin = new Date(proyecto.x_prev_final)
            tareaFE.persona=0
            tareaFE.tiempo_estimado = "0"
            tareaFE.nombre_sangria = espacios(2) + tareaFE.nombre
            tareaFE.tiene_hijos = false
            tareaFE.tipo = "milestone"
            tareaFE.hijo_global = true
            tareaFE.parent= ""
            const tarea2 = tareasBD.find(t => t.plantilla_id == tareaFE.id)
            if(tarea2){
                if(tarea2.fecha_ini!=null && tarea2.fecha_ini!=""){
                    var fechaIni = new Date(tarea2.fecha_ini)
                    tareaFE.fecha_ini = fechaIni
                }
                if (tarea2.fecha_fin!=null && tarea2.fecha_fin!=""){
                    var fechaFin = new Date(tarea2.fecha_fin)
                    tareaFE.fecha_fin = fechaFin
                }
            }
            tareasFlat.push(tareaFE)
        }
    }


    return tareasFlat

}


    //======AGREGAR ID A LA PLANTILLA======
const agregarIds = (tts, prefijo, tareasBD, depth) => {
    for (var k in tts){
        //Codigo----
        var j=parseInt(k)+1
        if(prefijo!=="")
            tts[k].id = prefijo + "-" + (j)
        else
            tts[k].id = prefijo + (j)

        //Nombre-sangria
        const d1 = parseInt(depth)*2;
        const d2 = parseInt(depth)+1;
        tts[k].nombre_sangria = espacios(d1) + tts[k].nombre
        
        tts[k].persona = "0"
        tts[k].fecha_ini = ""
        tts[k].fecha_fin = ""
        tts[k].tiempo_estimado = ""
        tts[k].tipo = "task"
        tts[k].tiene_hijos = false
        tts[k].padre_id = prefijo
        tts[k].parent = prefijo
        tts[k].hijo_global = false
        // tts[k].clase_global = ""
        if(prefijo=="")
            tts[k].hijo_global = true
        if (tareasBD!=null && tareasBD.length > 0){
            const tarea = tareasBD.find(t => t.plantilla_id == tts[k].id)
            if(tarea){
                var fechaIni = ""
                var fechaFin = ""
                if(tarea.fecha_ini!=null && tarea.fecha_ini!=""){
                    fechaIni = new Date(tarea.fecha_ini)
                    // fechaIni.setTime(fechaIni.getTime()+((5*60*60*1000)))    //eliminar en España
                }
                if(tarea.fecha_fin!=null && tarea.fecha_fin!=""){
                    fechaFin = new Date(tarea.fecha_fin)
                    // fechaFin.setTime(fechaFin.getTime()+((5*60*60*1000)))   //eliminar en España
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
            tts[k].tiene_hijos = true
            agregarIds(tts[k].tareas, tts[k].id, tareasBD, d2)
        }
    }
}

const getTareasFlatPlantilla = (tareasFlat, tareasPlantilla, proyecto) => {
    tareasPlantilla.map((t)=>{
        //--persona--
        if(t.nombre=='Account Manager'){
            t.persona = proyecto.account_manager_id
        }
        if(t.nombre=='Project Owner'){
            t.persona = proyecto.project_owner_id
        }

        tareasFlat.push(t)
        if(t.hasOwnProperty("tareas") && t.tareas.length > 0)
        {
            getTareasFlatPlantilla(tareasFlat, t.tareas,proyecto)
        }
    })
}
  
const espacios = (d) =>{
    var text = "";
    for (let i = 0; i <= d; i++) {
        text += '\xa0\xa0';
    }
    return text;
}

export const actualizarTotales = (tTemp) =>{
    var tts = [...tTemp]
    for (var k=1; k<tts.length; k++) {
        if(tts[k].tiene_hijos){
            var tareasHijas = []
            for (var j=0; j<tts.length; j++) {
                if(tts[k].id == tts[j].padre_id){
                    tareasHijas.push(tts[j])
                }
            }
            var newTarea = {...tts[k]}
            newTarea.fecha_ini_group = Fechas.fechaMin(tareasHijas);
            newTarea.fecha_fin_group = Fechas.fechaMax(tareasHijas);
            newTarea.tiempo_group    = Util.sumarTiempos(tareasHijas);
            tts[k] = newTarea
        }
    }
    //tarea Global
    var tareasHijasGlobal = []
    for (var j=0; j<tts.length; j++) {
        if(tts[j].padre_id==""){
            tareasHijasGlobal.push(tts[j])
        }
    }
    var newTareaGlobal = {...tts[0]}
    newTareaGlobal.fecha_ini_group = Fechas.fechaMin(tareasHijasGlobal);
    newTareaGlobal.fecha_fin_group = Fechas.fechaMax(tareasHijasGlobal);
    newTareaGlobal.tiempo_group    = Util.sumarTiempos(tareasHijasGlobal);
    tts[0] = newTareaGlobal

    return tts
}

export const actualizarTotalesVisualizacionTE = (tArray, tTemp) =>{
    var newArray = [...tArray] 
    for (var k=0; k<tTemp.length; k++) {
        if(tTemp[k].tiene_hijos){
            if(tTemp[k].hasOwnProperty("tiempo_group")){
                newArray[k] = tTemp[k].tiempo_group
            }
        }
    }
    return newArray
}

export const actualizarTotalesVisualizacionSD = (tArray, tTemp) => {
    var newArray = [...tArray] 
    for (var k=0; k<tTemp.length; k++) {
        if(tTemp[k].tiene_hijos){
            if(tTemp[k].hasOwnProperty("fecha_ini_group")){
                newArray[k] = tTemp[k].fecha_ini_group
            }
        }
    }
    return newArray
}

export const actualizarTotalesVisualizacionED = (tArray, tTemp) => {
    var newArray = [...tArray] 
    for (var k=0; k<tTemp.length; k++) {
        if(tTemp[k].tiene_hijos){
            if(tTemp[k].hasOwnProperty("fecha_fin_group")){
                newArray[k] = tTemp[k].fecha_fin_group
            }
        }
    }
    return newArray
}


    //--Util para actualizar tarea----
export const actualizar_campo = (campo, value, id, tasksTemp, tasks, personas) => {
    var tTemp = [...tasksTemp]
    if(tasks.length != 0){
        tTemp = [...tasks]
    }
    var ix = 0
    var tarea1 = {}
    for (var j=0; j<tTemp.length; j++) {
        if(tTemp[j].id == id){
            ix = j;
            tarea1 = {...tTemp[j]}
            break;
        }
    }
    tarea1[campo] = value

    if (tarea1.fecha_ini!=null && tarea1.fecha_ini!="" && tarea1.fecha_fin!=null && tarea1.fecha_fin!=""){
        console.log("personas_dentro:", personas)
        console.log("tarea_persona_id:", tarea1.persona)
        const arr_ausencias = obtenerAusencias(personas,tarea1.persona)
        console.log("ausencias:", arr_ausencias)
        const horas = Fechas.horasLaborales2(tarea1.fecha_ini, tarea1.fecha_fin, arr_ausencias)
        var horasIngresadas = (tarea1.tiempo_estimado!="") ? parseInt(tarea1.tiempo_estimado) : 0;

        tarea1.adv = (horasIngresadas > horas)?"horas":"";
        tarea1.horas_entre_fechas = horas
    }

    tTemp[ix] = tarea1
    return tTemp
}

//=========Valores finales para grabar: borrador, clockify, opp===========
export const getTareasFinalBorrador = (tareasFlat, proyecto) => {
    const tareasF = []
    console.log("guardando")
    console.log("guardando",tareasFlat)
    tareasFlat.map((t)=>{
        if(!t.tiene_hijos){
        if((t.persona!="0")||(t.fecha_ini!="")
            ||(t.fecha_fin!="")||(t.tiempo_estimado!="") )
        {
            const tarea = {}
            tarea.proyecto = proyecto.id
            tarea.fecha_ini = (t.fecha_ini!=null&&t.fecha_ini!="")?Fechas.fechaFormat1(t.fecha_ini):"";
            tarea.fecha_fin = (t.fecha_fin!=null&&t.fecha_fin!="")?Fechas.fechaFormat1(t.fecha_fin):"";
            tarea.id = t.id
            tarea.nombre = t.nombre
            tarea.persona = t.persona
            tarea.tiempo_estimado = t.tiempo_estimado
            tareasF.push(tarea)
        }}
        if(t.nombre=='Account Manager'){
            proyecto.account_manager_id = t.persona
        }
        if(t.nombre=='Project Owner'){
            proyecto.project_owner_id = t.persona
        }

    })
    return tareasF
}

export const getTareasFinalClockify = (tareasFlat) => {
    const tareasFC = []
    tareasFlat.map((t)=>{
        const algunoLleno = t.persona!="0" || t.fecha_ini!="" ||t.fecha_fin!=""||t.tiempo_estimado!=""
        const esMilestone = t.tipo=="milestone"
        if(!t.tiene_hijos && algunoLleno && !esMilestone)
        {
            tareasFC.push(t.nombre)
        }
    })
    return tareasFC
}


export const getTareasFinalOpenProject = (tareasFlat,personas) => {
    const tareasFOP = []
    const tareaGlobal = {"nombre":"GLOBAL", "fecha_ini":"", "fecha_fin":"", 
                         "tiempo_estimado": "", "persona":"", "email":"", "parent":"", "tipo": "task"}
    tareasFOP.push(tareaGlobal)        
    tareasFlat.map((t)=>{
        if(t.nombre!="GLOBAL"){
            const newT = {}
            newT.nombre = t.nombre
            newT.fecha_ini = (t.fecha_ini!=null&&t.fecha_ini!="")?Fechas.fechaFormat1(t.fecha_ini):"";
            newT.fecha_fin = (t.fecha_fin!=null&&t.fecha_fin!="")?Fechas.fechaFormat1(t.fecha_fin):"";
            newT.tiempo_estimado = t.tiempo_estimado
            // newT.persona = (t.persona!="")? Util.getNombre(personas, t.persona):""
            newT.parent  = (t.parent!="") ? Util.getTaskName(tareasFlat,t.parent): "GLOBAL"
            newT.tipo = t.tipo

            //---Nombre y email de la persona-----
            newT.persona = ""
            newT.email = ""
            if(t.persona!=""){
                const per = personas.find(p => parseInt(p.id) == parseInt(t.persona))
                if(per){
                    newT.persona = per.name
                    newT.email = per.email
                }
            }

            tareasFOP.push(newT)
        }
    })
    return tareasFOP
}

export const obtenerAusencias = (personas,user_id) => {
    console.log('personasdentro', personas)
    var array_ausencias = []
    personas.map((p)=>{
        if(p.id == user_id){
            array_ausencias = p.ausencias;
        }
    });

    return array_ausencias


}


