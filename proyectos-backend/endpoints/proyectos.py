from flask import request, jsonify, Blueprint
from data.proyectosdb import proyectos
from data.proyectosdb import personas
from data.proyectosdb import clientes
from data.proyectosdb import powners
from data.proyectosdb import amanagers
from data.proyectosdb import calendario
import copy
from datetime import datetime, timedelta

pro_bp = Blueprint('routes-proyectos', __name__)

#==========listar proyectos==========================
@pro_bp.route("/proyecto", methods=['POST', 'GET'])
def lista_proyectos():
    pp = proyectos.lista_proyectos()
    try:
        response = jsonify(pp)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except:
        return jsonify({"mensaje":"Error interno"})

#==========obtener un proyecto==========================
@pro_bp.route("/proyecto/<id>", methods=['POST', 'GET'])
def un_proyecto(id):
    try:
        pps = proyectos.lista_proyectos()
        proyecto1 = {}        
        for p in pps:
            if(p['id']==int(id)):
                proyecto1 = copy.deepcopy(p)
        response = jsonify(proyecto1)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except:
        return jsonify({"mensaje":"Error interno"})


#==========listar clientes==========================
@pro_bp.route("/clientes", methods=['POST', 'GET'])
def lista_clientes():
    pp = clientes.lista_clientes()
    try:
        response = jsonify(pp)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response    
    except:
        return jsonify({"mensaje":"Error interno"})
#==========listar personas==========================
@pro_bp.route("/personas", methods=['POST', 'GET'])
def lista_personas():
    try:
        pp = personas.lista_personas()

        for p in pp:
            #--Ausencias---
            data = (int(p['id']),)            
            aa = personas.lista_ausencias_user(data)
            array_days_hours = personas.obtener_array_ausencias(aa)
            #--Festivos---
            days_festivos = calendario.array_festivos_horas()
            array_days_hours = array_days_hours + days_festivos
            unicos_days_hours = personas.valores_unicos_array(array_days_hours)

            p['ausencias'] = unicos_days_hours

        if len(pp) == 0:
            return jsonify([])
        else:
            response = jsonify(pp)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    except:
        return jsonify({"mensaje":"Error interno"})

#==========listar ausencias para una persona===================
@pro_bp.route("/personas/<id>/ausencias", methods=['POST', 'GET'])
def lista_ausencias_persona(id):
    try:
        data = (int(id),)
        pp = personas.lista_ausencias_user(data)

        #--Dias-horas-ausencias----
        if len(pp) > 0:
            for p in pp:
                array_days_hours = personas.obtener_array_ausencias_individual(p)
                p['days_hours'] = array_days_hours
        if len(pp) == 0:
            return jsonify([])
        else:
            response = jsonify(pp)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    except:
        return jsonify({"mensaje":"Error interno"})

#==========listar ausencias==========================
@pro_bp.route("/ausencias", methods=['POST', 'GET'])
def lista_ausencias():
    try:
        pp = personas.lista_ausencias()
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
        pp = powners.lista_powners()
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
        pp = amanagers.lista_amanager()
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
    data = (proyecto_json['descripcion'], proyecto_json['estado_id'], proyecto_json['id'])
    id_grabar = proyectos.actualizar_proyecto_descripcion(data)

    if id_grabar:
        response = jsonify({"mensaje":"Se grabo con exito el proyecto"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    return jsonify({"mensaje":"Error interno, grabar descripcion del proyecto"})

#==========actualizar proyectos===================
@pro_bp.route("/proyecto/actualizar", methods=['POST', 'GET'])
def actualizar_proyecto():
    proyecto_json = request.json["proyecto"]    
    data = (proyecto_json['descripcion'],
            proyecto_json['account_manager_id'],  
            proyecto_json['project_owner_id'],
            proyecto_json['id'])
    id_grabar = proyectos.actualizar_proyecto(data)
    data2 = (1, proyecto_json['account_manager_id'])
    id_grabar2 = personas.actualizar_account_manager(data2)
    data3 = (1, proyecto_json['project_owner_id'])
    id_grabar3 = personas.actualizar_project_owner(data3)

    if id_grabar:
        response = jsonify({"mensaje":"Se grabo con exito el proyecto"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    return jsonify({"mensaje":"Error interno, grabar el proyecto"})


#==========actualizar descripcion proyectos===================
@pro_bp.route("/proyecto/plantilla", methods=['POST'])
def actualizar_plantilla():
    proyecto_json = request.json
    data = (proyecto_json['plantilla'], proyecto_json['id'])
    id_grabar = proyectos.actualizar_proyecto_plantilla(data)

    if id_grabar:
        response = jsonify({"mensaje":"Se grabo con exito el proyecto, plantilla"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    return jsonify({"mensaje":"Error interno, grabar plantilla del proyecto"})




