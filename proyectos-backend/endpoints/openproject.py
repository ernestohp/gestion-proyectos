from flask import request, jsonify, Blueprint
from data.openproject import openproject

opp_bp = Blueprint('routes-openproject', __name__)

#==========Crear proyecto y tareas==========================
@opp_bp.route("/openproject/proyecto", methods=['POST'])
def grabar_proyecto_tareas():
    try:
        #Crear proyecto----
        print("OPP, Inicio de crear proyecto")
        proyecto_json = request.json
        nombre = proyecto_json['nombre']
        descripcion = proyecto_json['descripcion']
        # print("nombre %s, descripcion %s" %(nombre, descripcion))
        id_project=openproject.create_update_project(nombre, descripcion)
        print("OPP, código de proyecto",id_project)

        #Crear tareas----
        print("OPP, Inicio de crear tareas para proyecto %s" % nombre)
        tareas = proyecto_json['tareas']
        # print(tareas)
        openproject.add_tasks_to_project_id(id_project, tareas)
        
        return jsonify({"mensaje":"Se ha creado el proyecto %s y sus tareas correctamente" % nombre})
    except:
        return jsonify({"mensaje":"Error interno grabar proyecto openproject"})


