import * as Constantes from './Constantes'

export const grabarProyectoTareas = async(proyecto) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(proyecto)
  };
  const url1 = Constantes.BASE_END_POINT + '/openproject/proyecto'
  const res = await fetch(url1, requestOptions)
  const data = await res.json()
  return data
}
