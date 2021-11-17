import requests
from data.clockify import params_ckfy
# import params_ckfy

BASE_URL     = params_ckfy.CLOCKIFY_BASE_URL
WORKSPACE_ID = params_ckfy.CLOCKIFY_WORKSPACE_ID
HEADERS      = params_ckfy.CLOCKIFY_HEADERS

#========PROYECTOS========================

#--------Obtener proyecto-----
def get_project(project_name):
    project_found = {}
    res = requests.get("%s/workspaces/%s/projects" % (BASE_URL, WORKSPACE_ID), 
                        headers=HEADERS, 
                        params={'name': project_name})
    if(res.status_code==200):
        proyectos = res.json()
        if len(proyectos)>0:
            project_found = proyectos[0]
        else:
            print("Clockify, no existe el proyecto: %s" % project_name)
    else:
        print("Clockify, error al consultar el proyecto. Error:%s " % res.status_code)
    return project_found

#--------Obtener proyecto id-----
def get_project_id(project_name):
    id_project = ""
    res = requests.get("%s/workspaces/%s/projects" % (BASE_URL, WORKSPACE_ID), 
                        headers=HEADERS, 
                        params={'name': project_name})

    if(res.status_code==200):
        proyectos = res.json()
        if len(proyectos)>0:
            id_project = proyectos[0]['id']
        else:
            print("Clockify, no existe el proyecto: %s" % project_name)
    else:
        print("Clockify, error al consultar el proyecto. Error:%s " % res.status_code)
    return id_project

#--------Obtener proyecto por ID-----
def get_project_by_id(project_id):
    project_found = {}
    res = requests.get("%s/workspaces/%s/projects/%s" % (BASE_URL, WORKSPACE_ID, project_id), 
                        headers=HEADERS)
    if(res.status_code==200):
        project_found = res.json()
        if not project_found:
            print("Clockify, no existe el proyecto: %s" % project_id)
    else:
        print("Clockify, error al consultar el proyecto. Error:%s " % res.status_code)
    return project_found


#--------Agregar proyecto-----
def add_project(project_name, client_id, desc):
    res = requests.post("%s/workspaces/%s/projects" % 
                        (BASE_URL, WORKSPACE_ID), 
                        headers=HEADERS,
                        json={"name": project_name, "clientId": client_id,"public": True, "note":desc})
    if(res.status_code==201):
        id_project = res.json()['id']
        print("Clockify, Se creó el proyecto: %s" % project_name)
        return id_project
    else:
        res2 = res.json()
        print("Clockify, error al crear el proyecto.\nError: %s, %s " % (res2['code'],res2['message']))
        return ""


#--------Obtener todos los proyectos-----
def get_all_projects_on_workspace():
    proyectos_found = []
    res = requests.get("%s/workspaces/%s/projects" % (BASE_URL, WORKSPACE_ID), 
                        headers=HEADERS)
    if(res.status_code==200):
        proyectos = res.json()
        if len(proyectos)>0:
            proyectos_found = proyectos
        else:
            print("Clockify, no existen proyectos en el workspace")
    else:
        print("Clockify, error al consultar los proyectos. Error:%s " % res.status_code)
    return proyectos_found

def get_all_projects_on_workspace_id_desc():
    new_pps = []
    pps = get_all_projects_on_workspace()
    for p in pps:
        p_new = {}
        p_new['id'] = p['id']
        p_new['name'] = p['name']
        new_pps.append(p_new)
    return new_pps




if __name__ == '__main__':
    # print(add_project("prueba 5", "6139286cf1d18b7ed6674d8d", "prueba 5 5 5 5 5"))
    # print(get_project_id("prueba 5"))
    # print(get_project("prueba 6"))
    # print(get_project_by_id("6139286df1d18b7ed6674d8f"))
    print(get_all_projects_on_workspace_id_desc())
