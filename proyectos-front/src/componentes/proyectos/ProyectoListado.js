import {useState, useEffect} from 'react'

import ListaFiltro    from "./lista/ListaFiltro"
import ListaProyectos from "./lista/ListaProyectos"
import ListaCabecera from "./lista/ListaCabecera"
import * as apiProyectos from './../../apis/Proyectos'
import * as Fechas from './../util/Fechas'

const ProyectoListado = ({personas}) => {
    //Lista proyectos
    const[proyectos, setProyectos] = useState([])
    const[proyectosOrig, setProyectosOrig] = useState([])
    //Mostrar filtros----
    const [showFilter, setShowFilter] = useState(false)
    //Filtro
    const [defaultValues, setDefaultValues] = useState({
        cliente: 0, project_owner: 0, account_manager: 0, estado: 0, fecha_ini: "", fecha_fin: ""
      });
    const [dataFilter, setDataFilter] = useState({...defaultValues});

    useEffect (
        () => {
            const getProyectos = async () => {
                const prosFromServer = await apiProyectos.obtenerProyectos()
                setProyectos(prosFromServer)
                setProyectosOrig(prosFromServer)
            }
            getProyectos()    
        },[])

//=================FILTRAR EL LISTADO=================
    const onFilter = (data) => {
        var newProyectos = [...proyectosOrig]
        if(data.cliente!==0){
        newProyectos = newProyectos.filter(function (entry) {
            return (entry.cliente_id === data.cliente);
        });
        }
        if(data.account_manager!==0){
        newProyectos = newProyectos.filter(function (entry) {
            return (entry.account_manager_id === data.account_manager);
        });
        }
        if(data.project_owner!==0){
        newProyectos = newProyectos.filter(function (entry) {
            return (entry.project_owner_id === data.project_owner);
        });
        }
        if(data.estado!==0){
        newProyectos = newProyectos.filter(function (entry) {
            return (entry.estado_id === data.estado);
        });
        }
        if(data.fecha_ini!=""){
        newProyectos = newProyectos.filter(function (entry) {
            if (entry.fecha_entrega !=null && entry.fecha_entrega !=""){
                const d1 = Fechas.getFecha1(entry.fecha_entrega)
                return (d1 >= data.fecha_ini);
            }else
                return false;
        });
        }
        if(data.fecha_fin!=""){
        newProyectos = newProyectos.filter(function (entry) {
            const d1 = Fechas.getFecha1(entry.fecha_entrega)
            console.log(d1)
            return (d1 <= data.fecha_fin);
        });
        }
        console.log("newProyectos", newProyectos)
        setProyectos(newProyectos);
    }
        
   
    return (
        <div>
            <ListaCabecera onShowFilter = {() => setShowFilter(!showFilter)} showF = {showFilter} />
            {showFilter &&
            <ListaFiltro 
                onFilter={onFilter} 
                dataFilter={dataFilter} 
                setDataFilter={setDataFilter}
                defaultValues={defaultValues}
                personas={personas}/>
            }
            <ListaProyectos proyectos={proyectos}/>
        </div>
    )
}

export default ProyectoListado
