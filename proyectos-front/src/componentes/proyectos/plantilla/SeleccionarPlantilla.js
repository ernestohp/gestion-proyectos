import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {FaCheck, FaReply } from "react-icons/fa";
import { Link } from "react-router-dom"
import * as apiProyectos from "./../../../apis/Proyectos";
import * as Constantes from './../Constantes'

const SeleccionarPlantilla = () => {
    let {id} = useParams();
    console.log("id,",id)
    const[proyecto, setProyecto] = useState({})
    //Lista de plantillas
    const [plantillas, setPlantillas] = useState([]);
    const [plantilla, setPlantilla] = useState(Constantes.DAFAULT_TEMPLATE);

    useEffect (() => {
        const getProyectoFromServer = async (_id) => {
            const objFromServer = await apiProyectos.obtenerProyecto(_id)
            const p = objFromServer
            setProyecto(p)
        };
        getProyectoFromServer(id)

        const obtenerPlantillas = () => {
            const pps = []

            const ctx = require.context('./../templates', false, /\.(png|json)$/)
            const files = ctx.keys().map(ctx)

            for (const file of files) {
                // var keys = Object.keys(file);
                // pps.push(keys[0])
                pps.push(file.nombre)
            }
            //ubicar el elemento por defecto al inicio
            const i = pps.indexOf(Constantes.DAFAULT_TEMPLATE)
            const p = pps[i]
            pps.splice(i,1)
            pps.unshift(p)

            setPlantillas(pps)
        }
        obtenerPlantillas()
    },[])

    const handleChangeSelect = (event) =>{
        const newValue = event.target.value
        setPlantilla(newValue)
    }

    const handleAceptar = async() => {
        const newProyecto = {}
        newProyecto.id = proyecto.id
        newProyecto.plantilla = plantilla
        const respServer = await apiProyectos.grabarProyectoPlantilla(newProyecto);
        console.log(respServer)

        window.location.href = "/proyectos/" + proyecto.id
    }
    // const handleCancelar = async() => {
    //     window.location.href = "/proyectos/"
    // }

    return (
        <div>
        
        <nav class="navbar navbar-light bg-light">
            <div class="container-fluid">
                <h6>Proyecto: {proyecto.nombre}</h6>
            </div>
        </nav>        

            <br/>
        <div class="container-fluid">
        <div className="card bg-light">
        <div class="card-body">
        {/* <div className="alert alert-light"> */}


            <div class="row">
                <div className="col-1">
                    <label htmlFor="plantillas1" className="label1">Plantilla: *</label>
                </div>
                <div class="col-md-3">
                    <select className="form-select form-select-sm" 
                            id="plantillas1"
                            value={plantilla}
                            onChange={handleChangeSelect}
                    >
                        {plantillas.map((p, i)=>(
                            <option key={i} value={p}>{p}</option>
                        ))}
                    </select> 

                </div>
            </div>



            {/* -----OPCIONES----- */}

            <div className="row justify-content-start">
            <div className="col-1"></div>
            <div className="col-auto">
              <br />
              <button variant="primary" 
                        onClick={handleAceptar} 
                        // class="btn btn-secondary btn-sm boton1">
                        class="btn btn-secondary btn-sm">
                    <FaCheck/> Aceptar
              </button>&nbsp;

              <Link to="/proyectos" className="btn btn-secondary btn-sm"> 
                    <FaReply/> Cancelar
              </Link>

              <br/><br/>
                    <div class="alert alert-warning" role="alert">
                        * Recuerde que una vez que grabe borrador no podrá cambiar de plantilla.
                    </div>

            </div>
          </div>

        {/* </div> */}
        </div>
        </div>
        </div>




 



        </div>
    )
}

export default SeleccionarPlantilla
