import { Line, Doughnut } from 'react-chartjs-2';
import { Chart } from "react-google-charts";
import {Card} from 'react-bootstrap';
import * as Util from './../../util/Util'


const ProyectoGraficos3 = ({tareasFlatPlantilla, personas}) => {
  console.log("tareasFlatPlantilla dentro de grafico", tareasFlatPlantilla)

  //====Porcentaje de tareas========
  var labelsTareas = []
  var dataTareas = []
  
  const tts = tareasFlatPlantilla
  for (var i=1; i<tts.length; i++) {
    if(tts[i].hijo_global){
      var tiempo = 0
      if (tts[i].tiene_hijos) {
          if (tts[i].tiempo_group!=null)
            tiempo = tts[i].tiempo_group;
      }else{
        tiempo = tts[i].tiempo_estimado
      }
      if(tiempo!=null && tiempo!="" && tiempo!=0){
        dataTareas.push(tiempo)
        labelsTareas.push(tts[i].nombre)
      }
    }  

  }
  //Crear el dataset
  const dataSetTareas = []
  dataSetTareas.push(['Tarea', 'Horas'])
  for (var k in dataTareas){
    dataSetTareas.push([labelsTareas[k],dataTareas[k] ])
  }
  
  //====Porcentaje de personas================
  var labelsPersonas = []
  var dataPersonas = []

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
    });
    return hTotal;
  }

  personas.map((p)=>{
    const totalHoras = buscarHorasPersona(tareasFlatPlantilla, p.id)
    if(totalHoras!=null && totalHoras!="" & totalHoras!=0){
      dataPersonas.push(totalHoras)
      labelsPersonas.push(p.nombre)
    }

  })
  
  //Crear el dataset
  const dataSetPersonas = []
  dataSetPersonas.push(['Persona', 'Horas'])
  for (var k in dataPersonas){
    dataSetPersonas.push([labelsPersonas[k],dataPersonas[k] ])
  }
  
    return (
        <div className="card">
        <div class="card-body">
          <div className="alert alert-secondary">
          <table>
          <tr>

          <td className="td3">
          {/* =========Porcentaje de Tareas=========== */}
          <Card style={{ width: '35rem', height: '25rem' }}>
            <Card.Header>Porcentaje de tareas</Card.Header>
            <Card.Body>
            <div style={{ display: 'flex', maxWidth: 900 }}>
              <Chart width={'500px'}
                     height={'300px'}
                     chartType="PieChart"
                     loader={<div>Loading Chart</div>}
                     data={dataSetTareas}
                     options={{
                        pieHole: 0.35,
                     }}
                     rootProps={{ 'data-testid': '1' }}
              />
            </div>
            </Card.Body>
          </Card>
          </td>

          <td className="td3">
          {/* =========Porcentaje de Tareas=========== */}
          <Card style={{ width: '35rem', height: '25rem' }}>
            <Card.Header>Porcentaje de Personas</Card.Header>
            <Card.Body>
            <div style={{ display: 'flex', maxWidth: 900 }}>
              <Chart width={'500px'}
                     height={'300px'}
                     chartType="PieChart"
                     loader={<div>Loading Chart</div>}
                     data={dataSetPersonas}
                     options={{
                        pieHole: 0.35,
                        title: 'Horas por cada persona',
                        // legend: {position:'left'}
                     }}
                     rootProps={{ 'data-testid': '1' }}
              />
            </div>
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

export default ProyectoGraficos3
