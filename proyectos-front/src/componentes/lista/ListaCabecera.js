import React from 'react'
import { FaFilter } from 'react-icons/fa';

const ListaCabecera = ({onShowFilter, showF}) => {
    
    const activeInactive = showF ? " active" : ""

    return (
        <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
            <h6>Lista de Proyectos</h6>
                <button 
                    className={"btn btn-outline-secondary" + activeInactive} 
                    onClick={onShowFilter}
                >
                    <FaFilter /> Filtros
                </button>
        </div>
        </nav>        
    )
}

export default ListaCabecera
