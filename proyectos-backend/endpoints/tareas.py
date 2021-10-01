from flask import request, jsonify, Blueprint
from data.proyectosdb import tareas
from datetime import date
from flask_cors import cross_origin
from flask_cors import CORS

tarea_bp = Blueprint('routes-tareas', __name__)


#==========listar tareas por proyecto==========================
@tarea_bp.route("/proyecto/<id>/tareas", methods=['POST', 'GET'])
def tareas_por_proyecto(id):
    try:
        data = (id,)
        pp = tareas.tareas_por_proyecto(data)
        if len(pp) == 0:
            return jsonify([])
        else:
            response = jsonify(pp)
            header = response.headers
            header['Access-Control-Allow-Origin'] = '*'
            return response
    except:
        return jsonify({"mensaje":"Error interno"})


#==========Grabar tareas, input:json==========================
@tarea_bp.route("/tareas", methods=['POST', 'GET'])
def grabar_tareas():
    try:
        tareas_json = request.json["tareas"]
        for t in tareas_json:
            plantilla_id = t["id"]
            proyecto_id = t['proyecto']
            persona_id = t["persona"]
            fecha_ini = t["fecha_ini"]
            fecha_fin = t["fecha_fin"]
            tiempo = t["tiempo_estimado"]

            if fecha_ini=="": 
                fecha_ini=None
            if fecha_fin=="": 
                fecha_fin=None
            if tiempo=="": 
                tiempo=0
            

            data = (proyecto_id,persona_id, fecha_ini, fecha_fin, tiempo, plantilla_id)    
            print(data)
            id_tarea = tareas.obtener_id_tarea(plantilla_id)
            if(id_tarea==0):
                #insertar tarea
                print("insertar")
                id_insertar = tareas.insertar_tarea(data)
                print(id_insertar)
            else:
                #actualizar tarea
                print("actualizar")
                b_actualizar = tareas.actualizar_tarea(data)
                print(b_actualizar)
            print(id_tarea)

        response = jsonify({"mensaje":"Se grabaron con exito las tareas"})
        header = response.headers
        header['Access-Control-Allow-Origin'] = '*'

        # response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except:
        return jsonify({"mensaje":"Error interno grabar tareas"})

