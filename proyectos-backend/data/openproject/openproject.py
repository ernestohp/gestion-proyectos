from data.openproject import projects
from data.openproject import tasks
from data.openproject import users
from data.openproject import params_opp
# import projects
# import tasks
# import users
# import params_opp

BASE_URL  = params_opp.BASE_URL
API_TOKEN = params_opp.API_TOKEN
HEADERS   = params_opp.HEADERS
BASE_PROJECT = params_opp.BASE_PROJECT

#--------Crear Actualizar Proyecto-----
def create_update_project(project_name, desc):
    id_project = projects.get_project_id(project_name)
    if(id_project==0):
        parent_id = projects.get_project_id(BASE_PROJECT)
        id_project = projects.create_project(project_name, desc, parent_id)
        print("OPP, se creo con exito el proyecto %s" %project_name)
    else:
        id_updated = projects.update_project(id_project, desc)
        print("OPP, se actualizó con exito el proyecto %s" %project_name)
    return id_project

#--------Crear/Agregar usuario a proyecto-----
#usuario: ["apellido  nombre", ..]
def agregar_persona_ids(project_id, tareas):
    #---Obtener los usuarios sin repeticiones-----
    print("OPP, Agregando miembro a cada tarea...")
    listUsuarios = []
    for t in tareas:
        if t['persona']!="" and t['persona'] not in listUsuarios:
            listUsuarios.append(t['persona'])
    print("lista de usuarios", listUsuarios)
    #---obtener los ids de los usuarios
    dictUsuarios = {}
    for u in listUsuarios:
        es_miembro = False
        id_user = users.get_user_id(u)
        if id_user==0:
            (nombre,apellido)=u.split(" ", maxsplit=1)
            correo = nombre +"."+apellido+"@email.com"
            login = nombre[0:1] + apellido
            password = nombre + "10101010" 
            u2={"first_name":nombre, "last_name": apellido, "email":correo, 
                    "login":login, "password":password}
            id_user = users.create_user(u2)
        else:
            es_miembro = users.usuario_es_miembro(id_user, project_id)
        if (not es_miembro):
            users.agregar_usuario_proyecto(id_user, project_id)
        dictUsuarios[u]=id_user
    print("usuarios con id: ", dictUsuarios)
    
    for t in tareas:
        t['persona_id'] = 0 if(t['persona']=="") else dictUsuarios[t['persona']]
        
        # if(t['persona']==""):  
        #     t['persona_id'] = 0
        # else:  
        #     t['persona_id'] = dictUsuarios[t['persona']]


#--------Obtener los tiposde usuarios-----
def agregar_persona_tipo(tareas):
    #---Obtener los email y sus tipos----
    print("OPP, Agregando tipo usuario a cada tarea...")
    dictUsuarios = users.get_dict_email_tipo()
    print("correos con tipo: ", dictUsuarios)
    
    for t in tareas:
        tipo_user = ""
        if(t['email']!="") and (t['email'] in dictUsuarios):
            tipo_user = dictUsuarios[t['email']]
        t['tipo_user'] = tipo_user
        

#--------Crear tareas en proyecto----
# t = {"nombre":"Reunion", "fecha_ini":"2021-11-01", "fecha_fin":"2021-11-20", 
#       "tiempo_estimado": 26, "persona":"Ernesto Huari", "parent":"Gestion"}
def add_tasks_to_project_id(project_id, tareas):
    #---Persona_id----
    agregar_persona_ids(project_id, tareas)
    agregar_persona_tipo(tareas)
    #---Tareas actuales en Openproject---
    tareas_en_openproject = tasks.get_tasks_project_id(project_id)
    # for tt in tareas_en_openproject:
    #     print("tarea:",tt['subject'])
    tareas_a_eliminar = tasks.tareas_de_menos(tareas, tareas_en_openproject)
    print("tareas a eliminar:", tareas_a_eliminar)
    for t in tareas:
        #parent id----
        parent_id = tasks.get_parent_id(tareas_en_openproject, t)
        t['parent_id'] = parent_id
        print("tarea para crear/modificar:", t)
        #--Verificar si existe la tarea----
        t_found = tasks.get_task(tareas_en_openproject, t['nombre'])
        if t_found is None:
            new_tarea=tasks.add_task_to_project_id(project_id, t)
            tareas_en_openproject.append(new_tarea)
            print("tarea creada id %s, %s:" % (new_tarea['id'],new_tarea['subject']))
        else:
            lockVersion = t_found['lockVersion']
            t_id = t_found['id']
            if not tasks.es_tarea_padre(t['nombre'], tareas):
                tasks.update_task(t_id, t, lockVersion)
                print("tarea modificada id %s, %s:" % (t_found['id'],t_found['subject']))
    for t in tareas_a_eliminar:
        t_found = tasks.get_task(tareas_en_openproject, t)
        print("OPP. Tarea a eliminar: id %s nombre %s" % (t_found['id'], t_found['subject']))
        lockVersion = t_found['lockVersion']
        t_id = t_found['id']
        print("lockVersion %s, t_id %s" % (lockVersion, t_id))
        if not tasks.es_tarea_padre(t, tareas):
            tasks.delete_task(t_id, t, lockVersion)



if __name__ == '__main__':
    # wps = get_all_projects()
    # print(wps)
    # tt = get_tasks_project()
    # print(tt)
    # id=get_project_id("GLOBAL")
    # print(id)
    # tt = get_tasks_project_name("prueba 4")
    # print(len(tt))
    
    # print(tt["_embedded"]["elements"][1])
    
    # pps= get_all_projects_parent_name(BASE_PROJECT)
    # print(pps)

    # id=create_update_project("prueba 15", "proyecto prueba 15151515")
    # print(id)

    # get_project("prueba 12")
    
    # creacion de tareas--------
    # tts = []
    # t1 = {}
    # t1["nombre"] = "Gestion"
    # t1["fecha_ini"] = "2021-09-01"
    # t1["fecha_fin"] = "2021-09-10"
    # t1["tiempo_estimado"] = 15
    # t1["persona_id"] = 1
    # t1["parent"] = ""
    # t1 = {"nombre":"Definicion", "fecha_ini":"2023-11-01", "fecha_fin":"2023-11-20", 
    #   "tiempo_estimado": 77, "persona":"Alex Rubio", "parent":""}
    # t2 = {"nombre":"DefPro - Planificacion", "fecha_ini":"2026-12-01", "fecha_fin":"2026-12-20", 
    #   "tiempo_estimado": 55, "persona":"Lucia Cruz", "parent":"Definicion"}

    # tts.append(t1)
    # tts.append(t2)
    # add_tasks_to_project_id(16, tts)

    # id=tasks.get_task_id(16,"Reunion Cliente")
    # print(id)

    # get_members_project_id(16)
    # print(get_user_id("Ernesto HP"))

        tareas_en_openproject = tasks.get_tasks_project_id(16)
        # print("tareas en opp", tareas_en_openproject)
        t_found = tasks.get_task(tareas_en_openproject, "Reunion SociosX")
        print(t_found)
        if t_found is None:
            # id_tarea=tasks.add_task_to_project_id(project_id, t)
            print("tarea creada:")
        else:
            lockVersion = t_found['lockVersion']
            t_id = t_found['id']
            print(lockVersion, t_id)
            print("se actualizo con exito")

