import {useState} from 'react'

import ListaFiltro    from "./lista/ListaFiltro"
import ListaProyectos from "./lista/ListaProyectos"
import ListaCabecera from "./lista/ListaCabecera"

const ProyectoListado = ({proyectos, onFilter}) => {
    //Mostrar listado----
    const [showFilter, setShowFilter] = useState(false)
    
    //Filtro
    const [defaultValues, setDefaultValues] = useState({
        cliente: 0, product_owner: 0, account_manager: 0, estado: 100, fecha_ini: "", fecha_fin: ""
      });
    const [dataFilter, setDataFilter] = useState({...defaultValues});
    
   
    return (
        <div>
            <ListaCabecera onShowFilter = {() => setShowFilter(!showFilter)} showF = {showFilter} />
            {showFilter &&
            <ListaFiltro 
                onFilter={onFilter} 
                dataFilter={dataFilter} 
                setDataFilter={setDataFilter}
                defaultValues={defaultValues}/>
            }
            <ListaProyectos proyectos={proyectos}/>
        </div>
    )
}

export default ProyectoListado
