from flask import request, jsonify, Blueprint
from data.proyectosdb import alertasdb
from data.clockify import srv_alertas

alertas_bp = Blueprint('routes-alertas', __name__)

#==========listar recursos====================
@alertas_bp.route("/alertas/usuario", methods=['GET'])
def lista_usuarios():
    try:
        pp = alertasdb.lista_usuarios()
        if len(pp) == 0:
            return jsonify([])
        else:
            response = jsonify(pp)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    except:
        return jsonify({"mensaje":"Error interno"})

#==========listar recursos====================
@alertas_bp.route("/alertas/usuario", methods=['POST'])
def create_usuario():
    try:
        usuario_json = request.json['usuarioAlerta']
        print("usuaio", usuario_json)
        correo = usuario_json['email']
        hmin   = usuario_json['horas_min']
        hmax   = usuario_json['horas_max']
        id   = usuario_json['id']
        name = usuario_json['name']
        alerta1   = usuario_json['alerta1']
        alerta2   = usuario_json['alerta2']
        alerta3   = usuario_json['alerta3']

        data = (correo, hmin, hmax, id, name, alerta1, alerta2, alerta3)
        i = alertasdb.insertar_usuario(data)
        response=""
        if (i==1):
            response = jsonify({"mensaje":"Se grabó con exito el usuario"})
        else:
            response = jsonify({"mensaje":"Error al grabar el usuario"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response        
    except:
        return jsonify({"mensaje":"Error interno"})


#==========listar usuarios clockify====================
@alertas_bp.route("/alertas/usuario/clockify", methods=['GET'])
def lista_usuarios_clockify():
    try:
        pp = srv_alertas.obtener_usuarios()
        if len(pp) == 0:
            return jsonify([])
        else:
            response = jsonify(pp)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    except:
        return jsonify({"mensaje":"Error interno"})



#==========listar usuarios sup====================
@alertas_bp.route("/alertas/usuariosup", methods=['GET'])
def lista_usuarios_sup():
    try:
        pp = alertasdb.lista_usuarios_sup()
        if len(pp) == 0:
            return jsonify([])
        else:
            response = jsonify(pp)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    except:
        return jsonify({"mensaje":"Error interno, obtener usuarios sup"})

#==========listar recursos====================
@alertas_bp.route("/alertas/usuariosup", methods=['POST'])
def create_usuario_sup():
    try:
        usuario_json = request.json['usuarioSup']
        print("usuario", usuario_json)
        name   = usuario_json['name']
        correo = usuario_json['email']
        id = usuario_json['id']

        data = (name, correo, id)
        i = alertasdb.insertar_usuario_sup(data)
        response=""
        if (i==1):
            response = jsonify({"mensaje":"Se grabó con exito el usuario sup"})
        else:
            response = jsonify({"mensaje":"Error al grabar el usuario sup"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response        
    except:
        return jsonify({"mensaje":"Error interno, grabar usuario sup"})



#==========listar param====================
@alertas_bp.route("/alertas/parametros", methods=['GET'])
def lista_param():
    try:
        pp = alertasdb.lista_param()
        # parametros = {}
        # for p in pp:
        #     parametros[p['name']]=p['value']
        if len(pp) == 0:
            return jsonify([])
        else:
            response = jsonify(pp)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    except:
        return jsonify({"mensaje":"Error interno, obtener usuarios sup"})

#==========listar recursos====================
@alertas_bp.route("/alertas/parametros", methods=['POST'])
def create_param():
    try:
        # parametros = []
        parametros_json = request.json['parametros']
        # for key, val in parametros_json.items():
        #     p = {}
        #     p['name']=key
        #     p['value']=val
        #     parametros.append(p)
        for param in parametros_json:
            print("parametro", param)
            name  = param['name']
            value1 = param['value1']
            value2 = param['value2']
            data = (value1, value2, name)
            bol = alertasdb.actualizar_parametro(data)
        response = jsonify({"mensaje":"Se grabaron con exito los parámetros"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response        
    except:
        return jsonify({"mensaje":"Error interno, grabar usuario sup"})


#==========Generar alertas====================
@alertas_bp.route("/alertas/generaralertausuario", methods=['POST'])
def create_alertas():
    try:
        datos_json = request.json['datos']
        ventana = datos_json['ventana']
        usuario_ids = datos_json['usuarios']

        srv_alertas.generar_alertas2(usuario_ids, ventana)

        # bol = alertasdb.actualizar_parametro("data")
        response = jsonify({"mensaje":"Se generaron con éxito las alertas"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response        
    except:
        return jsonify({"mensaje":"Error interno, generar alertas"})

@alertas_bp.route("/alertas/generaralertassup", methods=['POST'])
def create_alertas_sup():
    try:
        datos_json = request.json['datos']
        ventana = datos_json['ventana']
        usuario_ids = datos_json['usuarios']

        srv_alertas.generar_alertas_sup(usuario_ids, ventana)

        # bol = alertasdb.actualizar_parametro("data")
        response = jsonify({"mensaje":"Se generaron con éxito las alertas"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response        
    except:
        return jsonify({"mensaje":"Error interno, generar alertas"})












