import {useState} from 'react';
import { Link } from "react-router-dom"
import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FaSave, FaReply, FaRandom, FaChartPie } from "react-icons/fa";
import ModalAdvHoras from './ModalAdvHoras';
import ModalAdvVacios from './ModalAdvVacios';

const CabeceraEditar = ({proyecto, 
                        tareasFlatPlantillaTemp, 
                        tareasFlatPlantilla, 
                        guardarBorrador, 
                        onShowGrafico, 
                        showGrafico, 
                        guardarEnviar}) => {
    
    //---Variable de tareas----
    var tareasFlat = []    
    tareasFlat = [...tareasFlatPlantillaTemp]
    if(tareasFlatPlantilla.length != 0){
        tareasFlat = [...tareasFlatPlantilla]

    }
    const tareasFlatCompletas = []
    // getTareasFlat(tareasFlat, tareasFlatPlantillaTemp, "", tareasFlatCompletas)

    //----mostrar Graficos
    const activeInactive = showGrafico ? " active" : ""
    //----

    //---Advertencia horas globales---
    var x_horas = 0
    if (proyecto.x_horas_estimadas != null)
        x_horas = proyecto.x_horas_estimadas
    var horasGlobales = tareasFlat[0].tiempo_group
    const advHorasTotales = (horasGlobales > x_horas)?true:false;
        
    


    const [mostrarAdvHoras, setMostrarAdvHoras] = useState(false);
    const [mostrarAdvVacios, setMostrarAdvVacios] = useState(false);
    const [showModalB, setShowModalB] = useState(false);
    const [tipo, setTipo] = useState(false);    //b:borrador, e:enviar

    const handleClose = () => setShowModalB(false);
    const handleShow = (tipo) => {
        setTipo(tipo)
        setMostrarAdvHoras(false)
        setMostrarAdvVacios(false)

        tareasFlat.map((t)=>{
            if (t.hasOwnProperty("adv") && t.adv=="horas"){
                setMostrarAdvHoras(true)
            }
            const todosVacios = ((t.persona==0) && 
                                 (t.fecha_ini==null || t.fecha_ini=="")&&
                                 (t.fecha_fin==null || t.fecha_fin=="")&& 
                                 (t.tiempo_estimado==""||t.tiempo_estimado==0))
            const algunoVacio = (t.persona==0) || 
                                (t.fecha_ini==null || t.fecha_ini=="")|| 
                                (t.fecha_fin==null || t.fecha_fin=="")|| 
                                (t.tiempo_estimado==""||t.tiempo_estimado==0)
            const esMilestone = t.tipo=="milestone"
            if (!t.tiene_hijos && algunoVacio && !todosVacios && !esMilestone)
            {
                t.adv="vacios"
                if(tipo=='e')
                    setMostrarAdvVacios(true)
            }
        })
        // console.log("tareasFlat despues de advertencias", tareasFlat)
        setShowModalB(true);
    }


    const handleGuardar=(t)=>{
        if(t=='b')
            guardarBorrador(tareasFlat)
        else
            guardarEnviar(tareasFlat, tareasFlatCompletas)
        handleClose()
    }


    return (
        <div>
        {/*============Titulo y opciones==============*/}
        <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            
            <h6>
                Proyecto: {proyecto.nombre}  
                {(proyecto.x_horas_estimadas!=null) &&
                <small class="text-muted"> 
                    &ensp; (horas vendidas: {proyecto.x_horas_estimadas})
                </small>
                }
            </h6> 
            
            <figure class="text-end">
                <button onClick={onShowGrafico}
                        className={"btn btn-outline-secondary btn-sm" + activeInactive}  
                >
                    <FaChartPie/> Gráficos 
                </button>&nbsp;

                <button type="button"
                        class="btn btn-outline-secondary  btn-sm" 
                        onClick={()=>handleShow('b')}
                >
                    <FaSave/> Guardar Borrador 
                </button> 
                &nbsp;
                <button class="btn btn-outline-secondary  btn-sm" 
                        onClick={()=>handleShow('e')}
                >
                    <FaRandom/> Enviar 
                </button>&nbsp;
                <Link to="/" className="btn btn-outline-secondary btn-sm"> 
                    <FaReply/> Volver
                </Link>
            </figure>
        </div>
        </nav>

        {/*============Modal==============*/}
        <Modal show={showModalB} onHide={handleClose} size="lg">
            <Modal.Header>
                <Modal.Title>
                    {(tipo=='b')&&<span>Guardar Borrador</span> }
                    {(tipo=='e')&&<span>Enviar Planificacion</span> }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* =======Mostrar advertencia de horas globales===== */}
                {advHorasTotales &&
                <>
                <b>Advertencia: </b>  Las horas calculadas (<b>{horasGlobales}</b>) 
                son mayores que las horas vendidas (<b>{x_horas}</b>)
                </>
                }
                <br/><br/>


                {/* =======Mostrar advertencia de horas===== */}
                {mostrarAdvHoras &&
                    <ModalAdvHoras tareasFlat={tareasFlat} proyecto={proyecto}/>
                }
                <br/>
                {/* =======Mostrar advertencia de faltantes===== */}
                {mostrarAdvVacios &&
                    <ModalAdvVacios tareasFlat={tareasFlat}/>
                }
                {(tipo=='b' || !mostrarAdvVacios) &&
                    <span>¿Está seguro de guardar el proyecto?</span>
                }
            </Modal.Body>
            <Modal.Footer>

                <button variant="secondary" 
                        onClick={handleClose} 
                        class="btn btn-outline-secondary active btn-sm" >
                    Volver
                </button>
                {(tipo=='b' || !mostrarAdvVacios) &&
                <button variant="primary" 
                        onClick={() => handleGuardar(tipo)} 
                        class="btn btn-outline-primary active btn-sm">
                    Guardar
                </button>
                }
            </Modal.Footer>
        </Modal>
        </div>        
    )
}

export default CabeceraEditar
