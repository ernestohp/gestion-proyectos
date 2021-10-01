import requests
from data.openproject import params_opp
# import params_opp
import json

BASE_URL  = params_opp.BASE_URL
API_TOKEN = params_opp.API_TOKEN
HEADERS   = params_opp.HEADERS
BASE_PROJECT = params_opp.BASE_PROJECT

#=======PROYECTOS===============================
#--------Obtener todos los proyectos-----
def get_all_projects():
    projects = []
    res = requests.get("%s/projects" % (BASE_URL),
                        auth=('apikey', API_TOKEN))
    if res.json():
        count=res.json()["count"]
        if count>0:
            for p in res.json()["_embedded"]["elements"]:
                projects.append(p)
    else:
        print("No hay proyectos !!!")
    return projects

#--------Obtener id de proyecto-----
def get_project_id(project_name):
    projects = get_all_projects()
    id_project=0
    if len(projects)>0:
        for p in projects:
            if (p["name"]==project_name):
                id_project = p["id"]
                break
    return id_project

#--------Obtener detalles de proyecto----- 
def get_project(project_name):
    project_found = {}
    id_project = get_project_id(project_name)    
    if id_project>0:
        project_found = get_project_by_id(id_project)
    else:
        print("El proyeecto no existe !!!")
    return project_found
def get_project_by_id(id_project):
    project_found = {}
    if id_project>0:
        # filtros = '[{ "id": { "operator": "=", "values": ["%s"] } }] ' % id_project
        res = requests.get("%s/projects/%s" % (BASE_URL, id_project),
                        auth=('apikey', API_TOKEN)
                        # params={'filters': filtros}
                        )
        if(res.json()):
            project_found = res.json()
            print(res.json())
        else:
            print("El proyecto no existe")
    else:
        print("El codigo de proyecto no es valido !!!")
    return project_found


#--------Obtener proyectos hijos-----
def get_all_projects_parent_id(parent_id):
    projects = []
    if parent_id > 0:
        filtros = '[{ "parent_id": { "operator": "=", "values": ["%s"] } }] ' % parent_id
        res = requests.get("%s/projects" % (BASE_URL),
                        auth=('apikey', API_TOKEN),
                        params={'filters': filtros})
        if res.json():
            count=res.json()["count"]
            if count>0:
                for p in res.json()["_embedded"]["elements"]:
                    projects.append(p)
        else:
            print("There is no child projects !!!")
    else:
        print("parent id no valid !!!")
    return projects
def get_all_projects_parent_name(parent_name):
    projects = []
    parent_id = get_project_id(parent_name)
    print(parent_id)
    if parent_id>0:
        projects = get_all_projects_parent_id(parent_id)
    else:
        print("No existe el proyecto")
    return projects

#--------crear proyecto---------------
# parent_id=0 : no tiene proyecto padre
def create_project(project_name, desc, parent_id):
    print("OPP, creando el proyecto %s" % project_name)
    id_created = 0
    parent_href = None
    if parent_id !=0:
        parent_href = "/api/v3/projects/%s" % parent_id
    res = requests.post("%s/projects" % (BASE_URL), 
                        auth=('apikey', API_TOKEN),
                        headers=HEADERS,
                        json={"name": project_name,
                              "public": "true", 
                              "description":{"raw":desc},
                              "status":{"href":"/api/v3/project_statuses/on_track"},
                              "parent":{"href":parent_href}
                            #   "customField2":{"href":"/api/v3/custom_options/2", "title":"Luis Perez"}
                            }
                        )
    if(res.status_code==201):
        content = json.loads(res.content)
        # print(content)
        id_created = content['id']
    else:
        print("error al crear el proyecto. Error:%s " % res.status_code)
    return id_created

#--------actualizar proyecto---------------
def update_project(project_id, desc):
    print("OPP,Actualizando el proyecto %s" % project_id)
    res = requests.patch("%s/projects/%s" % (BASE_URL, project_id), 
                        auth=('apikey', API_TOKEN),
                        headers=HEADERS,
                        json={
                                "description":{"raw":desc}
                            }
                        )
    if(res.status_code==200):
        content = json.loads(res.content)
        print("se actualizo el proyecto %s" % content['name'])
        return project_id
    else:
        print("error al actualizar el proyecto. Error:%s " % res.status_code)
        return 0



def get_all_custom_objects():
    id = 1
    res = requests.get("%s/custom_objects/%s" % (BASE_URL, id),
                        auth=('apikey', API_TOKEN)
                      )
    print(res)



if __name__ == '__main__':
    # print(get_project_id("prueba 16"))
    # get_all_custom_objects()
    # pp = get_project("prueba 12")
    # print(pp['id'])
    print(get_project_id("Plataforma XYZ"))
    # id=create_project("prueba 18", "prueba 16 16 20", 3)
    # print(id)
    # update_project(16, "hola mundo")
