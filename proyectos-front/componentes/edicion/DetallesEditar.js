import React from 'react'

import TareaEdicion from './TareaEdicion';

const DetallesEditar = ({proyecto, personas, plantillaGlobal, onChangeItem}) => {
    console.log("proyecto", proyecto)

    return (
        <div className="container-fluid">
            {/* <table className="table table-hover table-sm"> */}
            <table>
            <thead className="table-light">
                <tr>
                <td className="tdth2" width="25%">Asunto</td>
                <td className="tdth2">Persona</td>
                <td className="tdth2">Fecha Inicio</td>
                <td className="tdth2">Fecha Fin</td>
                <td className="tdth2">Tiempo estimado (h)</td>
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
