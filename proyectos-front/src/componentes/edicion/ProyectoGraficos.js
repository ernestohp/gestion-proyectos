import { Line, Doughnut } from 'react-chartjs-2';
import {Card} from 'react-bootstrap';
import * as Util from './../../util/Util'


const ProyectoGraficos = ({plantillaGlobal, personas}) => {
  const bgColorBase= ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)',
                  'rgba(0, 80, 90, 0.2)'];
  const bdColorBase= ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)',
                  'rgba(0, 80, 90, 1)'];


  //====Porcentaje de tareas
  var labelsTareas = []
  var dataTareas = []
  var bgColorTareas = []
  var bdColorTareas = []
  var indexT = 0

  plantillaGlobal.tareas.map((t)=>{
    var tiempo = 0
    if (t.hasOwnProperty("tareas") && t.tareas.length > 0) {
        if (t.tiempo_group!=null)
          tiempo = t.tiempo_group;
      }else{
        tiempo = t.tiempo_estimado
      }
  
    if(tiempo!=null && tiempo!="" & tiempo!=0){
      dataTareas.push(tiempo)
      labelsTareas.push(t.nombre)
      bgColorTareas.push(bgColorBase[indexT])
      bdColorTareas.push(bdColorBase[indexT])
      indexT++
    }
  })
  //Calcular porcentajes
  const dataTareasP = Util.getPorcentajes(dataTareas);


  const dataTasks = {
    labels: labelsTareas,
    datasets: [
      {
        label: '% de tiempo',
        data: dataTareasP,
        backgroundColor: bgColorTareas,
        borderColor: bdColorTareas,
        borderWidth: 0.5,
      },
    ],
  };

  //====Porcentaje de personas
  var labelsPersonas = []
  var dataPersonas = []
  var bgColorPersonas = []
  var bdColorPersonas = []
  var indexP = 0

  const buscarHorasPersona = (tareas, idPersona) => {
    var hTotal = 0
    tareas.map((t)=>{
      if(t.persona !=null && t.persona != 0){
        if (t.persona==idPersona){
          if(t.tiempo_estimado!=null && t.tiempo_estimado!="" & t.tiempo_estimado!=0){
            hTotal = hTotal + t.tiempo_estimado
          }
        }
      }
      if (t.hasOwnProperty("tareas") && t.tareas.length > 0){
        hTotal = hTotal + buscarHorasPersona(t.tareas, idPersona)
      }
    });
    return hTotal;
  }


  personas.map((p)=>{
    const totalHoras = buscarHorasPersona(plantillaGlobal.tareas, p.id)
    if(totalHoras!=null && totalHoras!="" & totalHoras!=0){
      dataPersonas.push(totalHoras)
      labelsPersonas.push(p.nombre)
      bgColorPersonas.push(bgColorBase[indexP])
      bdColorPersonas.push(bdColorBase[indexP])
      indexP++
    }

  })
  //Calcular porcentajes
  const dataPersonasP = Util.getPorcentajes(dataPersonas);


  const dataPer = {
    labels: labelsPersonas,
    datasets: [
      {
        label: '% de tiempo',
        data: dataPersonasP,
        backgroundColor: bgColorPersonas,
        borderColor: bdColorPersonas,
        borderWidth: 0.5,
      },
    ],
  };


  const options = {
    responsive: true,
    maintainAspectRatio: false,    
    tooltips: {
      callbacks: {
          label: function(tooltipItem, dataPer) {
              var label = dataPersonasP.datasets[tooltipItem.datasetIndex].label || '%';
              return label;
          }
      }
    }
  };

    return (
        <div className="card">
        <div class="card-body">
          <div className="alert alert-secondary">
          <table>
          <tr>
          <td>
          {/* =========Porcentaje de Tareas=========== */}
          <Card style={{ width: '25rem', height: '25rem' }}>
            <Card.Header>Porcentaje de tareas</Card.Header>
            <Card.Body>
                <Doughnut data={dataTasks} options={options}/>
            </Card.Body>
          </Card>
          </td>
          <td>
          {/* =========Porcentaje de Personas=========== */}
          <Card style={{ width: '25rem', height: '25rem' }}>
            <Card.Header>Porcentaje de Personas</Card.Header>
            <Card.Body>
                <Doughnut data={dataPer} options={options}/>
            </Card.Body>
          </Card>


          </td>

          </tr>
          </table>


              
        </div>
        </div>
        </div>
    )
}

export default ProyectoGraficos
