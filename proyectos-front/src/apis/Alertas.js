import * as Constantes from './Constantes'

export const obtenerUsuarios = async() => {
  const url1 = Constantes.BASE_END_POINT + '/alertas/usuario'
  const res = await fetch(url1)
  const data = res.json()
  return data
 }
  
export const obtenerUsuariosClockify = async() => {
  const url1 = Constantes.BASE_END_POINT + '/alertas/usuario/clockify'
  const res = await fetch(url1)
  const data = res.json()
  return data
}

export const grabarUsuarioAlerta = async(usuarioAlerta) => {
    console.log("grabando usuarioalerta...", usuarioAlerta)
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
        body: JSON.stringify({usuarioAlerta})
  };
  const url1 = Constantes.BASE_END_POINT + '/alertas/usuario'
  const res = await fetch(url1, requestOptions)
  const data = await res.json()
  return data
}

export const obtenerUsuariosSup = async() => {
  const url1 = Constantes.BASE_END_POINT + '/alertas/usuariosup'
  const res = await fetch(url1)
  const data = res.json()
  return data
 }

export const grabarUsuarioSup = async(usuarioSup) => {
  console.log("grabando usuarioSup...", usuarioSup)
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
      body: JSON.stringify({usuarioSup})
};
const url1 = Constantes.BASE_END_POINT + '/alertas/usuariosup'
const res = await fetch(url1, requestOptions)
const data = await res.json()
return data
}

export const obtenerParametros = async() => {
  const url1 = Constantes.BASE_END_POINT + '/alertas/parametros'
  const res = await fetch(url1)
  const data = await res.json()
  return data
 }

export const grabarParametros = async(parametros) => {
  console.log("grabando parametro...", parametros)
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
      body: JSON.stringify({parametros})
  };
  const url1 = Constantes.BASE_END_POINT + '/alertas/parametros'
  const res = await fetch(url1, requestOptions)
  const data = await res.json()
  return data
}

export const generarAlertas = async(datos) => {
  console.log("generando alertas...", datos)
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
      body: JSON.stringify({datos})
  };
  const url1 = Constantes.BASE_END_POINT + '/alertas/generaralertausuario'
  const res = await fetch(url1, requestOptions)
  const data = await res.json()
  return data
}

export const generarAlertasSup = async(datos) => {
  console.log("generando alertas supervisor...", datos)
  const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
      body: JSON.stringify({datos})
  };
  const url1 = Constantes.BASE_END_POINT + '/alertas/generaralertassup'
  const res = await fetch(url1, requestOptions)
  const data = await res.json()
  return data
}





