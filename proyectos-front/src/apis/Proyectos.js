import * as Constantes from './Constantes'

export const obtenerProyectos = async() => {
  const res = await fetch(Constantes.BASE_END_POINT + '/proyecto')
  const data = await res.json()
  return data
}
export const obtenerProyecto = async(id) => {
  const url1 = Constantes.BASE_END_POINT + '/proyecto/'+id
  const res = await fetch(url1)
  const data = await res.json()
  return data
}
export const obtenerClientes = async() => {
  const res = await fetch(Constantes.BASE_END_POINT + '/clientes')
  const data = await res.json()
  return data
}
export const obtenerPersonas = async() => {
  const res = await fetch(Constantes.BASE_END_POINT + '/personas')
  const data = await res.json()
  return data
}
export const obtenerPOwners = async() => {
  const res = await fetch(Constantes.BASE_END_POINT + '/powner')
  const data = await res.json()
  return data
}
export const obtenerAManager = async() => {
  const res = await fetch(Constantes.BASE_END_POINT + '/amanager')
  const data = await res.json()
  return data
}
export const obtenerTareas = async(id) => {
  const url1 = Constantes.BASE_END_POINT + '/proyecto/'+id+'/tareas'
  const res = await fetch(url1)
  const data = await res.json()
  return data
}


export const grabarTareas = async(tareas) => {
    const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
    mode:'cors',
    body: JSON.stringify({"tareas": tareas})
  };
  const url1 = Constantes.BASE_END_POINT + '/tareas'
  const res = await fetch(url1, requestOptions)
  const data = await res.json()
  return data
}

export const grabarProyectoDescripcion = async(proyecto) => {
  const requestOptions = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
  mode:'cors',
  body: JSON.stringify({"proyecto": proyecto})
};
const url1 = Constantes.BASE_END_POINT + '/proyecto/descripcion'
const res = await fetch(url1, requestOptions)
const data = await res.json()
return data
}