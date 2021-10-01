from flask import Blueprint, jsonify


rec_bp = Blueprint('routes-recursos', __name__)

#==========listar recursos====================
@rec_bp.route("/recursos", methods=['POST', 'GET'])
# @cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def lista_recursos():
    recursos = [{"id":"001", "nombre":"Juan"}, {"id":"002", "nombre":"Jose"}]
    
    response = jsonify(recursos)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


