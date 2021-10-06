import * as Constantes from './Constantes'

export const grabarProyectoTareas = async(proyecto, tasks) => {
    proyecto.tareas = tasks
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
        mode:'cors',
        body: JSON.stringify({"proyecto": proyecto})
  };
  const url1 = Constantes.BASE_END_POINT + '/clockify/proyecto'
  const res = await fetch(url1, requestOptions)
  const data = await res.json()
  return data
}
