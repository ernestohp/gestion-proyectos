import {useState} from 'react';
import { Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FaSave, FaReply, FaRandom, FaChartPie } from "react-icons/fa";
import ModalAdvHoras from './ModalAdvHoras';
import ModalAdvVacios from './ModalAdvVacios';

const CabeceraEditar = ({proyecto, tareas, guardarBorrador, onShowGrafico, showGrafico, guardarEnviar}) => {
    //----mostrar Graficos
    const activeInactive = showGrafico ? " active" : ""
    //----
    
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
            if ((t.persona==0) || 
                (t.fecha_ini==null || t.fecha_ini=="")|| 
                (t.fecha_fin==null || t.fecha_fin=="")|| 
                (t.tiempo_estimado==""||t.tiempo_estimado==0))
                {
                    t.adv="vacios"
                    if(tipo=='e')
                        setMostrarAdvVacios(true)
                }
        })
        setShowModalB(true);
    }
    const handleGuardar=(t)=>{
        if(t=='b')
            guardarBorrador(tareasFlat)
        else
            guardarEnviar(tareasFlat, tareasFlatCompletas)
        handleClose()
    }

    const getTareasFlat = (tareasFlat, tareasPlantilla, tareaPadre, tareasFlatCompletas) => {
        tareasPlantilla.map((t)=>{
            if(!(t.hasOwnProperty("tareas") && t.tareas.length > 0))
            {
                if((t.persona!="0")||(t.fecha_ini!="")
                    ||(t.fecha_fin!="")||(t.tiempo_estimado!="") )
                {
                    t.parent = tareaPadre
                    tareasFlat.push(t)
                    tareasFlatCompletas.push(t) //para openprojet
                }
            }else{
                t.parent = tareaPadre
                tareasFlatCompletas.push(t)  //para openprojet
                getTareasFlat(tareasFlat, t.tareas, t.nombre, tareasFlatCompletas)
            }
        })
    }
    const tareasFlat = []    
    const tareasFlatCompletas = []
    getTareasFlat(tareasFlat, tareas, "", tareasFlatCompletas)

    return (
        <div>
        {/*============Titulo y opciones==============*/}
        <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <h6>Proyecto: {proyecto.nombre}</h6>
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
                <a href="/" className="btn btn-outline-secondary  btn-sm"><FaReply/> Volver</a>
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

                {/* =======Mostrar advertencia de horas===== */}
                {mostrarAdvHoras &&
                    <ModalAdvHoras tareasFlat={tareasFlat} />
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
