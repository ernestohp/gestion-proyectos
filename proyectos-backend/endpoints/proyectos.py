from flask import request, jsonify, Blueprint
from data.proyectosdb import proyectos
from data.proyectosdb import tareas
import copy

pro_bp = Blueprint('routes-proyectos', __name__)

#==========listar proyectos==========================
@pro_bp.route("/proyecto", methods=['POST', 'GET'])
def lista_proyectos():
    pp = proyectos.lista_proyectos()
    if pp:
        response = jsonify(pp)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    return jsonify({"mensaje":"Error interno"})

#==========obtener un proyecto==========================
@pro_bp.route("/proyecto/<id>", methods=['POST', 'GET'])
def un_proyecto(id):
    pps = proyectos.lista_proyectos()
    proyecto1 = {}
    if pps:
        for p in pps:
            if(p['id']==int(id)):
                proyecto1 = copy.deepcopy(p)
        response = jsonify(proyecto1)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    return jsonify({"mensaje":"Error interno"})


#==========listar clientes==========================
@pro_bp.route("/clientes", methods=['POST', 'GET'])
def lista_clientes():
    pp = proyectos.lista_clientes()
    if pp:
        response = jsonify(pp)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    return jsonify({"mensaje":"Error interno"})

#==========listar personas==========================
@pro_bp.route("/personas", methods=['POST', 'GET'])
def lista_personas():
    try:
        pp = proyectos.lista_personas()
        if len(pp) == 0:
            return jsonify([])
        else:
            response = jsonify(pp)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    except:
        return jsonify({"mensaje":"Error interno"})

#==========listar product owner==========================
@pro_bp.route("/powner", methods=['POST', 'GET'])
def lista_powners():
    try:
        pp = proyectos.lista_powners()
        if len(pp) == 0:
            return jsonify([])
        else:
            response = jsonify(pp)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    except:
        return jsonify({"mensaje":"Error interno"})

#==========listar product owner==========================
@pro_bp.route("/amanager", methods=['POST', 'GET'])
def lista_amanagers():
    try:
        pp = proyectos.lista_amanager()
        if len(pp) == 0:
            return jsonify([])
        else:
            response = jsonify(pp)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    except:
        return jsonify({"mensaje":"Error interno"})


#==========actualizar descripcion proyectos===================
@pro_bp.route("/proyecto/descripcion", methods=['POST', 'GET'])
def actualizar_descripcion():
    proyecto_json = request.json["proyecto"]
    data = (proyecto_json['descripcion'], proyecto_json['id'])
    id_grabar = proyectos.actualizar_descripcion_proyecto(data)

    if id_grabar:
        response = jsonify({"mensaje":"Se grabo con exito el proyecto"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    return jsonify({"mensaje":"Error interno, grabar descripcion del proyecto"})



