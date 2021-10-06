import {Card} from 'react-bootstrap';
const ModalAdvHoras = ({tareasFlat}) => {
    return (
        <div>
        {/* <Card bg='#CCC'> */}
        {/* <Card.Body> */}


        Las siguientes tareas tienen más horas de las posibles:
    {/* <table className="table table-hover table-sm"> */}
    <table>
        <thead >
            <tr>
            <td className="tdth">Tarea</td>
            <td className="tdth">Horas Laborales (Fecha Inicio-Fin)</td>
            <td className="tdth">Tiempo estimado</td>
            </tr>
        </thead>
        <tbody>
            {tareasFlat.map((tarea)=>{
            return (
                <>
                {(tarea.hasOwnProperty("adv") && tarea.adv=="horas") &&
                <tr>
                    <td> {tarea.nombre} </td>
                    <td> {tarea.horas_entre_fechas} </td>
                    <td> {tarea.tiempo_estimado} </td>
                </tr>
                }
                </>
            )
            })
            }
        </tbody>
    </table>

    {/* </Card.Body> */}
        {/* </Card> */}


    </div>
)
}

export default ModalAdvHoras
