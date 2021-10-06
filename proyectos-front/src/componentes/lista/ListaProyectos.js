import React from 'react'
import * as Fechas from './../../util/Fechas'
import { Link } from "react-router-dom"
import './../../styles3.css';

const ListaProyectos = ({proyectos}) => {
    return (
        <div className="container-fluid">
            {/* <table className="table table-hover table-sm"> */}
            <table>
            <thead >
                <tr>
                <td className="tdth2" width="25%">Nombre</td>
                <td className="tdth2">Estado</td>
                <td className="tdth2">Fecha Entrega</td>
                <td className="tdth2">Product Owner</td>
                <td className="tdth2">Account Manager</td>
                <td className="tdth2">Cliente</td>
                </tr>
            </thead>
            <tbody>
            {
                proyectos.map((proyecto, i) => {
                    return (
                        <>
                            <tr>
                                <td className="td2"> 
                                    <Link to={"/proyectos/" + proyecto.id} className="link2"> 
                                        {proyecto.nombre} 
                                    </Link>
                                </td>
                                <td className="td2"> {proyecto.estado} </td>
                                <td className="td2"> {proyecto.fecha_entrega} </td>
                                <td className="td2"> {proyecto.product_owner} </td>
                                <td className="td2"> {proyecto.account_manager} </td>
                                <td className="td2"> {proyecto.cliente} </td>
                            </tr>
                        </>

                    );
                })
            }

            </tbody>
            </table>
            
        </div>
    )
}

export default ListaProyectos
