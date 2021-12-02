from re import U
import requests
from data.openproject import params_opp
# import params_opp
import json

BASE_URL  = params_opp.BASE_URL
API_TOKEN = params_opp.API_TOKEN
HEADERS   = params_opp.HEADERS
BASE_PROJECT = params_opp.BASE_PROJECT

#=======MEMBERSHIP===============================
#--------Obtener miembros de un proyecto--
def get_members_project_id(id_project):
    members =[]
    filtros = '[{ "project": { "operator": "=", "values": ["%s"] } }] ' % id_project
    res = requests.get("%s/memberships" % (BASE_URL),
                        auth=('apikey', API_TOKEN),
                        params={'filters': filtros})
    if res.json():
        count=res.json()["count"]
        if count>0:
            for m in res.json()["_embedded"]["elements"]:
                members.append(m)
        else:
            print("El proyecto no tienen miembros !!!")
    else:
        print("Error al obtener los miembros del proyecto")
    return members

#--------Verificar si usuario es miembro de proyecto--
def usuario_es_miembro(id_user,id_project):
    es_miembro = False
    miembros = get_members_project_id(id_project)
    for m in miembros:
        href = "/api/v3/users/%s" % id_user
        if m['_links']['principal']['href']==href:
            for r in m['_links']['roles']:
                if r["title"]=="Member":
                    es_miembro = True
                    break
            break
    return es_miembro

#--------Agregar usuario a proyecto como "miembro"--
def agregar_usuario_proyecto(id_user,id_project):
    res = requests.post("%s/memberships" % (BASE_URL), 
                auth=('apikey', API_TOKEN),headers=HEADERS,
                json={"project": {"href":"/api/v3/projects/%s" % id_project},
                      "principal": {"href":"/api/v3/users/%s" % id_user},
                      "roles": [{"href":"/api/v3/roles/4"}]
                    }
                )
    if(res.status_code==201):
        print("se agrego con exito el usuario al proyecto")
    else:
        print("error al agregar el usuario al proyecto")


#=======USERS===============================
#--------Obtener usuario----
def get_user(user_name):
    user_found = {}
    filtros = '[{ "name": { "operator": "=", "values": ["%s"] } }] ' % user_name
    res = requests.get("%s/users" % (BASE_URL),
                        auth=('apikey', API_TOKEN),
                        params={'filters': filtros})
    if res.json():
        if res.json()["count"]>0:
            for u in res.json()["_embedded"]["elements"]:
                user_found = u
        else:
            print("El usuario %s no existe !!!" % user_name)
    else:
        print("Error al obtener usuario %s" % user_name)
    return user_found

#--------Obtener usuario id----
def get_user_id(user_name):
    id_user = 0
    user = get_user(user_name)
    if user:
        id_user = user['id']
    return id_user

#--------Crear usuario----
# user={"first_name":"Hernando", "last_name": "Lopez", "email":"llopez@openproject.com", 
#       "login":"l.lopez", "password":"lourdes101010"}
def create_user(user):
    print("Creando el usuario:", user)
    user_id = 0
    res = requests.post("%s/users" % (BASE_URL), 
                    auth=('apikey', API_TOKEN),headers=HEADERS,
                    json={"firstName": user['first_name'],
                          "lastName": user['last_name'],
                          "email": user['email'],
                          "login":user['login'],
                          "password": user['password'],
                          "status": "active",
                          "admin": "false",
                          "language": "es"
                        }
                    )
    if(res.status_code==201):
        content = json.loads(res.content)
        # print("conten:",content)
        # print("id:",content['id'])
        user_id = content['id']
        print("Se creo el usuario %s con exito" % user_id)
    else:
        print("Error al crear el usuario %s %s" % (user['first_name'], user['last_name']))
    return user_id

#--------Obtener todos los tipos-----
def get_all_types():
    task_types = []
    res = requests.get("%s/types" % (BASE_URL),
                        auth=('apikey', API_TOKEN))
    if res.json():
        count=res.json()["count"]
        if count>0:
            for p in res.json()["_embedded"]["elements"]:
                task_types.append(p)
    else:
        print("No hay tipos !!!")
    return task_types
def get_type_href(types, name):
    href = ""
    for t in types:
        if (t['name'] == name):
            href = t['_links']['self']['href']
            break
    return href

#---Obtener dict con email y tipos-----
def get_dict_email_tipo(tipos_opp): #---cambios 02-12-2021 ehp---
    email_tipo = {}
    data = cargar_json_tipos()
    # tipos_opp =  get_all_types()
    for d in data:
        href = get_type_href(tipos_opp, d['user_opp'])
        email_tipo[d['email']]=href

    return email_tipo

def cargar_json_tipos():
    data = None
    try:
        with open("data/openproject/user_type_opp.json") as handle:
            data = json.loads(handle.read())  
    except(Exception) as error:
        print("error al leer json", error)
    return data



if __name__ == '__main__':
    # print(get_user_id("Ernesto Huarix"))
    # user={"first_name":"Hernando", "last_name": "Lopez", "email":"llopez@openproject.com",
        #   "login":"l.lopez", "password":"lourdes101010"}
    # print(create_user(user))
    # print(get_members_project_id(14))
    # print(usuario_es_miembro(1, 14))

    # print(get_user_id("OpenProject Admin"))

    # agregar_usuario_proyecto(4,16)
    data = cargar_json_tipos()
    # print(data)
    for d in data:
        print(d)
    # dd = get_dict_email_tipo()
    # print(dd)
    # print("----")
    # keyy = "abigail.peterson3@example.com"
    # if(keyy in dd):
    #     print(dd[keyy])
    # else:
    #     print("no existe el correo %s " % keyy)

    # tt = get_all_types()
    # for t in tt:
    #     print (t)
    # print(get_type_href(tt, "jfletcher"))
        
    # dd = get_dict_email_tipo()
    # print(dd)
