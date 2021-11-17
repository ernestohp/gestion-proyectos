import React from 'react'
import {Table} from 'react-bootstrap';

import TareaEdicion from './TareaEdicion';

const DetallesEditar = ({proyecto, personas, plantillaGlobal, onChangeItem}) => {
    console.log("proyecto", proyecto)

    return (
        <div className="container-fluid">
            {/* <table className="table table-hover table-sm"> */}
            <table>
            <thead >
                <tr>
                <td className="tdth" width="25%">Asunto</td>
                <td className="tdth">Persona</td>
                <td className="tdth">Fecha Inicio</td>
                <td className="tdth">Fecha Fin</td>
                <td className="tdth">Tiempo estimado (h)</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td className="td3">{plantillaGlobal.nombre}</td>
                <td className="td3"></td>
                <td className="td3">{plantillaGlobal.fecha_ini_group}</td>
                <td className="td3">{plantillaGlobal.fecha_fin_group}</td>
                <td className="td3">{plantillaGlobal.tiempo_group}</td>
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
