import {Card} from 'react-bootstrap';
const ModalAdvHoras = ({tareasFlat}) => {
    return (
        <div>
        <Card bg='light'>
        <Card.Body>


        Las siguientes tareas tienen más horas de las posibles:
    <table className="table table-hover table-sm">
        <thead >
            <tr>
            <th scope="col">Tarea</th>
            <th scope="col">Horas Laborales (Fecha Inicio-Fin)</th>
            <th scope="col">Tiempo estimado</th>
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

    </Card.Body>
        </Card>


    </div>
)
}

export default ModalAdvHoras
