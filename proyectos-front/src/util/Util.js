export const getIdTareaPadre = (id) => {
    var idPadre = ""
    if(id.indexOf("-")==-1){
      idPadre = id
    }else{
      idPadre = id.substring(0, id.lastIndexOf("-"));
    }
    return idPadre;
}

//Input: arreglo de tareas
export const sumarTiempos = (tArray) => {
    var tFinal = 0
    tArray.map((t)=>{
        var tiempo = 0
        if (t.hasOwnProperty("tareas") && t.tareas.length > 0) {
            if (t.tiempo_group!=null)
              tiempo = t.tiempo_group;
          }else{
            tiempo = t.tiempo_estimado
          }
      
        if(tiempo!=null && tiempo!=""){
            tFinal = tFinal + tiempo;
        }
    })
    return tFinal;  
}

export const getPorcentajes = (arr) => {
  var nArray = [];
  var total = 0;
  arr.map((a)=>{
    total = total + a;
  })
  arr.map((a)=>{
    const porc = Math.round((a/total)*100);
    nArray.push(porc);
  })
  return nArray;
};


export const getNombre = (personas, id) => {
  var nombre = ""
  personas.map((p)=>{
    if (parseInt(p.id) === parseInt(id)){
      nombre = p.nombre
    }
  })
  return nombre

};
