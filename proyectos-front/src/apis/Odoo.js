import * as Constantes from './Constantes'

//export const obtenerRecursos = async() => {
export const obtenerRecursos = async() => {
    const res = await fetch(Constantes.BASE_END_POINT + '/recursos')
    const data = await res.json()
    return data
  }