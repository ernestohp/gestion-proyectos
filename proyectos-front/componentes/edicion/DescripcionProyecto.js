import {useState} from 'react'

const DescripcionProyecto = ({proyecto}) => {

    const[pDescripcion, setPDescripcion] = useState(proyecto.descripcion)
    const onChageTextArea = (e) => {
        setPDescripcion(e.target.value)
        proyecto.descripcion = e.target.value
    }

    // console.log("proyecto descripcion:",proyecto.descripcion)
    return (
        <div className="card">
        <div class="card-body">
            <div className="alert alert-secondary">
                <div className="row justify-content-start">
                    <div className="col-2">
                        <label htmlFor="exampleInputEmail1" className="form-label">Descripción del Proyecto:</label>
                    </div>
                    <div className="col-6">
                        <textarea 
                            class="form-control" 
                            rows="3" 
                            value={pDescripcion}
                            defaultValue = {proyecto.descripcion}
                            onChange={(e) => onChageTextArea(e)}
                            placeholder="Ingrese la descripción del proyecto">
                        </textarea>
                    </div>
                </div>


              
            </div>
        </div>
        </div>
    )
}

export default DescripcionProyecto
