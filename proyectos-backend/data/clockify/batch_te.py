import requests
import datetime

# from data.clockify import time_entries
# from data.clockify import users
# from data.clockify import projects
import data_time_entries
import data_users
import data_projects
import mail


#---Generar alertas----------
def generar_alertas(lista_emails, start_date):
    remitente = "anny.ruiz.tello@gmail.com" 
    asunto = "Alerta Nueva2: Registros de tiempo con incidencias" 

    for e in lista_emails:
        usuario = get_entries_no_task(e, start_date)
        
        #--Enviar correo--
        destinatarios = obtener_destinatarios(usuario['id'])
        mensaje = get_mensaje(usuario)
        mail.enviar_correo(remitente, destinatarios, asunto, mensaje)


#---Obtener registros sin tarea----------
# {id, name,email, tes: {id, description, projectId, project_name, start, end, duration}}
def get_entries_no_task(email, start_date):
    #---Usuario----
    usuario = {}
    user_found = data_users.get_user_by_email(email)
    if user_found:
        usuario['id'] = user_found['id']
        usuario['name'] = user_found['name']
        usuario['email'] = user_found['email']

    #---Tareas
    bad_tes = []
    proyectos = []
    sd = datetime.datetime(int(start_date[0:4]), int(start_date[5:7]), int(start_date[8:]))
    dateFinal = sd.isoformat() + "Z"
    tes = data_time_entries.get_time_entries(usuario['id'], dateFinal)
    for te in tes:
        if te['taskId'] is None:
            new_te = {}
            new_te['id'] = te['id']
            new_te['description'] = te['description']
            new_te['start'] = te['timeInterval']['start']
            new_te['end'] = te['timeInterval']['end']
            new_te['duration'] = te['timeInterval']['duration']
            #---Proyecto---
            p_found = {}
            if te['projectId'] is not None:
                p_found = get_project_from_array(proyectos,te['projectId'])
                if not p_found:
                    p_found = data_projects.get_project_by_id(te['projectId'])
            if p_found:
                proyectos.append(p_found)
                new_te['projectId'] = te['projectId']
                new_te['project_name'] = p_found['name']
            else:
                new_te['projectId'] = ""
                new_te['project_name'] = ""
            
            bad_tes.append(new_te)

    usuario['tes'] = bad_tes
    # print("Clockify. Registros identificados para usuario %s" % usuario['name'], bad_tes)
    return usuario


def get_project_from_array(proyectos, proyecto_id):
    proyecto = {}
    for p in proyectos:
        if p['id']==proyecto_id:
            proyecto = p
    return proyecto

#---Obtener mensaje HTML------
def get_mensaje(usuario):

    th = """<th style="text-align: left;padding: 8px;border: 0.5px solid #DDD; 
                    background-color: #1287B4;color: white;">"""
    td = """<td style="text-align: left;padding: 8px;border: 0.5px solid #DDD;">"""

    registros = ""
    for te in usuario['tes']:
        registros += """
                    <tr>{0}%s</td> {0}%s</td> {0}%s</td> {0}%s</td> </tr>
                    """ % (te['project_name'], 
                           te['start'], 
                           te['end'], 
                           te['duration'])
    registros = registros.format(td)

    mensaje = """Hola %s <br/> 
                Se han encontrado las siguientes incidencias en los registros de Clockify:<br/> <br/>
                <table style="border-collapse: collapse; border: 0.5px solid #DDD; width:100%%;">
                    <tr>
                    {0}Proyecto</th>  {0}Fecha Inicio</th> {0}Fecha Fin</th> {0}Duración</th>
                    </tr>
                %s
                </table>
                """  % (usuario['name'], registros)
    mensaje = mensaje.format(th)
    return mensaje

def obtener_destinatarios(usuario_id):
    lista_correos = ["ernesto.huari@gmail.com"]
    return lista_correos



if __name__ == '__main__':
    # user = get_bad_entries("6138e28053548466de3a0ab2","")
    #user = get_entries_no_task("ernesto","2021-09-17")
    # user = get_bad_entries("ernesto","")
    #print(user)
    generar_alertas(["ernestohp@hotmail.com"],"2021-09-19")

