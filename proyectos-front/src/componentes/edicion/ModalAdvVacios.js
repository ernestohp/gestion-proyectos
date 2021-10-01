import {Card} from 'react-bootstrap';

const ModalAdvVacios = ({tareasFlat}) => {
    return (
        <div>

<Card bg='light'>
        <Card.Body>


        Las siguientes tareas tienen campo vacíos:
    <table className="table table-hover table-sm">
        <thead >
            <tr>
            <th scope="col">Tarea</th>
            </tr>
        </thead>
        <tbody>
            {tareasFlat.map((tarea)=>{
            return (
                <>
                {(tarea.hasOwnProperty("adv") && tarea.adv=="vacios") &&
                <tr> <td> {tarea.nombre} </td> </tr>
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

export default ModalAdvVacios
