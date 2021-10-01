from flask import request, jsonify, Blueprint
from data.clockify import srv_clockify

ckf_bp = Blueprint('routes-clockify', __name__)

#==========Grabar tareas, input:json==========================
@ckf_bp.route("/clockify/proyecto", methods=['POST', 'GET'])
def grabar_proyecto():
    try:
        print("Clockify. Iniciando creacion/modificacion de proyecto y tareas...")
        proyecto_json = request.json["proyecto"]
        cliente = proyecto_json['cliente']
        nombre = proyecto_json['nombre']
        descripcion = proyecto_json['descripcion']
        tareas = proyecto_json['tareas']

        #---Crear/actualizar proyecto
        id_proyecto = srv_clockify.add_project(nombre, cliente, descripcion)
        print("Clockify. Proyecto id %s nombre %s" % (id_proyecto, nombre))

        #---Crear/modificar tareas
        if(id_proyecto!=""):
            srv_clockify.agregar_tareas_a_proyecto(id_proyecto, tareas)
        return jsonify({"mensaje":"Clockify. Se ha grabado con exito el proyecto y sus tareas"})
    except:
        return jsonify({"mensaje":"Clockify. Error interno grabar proyecto y tareas"})

