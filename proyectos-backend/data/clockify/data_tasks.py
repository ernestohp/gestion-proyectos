import requests
from data.clockify import params_ckfy
# import params_ckfy

BASE_URL     = params_ckfy.CLOCKIFY_BASE_URL
WORKSPACE_ID = params_ckfy.CLOCKIFY_WORKSPACE_ID
HEADERS      = params_ckfy.CLOCKIFY_HEADERS

#========CLIENTE==============================
#-------Obtener tareas de proyecto-----
def get_tasks_from_project(project_id):
    tasks = []
    res = requests.get("%s/workspaces/%s/projects/%s/tasks" % 
                    (BASE_URL, WORKSPACE_ID, project_id),
                    headers=HEADERS)

    if(res.status_code==200):
        tasks = res.json()
        if len(tasks)==0:
            print("Clockify, no existen tareas en el proyecto %s" % project_id)
    else:
        print("Clockify, error al consultar el cliente. Error:%s " % res.status_code)
    return tasks

#-------Obtener tareas de proyecto (solo nombres)-----
def get_tasks_names_from_project(project_id):
    tareas = []
    tareas_full = get_tasks_from_project(project_id)
    for t in tareas_full:
        tareas.append(t['name'])
    return tareas


#--------Agregar tarea a un proyecto----------
def add_task_to_project(project_id, task_name):
    res = requests.post("%s/workspaces/%s/projects/%s/tasks" % 
                    (BASE_URL, WORKSPACE_ID,project_id), 
                    headers=HEADERS,
                    json={"name": task_name, "status": "ACTIVE"})
    if(res.status_code==201):
        id_task = res.json()['id']
        print("Clockify, Se creó la tarea %s" % task_name)
        return id_task
    else:
        res2 = res.json()
        print("Clockify, error al crear el cliente.\nError: %s, %s " % (res2['code'],res2['message']))
        return ""


#----Para probar los metodos independientemente----
if __name__ == '__main__':
    # print(add_task_to_project("6138ebf5ed88926aa3295989","Global 16"))
    # print(get_tasks_from_project("6138ebf5ed88926aa3295989"))
    print(get_tasks_names_from_project("6138ebf5ed88926aa3295989"))