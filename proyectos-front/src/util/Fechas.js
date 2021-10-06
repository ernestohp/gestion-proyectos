
//------Dias laborales (Lunes-Viernes)-------
export const diasLaborales = (d1, d2) =>{
    var dias = (d2.getTime() - d1.getTime())/(1000*60*60*24) +1
    var diasArrayInicial = []
    var diaSemana = d1.getDay()-1;
    for (var i=0; i<dias; i++) {
      diaSemana = diaSemana + 1;
      if(diaSemana==7) diaSemana = 0;
      diasArrayInicial[i] = diaSemana;
    }
    const diasArray = diasArrayInicial.filter((n) => n!=6 && n!=0);
    return diasArray.length;
    
}
export const horasLaborales = (d1, d2) => {
    const dias = diasLaborales(d1, d2);
    return dias*8;
}

export const dayStr = (d1) => {
  const dia = d1.getDate();
  var dStr = dia.toString();
  if (dia < 10) {
    dStr = "0" + dia;
  }
  return dStr;
}

export const monthStr = (d1) => {
  var month = d1.getMonth();
  month++;
  var mStr = month.toString();
  if (month < 10) {
    mStr = "0" + month;
  }
  return mStr;
}
//Fecha con formato yyyy-mm-dd
export const fechaFormat1 = (d1) => {
  var fechaStr = d1.getFullYear() + "-" + monthStr(d1) + "-" + dayStr(d1);
  return fechaStr;
}

//Fecha con formato dd-mm-yyyy
export const fechaFormat2 = (d1) => {
  var fechaStr =  dayStr(d1) + "/" + monthStr(d1) + "/" + d1.getFullYear()
  return fechaStr;
}
//Crear objeto Date desde in formato dd/mm/yyyy
export const getFecha1 = (str) => {
  const dd = parseInt(str.substring(0,2));
  const mm = parseInt(str.substring(3,5))-1;
  const yy = parseInt(str.substring(6));
  const d1 = new Date(yy,mm,dd);
  return d1;
}

//Input:arreglo de tareas
export const fechaMin = (tArray) => {
  var dMin = new Date(2500,0,1)
  var strFinal = ""
  var cambio = false
  tArray.map((t)=>{
    var d = ""
    if (t.hasOwnProperty("tareas") && t.tareas.length > 0) {
      if (t.fecha_ini_group!=null && t.fecha_ini_group!="")
        d = getFecha1(t.fecha_ini_group);
    }else{
      d = t.fecha_ini
    }
    if(d!=null && d!="" && (d.getTime() < dMin.getTime())){
      dMin = d
      cambio = true
    }
  })
  if (cambio) strFinal = fechaFormat2(dMin);
  return strFinal;
}

//Input:arreglo de tareas
export const fechaMax = (tArray) => {
  var dMax = new Date(1900,0,1)
  var strFinal = ""
  var cambio = false
  tArray.map((t)=>{
    var d = ""
    if (t.hasOwnProperty("tareas") && t.tareas.length > 0) {
      if (t.fecha_fin_group!=null && t.fecha_fin_group!="")
        d = getFecha1(t.fecha_fin_group);
    }else{
      d = t.fecha_fin
    }
    if(d!=null && d!="" && (d.getTime() > dMax.getTime())){
      dMax = d
      cambio = true
    }
  })
  if (cambio) strFinal = fechaFormat2(dMax);
  return strFinal;
}


