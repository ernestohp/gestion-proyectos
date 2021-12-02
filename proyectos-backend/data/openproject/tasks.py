import requests
import json
from data.openproject import params_opp
# import params_opp

BASE_URL  = params_opp.BASE_URL
API_TOKEN = params_opp.API_TOKEN
HEADERS   = params_opp.HEADERS
BASE_PROJECT = params_opp.BASE_PROJECT

#=======TAREAS===============================
#--------Obtener tareas de un proyecto--
def get_tasks_project_id(project_id):
    tasks =[]
    res = requests.get("%s/projects/%s/work_packages" % (BASE_URL,project_id),
                        auth=('apikey', API_TOKEN), params={'pageSize': 100})
    if res.json():
        count=res.json()["count"]
        if count>0:
            for t in res.json()["_embedded"]["elements"]:
                tasks.append(t)
        else:
            print("No hay tareas en el proyecto !!!")
    return tasks

#-----Obtener tarea-------------
def get_task(tasks, task_name):
    task_found = None
    for t in tasks:
        if (t["subject"]==task_name):
            task_found = t
            break
    return task_found
def get_task_id_arr(tasks, task_name):
    id_task = 0
    for t in tasks:
        if (t["subject"]==task_name):
            id_task = t["id"]
            break
    return id_task
def get_task_id(project_id, task_name):
    id_task = 0
    tasks = get_tasks_project_id(project_id)
    id_task = get_task_id_arr(tasks, task_name)
    return id_task

#-----Obtener tarea padre id--------------
def get_parent_id_old(project_id, tarea):
    #---Parent_id-----
    parent_id=0
    if tarea["parent"]!= "":
        parent_id = get_task_id(project_id,tarea["parent"])
    return parent_id
def get_parent_id(tareas, tarea):
    parent_id=0
    if tarea["parent"]!= "":
        t_found = get_task(tareas,tarea["parent"])
        if t_found is not None:
            parent_id=t_found['id']
    return parent_id
def es_tarea_padre(nombre, tareas):
    es_padre = False
    for t in tareas:
        if (t["parent"]==nombre):
            es_padre = True
            break
    return es_padre

#-----Obtener tarea padre id--------------
def tareas_de_menos(tareas, tareas_opp):
    x=[]
    y=[]
    for t in tareas:
        x.append(t['nombre'])
    for t in tareas_opp:
        y.append(t['subject'])

    tts = [i for i in y if i not in x]
    return tts
    




#--------Crear tarea en proyecto----
def add_task_to_project_id(project_id, tarea):
    print("OPP, agregando tarea %s a proyecto %s" % (tarea["nombre"], project_id))
    tarea_created={}
    # href para parent y persona 
    parent_href = None
    if tarea['parent_id'] !=0:
        parent_href = "/api/v3/work_packages/%s" % tarea['parent_id']
    persona_href = None
    # if tarea['persona_id'] !=0:
    #     persona_href = "/api/v3/users/%s" % tarea['persona_id']
    fecha_ini = None
    if tarea["fecha_ini"] != "":
        fecha_ini = tarea["fecha_ini"]
    fecha_fin = None
    if tarea["fecha_fin"] != "":
        fecha_fin = tarea["fecha_fin"]
    tiempo_estimado = None
    if tarea["tiempo_estimado"] != "":
        tiempo_estimado = "PT%sH" % tarea["tiempo_estimado"]
    
    #Tipo de tarea: Task, Milestone
    #tipo_href = "/api/v3/types/1" if t.tipo=="milestone" else "/api/v3/types/2"
    tipo_href = "/api/v3/types/1"
    if(tarea["tipo"]=="milestone"): 
        tipo_href = "/api/v3/types/2"
    else:
        if(tarea["tipo_user"]!=""):
            tipo_href = tarea["tipo_user"]
    print("tipo_href", tipo_href)

    res = requests.post("%s/projects/%s/work_packages" % (BASE_URL, project_id), 
                    auth=('apikey', API_TOKEN),headers=HEADERS,
                    json={"subject": tarea["nombre"],
                            "startDate": fecha_ini,
                            "dueDate": fecha_fin,
                            "estimatedTime": tiempo_estimado,
                            "parent":{"href":parent_href},
                            "assignee":{"href": persona_href},
                            "type":{"href": tipo_href},
                        }
                    )
    if(res.json()['id']):
        tarea_created = res.json()
    return tarea_created


#--------actualizar tarea---------------
def update_task(tarea_id, tarea, lockVersion):
    print("OPP, modificando la tarea %s" % tarea["nombre"])
    persona_href = None
    # if tarea['persona_id'] !=0:
    #     persona_href = "/api/v3/users/%s" % tarea['persona_id']
    fecha_ini = None
    if tarea["fecha_ini"] != "":
        fecha_ini = tarea["fecha_ini"]
    fecha_fin = None
    if tarea["fecha_fin"] != "":
        fecha_fin = tarea["fecha_fin"]
    tiempo_estimado = None
    if tarea["tiempo_estimado"] != "":
        tiempo_estimado = "PT%sH" % tarea["tiempo_estimado"]

    #Tipo de tarea: Task, Milestone
    #tipo_href = "/api/v3/types/1" if t.tipo=="milestone" else "/api/v3/types/2"
    tipo_href = "/api/v3/types/1"
    if(tarea["tipo"]=="milestone"): 
        tipo_href = "/api/v3/types/2"
    else:
        if(tarea["tipo_user"]!=""):
            tipo_href = tarea["tipo_user"]


    res = requests.patch("%s/work_packages/%s" % (BASE_URL, tarea_id), 
                        auth=('apikey', API_TOKEN),
                        headers=HEADERS,
                        json={
                            "lockVersion": lockVersion,
                            "subject": tarea["nombre"],
                            "startDate": fecha_ini,
                            "dueDate": fecha_fin,
                            "estimatedTime": tiempo_estimado,
                            "assignee":{"href": persona_href},
                            "type":{"href": tipo_href}
                            }
                        )
    if(res.status_code==200):
        content = json.loads(res.content)
        print("se actualizo la tarea %s" % content['subject'])
        return tarea_id
    else:
        print("error al actualizar la tarea. Error:%s " % res.status_code)
        return 0

#--------Eliminar tarea---------------
def delete_task(tarea_id, tarea, lockVersion):
    print("OPP, aliminando la tarea %s" % tarea)
    persona_href = None
    fecha_ini = None
    fecha_fin = None
    tiempo_estimado = "PT0H"

    res = requests.patch("%s/work_packages/%s" % (BASE_URL, tarea_id), 
                        auth=('apikey', API_TOKEN),
                        headers=HEADERS,
                        json={
                            "lockVersion": lockVersion,
                            "subject": tarea,
                            "startDate": fecha_ini,
                            "dueDate": fecha_fin,
                            "estimatedTime": tiempo_estimado,
                            "assignee":{"href": persona_href}
                            }
                        )
    if(res.status_code==200):
        content = json.loads(res.content)
        print("se eliminó la tarea %s" % content['subject'])
        return tarea_id
    else:
        print("error al eliminar la tarea. Error:%s " % res.status_code)
        return 0





#--------Obtener tareas de un proyecto--
# def get_tasks_project_name(name):
#     id_project = projects.get_project_id(name)
#     if id_project>0:
#         return projects.get_tasks_project_id(id_project)
#     else:
#         print("El proyeecto no existe !!!")


if __name__ == '__main__':
    # t2 = {"nombre":"Reunion miembros", "fecha_ini":"2021-11-01", 
    #             "fecha_fin":"2021-11-20", "tiempo_estimado": 26, 
    #             "persona_id":1, "parent":"Gestion"}

    # t2 = {"nombre":"Analisis", "fecha_ini":"", 
    #             "fecha_fin":"", "tiempo_estimado": "", 
    #             "persona_id":0, "parent_id":0}
    # print(add_task_to_project_id(16,t2))

    # print(get_task_id(16, "Definicion"))
    print(get_tasks_project_id(29))