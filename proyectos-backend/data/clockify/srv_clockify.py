import requests
from data.clockify import data_clients
from data.clockify import data_tasks
from data.clockify import data_projects
# import clients
# import tasks
# import projects 

#==========Agregar proyecto=========
def add_project(project_name, client_name, desc):
    #---Verificar si el proyecto existe---
    id_proyecto = data_projects.get_project_id(project_name)
    if (id_proyecto==""):
        #---Verificar si el cliente existe---
        cliente_id = data_clients.get_client_id(client_name)
        if(cliente_id==""):
            #---Crear cliente----
            cliente_id = data_clients.create_client(client_name)
        #---Crear proyecto
        id_proyecto = data_projects.add_project(project_name, cliente_id, desc)

    return id_proyecto


#=========Agregar tareas a proyecto=========
def agregar_tareas_a_proyecto(proyecto_id, tareas):    
    #---Tareas actuales en clockfy---
    current_tareas = tasks.get_tasks_names_from_project(proyecto_id)
    
    #---Tareas nuevas-------
    tareas_nuevas = [i for i in tareas if i not in current_tareas]
    print("Clockify. Tareas a crear: ", tareas_nuevas)
    
    #---Agregar tareas nuevas------
    if len(tareas_nuevas) > 0:
        for t in tareas_nuevas:
            id_task = tasks.add_task_to_project(proyecto_id,t)





if __name__ == '__main__':
    # current_clockify_tasks = get_tasks_from_project('prueba 1')    
    # print(current_clockify_tasks)
    # projects = get_project_on_workspace("prueba 1")

    # tasks = ["mantenimiento 1", "Analisis", "Capacitacion"]
    # add_tasks_to_project("prueba 1", tasks)
    # id_cliente = get_client_id("Ernesto HP")
    # print(id_cliente)

    # id_cliente = add_client("BBC ABC")
    # print(id_cliente)

    # id_p=add_project("prueba 4", "Jose HP", "Este proyecto trata de estar al dia con los proveedores")
    # print(id_p)

    tasks = ["mantenimiento 1","Desarrollo", "Soporte", "Capacitacion"]
    agregar_tareas_a_proyecto("prueba 2", tasks)

    