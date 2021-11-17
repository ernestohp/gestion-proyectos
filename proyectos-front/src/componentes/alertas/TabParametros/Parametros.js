import {useState, useEffect} from 'react'
import {Table} from 'react-bootstrap';
import {FaCheck } from "react-icons/fa";

import * as apiAlertas from './../../../apis/Alertas'

const Parametros = ({parametros}) => {
    console.log("parametros", parametros)
    const[parametro1,  setParametro1] = useState({"name": "", "value1": "", "value2": ""}) 
    const[parametro2,  setParametro2] = useState({"name": "", "value1": "", "value2": ""}) 

    useEffect (
        () => {
            const p1 = parametros.find(item => item.name == 'frecuencia_usuario')
            setParametro1(p1)
            const p2 = parametros.find(item => item.name == 'frecuencia_sup')
            setParametro2(p2)
        }, [])


    const handleClickParam1 = (value, tipo) => {
        const p = parametros.find(item => item.name == 'frecuencia_usuario')
        if(tipo=='value1')
            p.value1 = value
        if(tipo=='value2')
            p.value2 = value
        setParametro1({...p})
    }
    const handleClickParam2 = (value, tipo) => {
        const p = parametros.find(item => item.name == 'frecuencia_sup')
        if(tipo=='value1')
            p.value1 = value
        if(tipo=='value2')
            p.value2 = value
        setParametro2({...p})
    }

    const onGuardar = async () =>{
        const respFromServer = await apiAlertas.grabarParametros(parametros)
        console.log("Guardar parametros, Resp del servidor", respFromServer)
        // window.location.reload();
    }

    const valores1 = ['diario', 'semanal', 'mensual']
    const valores2 = [
                        ['ultimo_dia', 'Último día'],
                        ['inicio_sem', 'Desde el inicio de semana'], 
                        ['ultima_sem', 'Últimos 7 días'], 
                        ['inicio_mes', 'Desde el inicio del mes'], 
                        ['ultimo_mes', 'Último mes']
                    ]

    return (
        <div>
        {/* <Table hover bordered size="sm"> */}
        <table>
        <thead>
            <tr>
            <td className="tdth" width="20%">Nombre</td>
            <td className="tdth" width="30%">Frecuencia</td>
            <td className="tdth" width="">Rango Verificado</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Frecuencia Usuarios</td>
                <td> 
                    {valores1.map((type, i) => (
                    <div className="form-check">
                        <input class="form-check-input" type="radio" name="param1" id={`param1${i}`} 
                            value={type}
                            onClick={(e) => handleClickParam1(e.target.value, 'value1')}
                            checked={parametro1.value1===type}
                        />
                        <label class="form-check-label" for={`param1${i}`}>
                            {type.substring(0,1).toUpperCase() + type.substring(1,)}
                        </label>
                    </div>
                    ))}
                </td>

                <td>
                    {valores2.map((type, i) => (
                    <div className="form-check">
                        <input class="form-check-input" type="radio" name="param1val2" id={`param1val2-${i}`} 
                            value={type[0]}
                            onClick={(e) => handleClickParam1(e.target.value, 'value2')}
                            checked={parametro1.value2===type[0]}
                        />
                        <label class="form-check-label" for={`param1val2-${i}`}>
                            {type[1]}
                        </label>
                    </div>
                    ))}
                </td>
            </tr>
            <tr>
                <td> Frecuencia Supervisores </td>

                <td>  
                    {valores1.map((type, i) => (
                    <div className="form-check">
                        <input class="form-check-input" type="radio" name="param2" id={`param2${i}`} 
                                value={type}
                                onClick={(e) => handleClickParam2(e.target.value, 'value1')}
                                checked={parametro2.value1===type}
                                />
                        <label class="form-check-label" for={`param2${i}`}>
                            {type.substring(0,1).toUpperCase() + type.substring(1,)}
                        </label>

                    </div>
                    ))}
                </td>


                <td>  
                    {valores2.map((type, i) => (
                    <div className="form-check">
                        <input class="form-check-input" type="radio" name="param2val2" id={`param2val2-${i}`} 
                            value={type[0]}
                            onClick={(e) => handleClickParam2(e.target.value, 'value2')}
                            checked={parametro2.value2===type[0]}
                        />
                        <label class="form-check-label" for={`param2val2-${i}`}>
                            {type[1]}
                        </label>
                    </div>
                    ))}
                </td>
            </tr>
        </tbody>
        </table>        <br/>    
        <button type="button" 
                class="btn btn-outline-secondary active btn-sm" 
                onClick={onGuardar}>
                <FaCheck/> Grabar Parámetros
        </button>              

        </div>
    )
}

export default Parametros
