import React from 'react'

import TareaEdicion from './TareaEdicion';

const DetallesEditar = ({proyecto, personas, plantillaGlobal, onChangeItem}) => {
    console.log("proyecto", proyecto)

    return (
        <div className="container-fluid">
            <table className="table table-hover table-sm">
            <thead className="table-light">
                <tr>
                <th scope="col">Asunto</th>
                <th scope="col">Persona</th>
                <th scope="col">Fecha Inicio</th>
                <th scope="col">Fecha Fin</th>
                <th scope="col">Tiempo estimado (h)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>{plantillaGlobal.nombre}</td>
                <td></td>
                <td>{plantillaGlobal.fecha_ini_group}</td>
                <td>{plantillaGlobal.fecha_fin_group}</td>
                <td>{plantillaGlobal.tiempo_group}</td>
                </tr>
                 <TareaEdicion 
                    tareas={plantillaGlobal.tareas} 
                    depth="1" 
                    personas={personas}
                    onChangeItem = {onChangeItem}
                    />
            </tbody>
            </table>

        </div>
    )
}

export default DetallesEditar
