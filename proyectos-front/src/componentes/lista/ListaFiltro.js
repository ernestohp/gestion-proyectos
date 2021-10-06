import { useState, useEffect } from "react";
import * as apiProyectos from "./../../apis/Proyectos";

//DatePicker-----------
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
//---------------------

const ListaFiltro = ({ onFilter, dataFilter, setDataFilter, defaultValues }) => {
  //=======LISTADO DE OBJETOS PARA LOS SELECT======
  const [clientes, setClientes] = useState([]);
  const [powners, setPowners] = useState([]);
  const [amanagers, setAmanagers] = useState([]);

  //============FILTRAR========================
  // const [defaultValues, setDefaultValues] = useState({
  //   cliente: 0, product_owner: 0, account_manager: 0, estado: 100, fecha_ini: "", fecha_fin: ""
  // });
  // const [dataFilter, setDataFilter] = useState({...defaultValues});

  const onChangeAManager = (event) => {
    const newDataFilter = {...dataFilter, account_manager: parseInt(event.target.value)};
    setDataFilter(newDataFilter);
  };
  const onChangeCliente = (event) => {
    const newDataFilter = {...dataFilter, cliente: parseInt(event.target.value)};
    setDataFilter(newDataFilter);
  };
  const onChangePOwner = (event) => {
    const newDataFilter = {...dataFilter, product_owner: parseInt(event.target.value)};
    setDataFilter(newDataFilter);
  };
  const onChangeEstado = (event) => {
    const newDataFilter = {...dataFilter, estado: parseInt(event.target.value)};
    setDataFilter(newDataFilter);
  };



  //============LIMPIAR========================
  const limpiarFiltros = () => {
    setDataFilter({...defaultValues});
    onFilter({...defaultValues})
  };

  //DatePicker=============
  registerLocale("es", es);
  setDefaultLocale("es");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const addStartDate = (d1) => {
    setStartDate(d1); 
    const fecha1 = (d1==null)?"":d1;
    const newDataFilter = {...dataFilter, fecha_ini: fecha1};
    setDataFilter(newDataFilter);
  }
  const addEndDate = (d1) => {
    setEndDate(d1);
    const fecha1 = (d1==null)?"":d1;
    const newDataFilter = {...dataFilter, fecha_fin: fecha1};
    setDataFilter(newDataFilter);
  }
  
  //========================

  useEffect(() => {
    const getClientes = async () => {
        const objsFromServer = await apiProyectos.obtenerClientes();
        setClientes(objsFromServer);
    };
    const getPowners = async () => {
        const objsFromServer = await apiProyectos.obtenerPOwners();
        setPowners(objsFromServer);
    };
    const getAmanagers = async () => {
        const objsFromServer = await apiProyectos.obtenerAManager();
        setAmanagers(objsFromServer);
    };
    getClientes();
    getPowners();
    getAmanagers();
  }, []);


  return (
    <div className="card">
      <div class="card-body">
        <div className="alert alert-secondary">

          {/* ==========PRODUCT OWNER==================== */}
          <div className="row justify-content-start">
            <div className="col-2">
              <label htmlFor="exampleInputEmail1" className="form-label">Product Owner</label>
            </div>
            <div className="col-auto">
              <select className="form-select form-select-sm"
                onChange={onChangePOwner}
                value={dataFilter.product_owner}
              >
                <option value="0">-</option>
                {powners.map((p, i) => (
                  <option key={i} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ==========ACCOUNT MANAGER==================== */}
          <div className="row justify-content-start">
            <div className="col-2">
              <label htmlFor="exampleInputEmail1" className="form-label">Account Manager</label>
            </div>
            <div className="col-auto">
              <select className="form-select form-select-sm"
                onChange={onChangeAManager}
                value={dataFilter.account_manager}
              >
                <option value="0">-</option>
                {amanagers.map((p, i) => (
                  <option key={i} value={p.id}> {p.nombre}{" "} </option>
                ))}
              </select>
            </div>
          </div>

          {/* ==========CLIENTE==================== */}
          <div className="row justify-content-start">
            <div className="col-2">
              <label htmlFor="exampleInputEmail1" className="form-label">Cliente</label>
            </div>
            <div className="col-auto">
              <select className="form-select form-select-sm"
                onChange={onChangeCliente}
                value={dataFilter.cliente}
              >
                <option value="0">-</option>
                {clientes.map((c, i) => (
                  <option key={i} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ==========Estado==================== */}
          <div className="row justify-content-start">
            <div className="col-2">
              <label htmlFor="exampleInputEmail1" className="form-label">Estado</label>
            </div>
            <div className="col-auto">
              <select className="form-select form-select-sm"
                onChange={onChangeEstado}
                value={dataFilter.estado}
              >
                <option value="100">-</option>
                <option value="0">Borrador</option>
                <option value="1">Planificación completada</option>
                <option value="2">Cerrado</option>
              </select>
            </div>
          </div>

          {/* ==========FECHA DE ENTREGA==================== */}
          <div className="row justify-content-start">
            <div className="col-2">
              <label htmlFor="exampleInputEmail1" className="form-label">Fecha Entrega</label>
            </div>
            <div className="col-auto">
              <DatePicker
                selected={startDate||dataFilter.fecha_ini}
                // onChange={(date) => setStartDate(date)}
                onChange={(date) => addStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                locale="es"
                placeholderText="Desde"
                
              />
              <DatePicker
                selected={endDate||dataFilter.fecha_fin}
                // onChange={(date) => setEndDate(date)}
                onChange={(date) => addEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd/MM/yyyy"
                locale="es"
                placeholderText="Hasta"
              />
            </div>
          </div>

          <div className="row justify-content-start">
            <div className="col-2"></div>
            <div className="col-auto">
              <br />
              <button className="btn btn-outline-secondary btn-sm" 
                      onClick={() => onFilter(dataFilter)} >
                Aplicar
              </button>
              &nbsp;
              <button className="btn btn-outline-secondary btn-sm" 
                      onClick={() => {limpiarFiltros()}}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ListaFiltro;
