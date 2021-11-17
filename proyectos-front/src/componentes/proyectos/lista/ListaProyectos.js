import React from 'react'
import {useState, useEffect} from 'react';
import { Link } from "react-router-dom"
import './../../../styles3.css';

const ListaProyectos = ({proyectos}) => {

    return (
        <div className="container-fluid">
            <table>
            <thead >
                <tr>
                <td className="tdth" width="25%">Nombre</td>
                <td className="tdth">Estado</td>
                <td className="tdth">Fecha Entrega</td>
                <td className="tdth">Product Owner</td>
                <td className="tdth">Account Manager</td>
                <td className="tdth">Cliente</td>
                </tr>
            </thead>
            <tbody>
            {
                proyectos.map((proyecto, i) => {
                    return (
                        <>
                        <tr>
                            <td> 
                                {(proyecto.estado_id==100) &&
                                <Link to={"/proyectos/plantilla/" + proyecto.id } className="link2"> 
                                    {proyecto.nombre} 
                                </Link>
                                }

                                {(proyecto.estado_id!=100) &&
                                <Link to={"/proyectos/" + proyecto.id} className="link2"> 
                                    {proyecto.nombre} 
                                </Link>
                                }
                            </td>
                            <td> {proyecto.estado} </td>
                            <td> {proyecto.fecha_entrega} </td>
                            <td> {proyecto.project_owner} </td>
                            <td> {proyecto.account_manager} </td>
                            <td> {proyecto.cliente} </td>
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
