import requests
from datetime import datetime, timedelta

from data.clockify import data_time_entries
from data.clockify import data_users
from data.clockify import data_projects
from data.clockify import mail
from data.clockify import constantes
from data.clockify import util
from data.proyectosdb import alertasdb
from data.proyectosdb import personas
from data.proyectosdb import calendario
# import data_time_entries
# import data_users
# import data_projects
# import mail

MAIL_FROM = "anny.ruiz.tello@gmail.com"

#---Generar alertas para supervisores----------
#lista_ids = ["0"] o [] --> todos los usuarios
def generar_alertas_sup(lista_ids, ventana):
    print('generando alertas para supervisores...')
    #--Usuarios---
    usersFinal = obtener_usuarios_final(lista_ids)
    #--Usuarios supervisores--
    usersSup = alertasdb.lista_usuarios_sup()
    #---Fecha---
    new_date = util.obtener_fecha_inicio(ventana)
    str_date = new_date.isoformat() + "Z"
    hoy = datetime.now()
    #---Remitente y asunto--
    remitente = MAIL_FROM 
    asunto = "Clockify: Registros con incidencias - %s " % hoy.strftime("%d/%m/%Y %H:%M%p")

    #---Mensaje---
    mensaje_detalle = ""
    for u in usersFinal:
        usuarioDetalle = get_user_bad_tes(u, str_date)
        if(len(usuarioDetalle['tes'])>0 or usuarioDetalle['tes_rango']>0):
            mensaje_detalle += get_mensaje_sup(usuarioDetalle)

    #---Enviar correo---
    if mensaje_detalle != "":
        for us in usersSup:
            destinatarios = []
            destinatarios.append(us['email'])
            print("enviar correo a:", destinatarios)        
            #--Mensaje---
            mensaje = get_mensaje_cabecera_usuario(us)
            mensaje += mensaje_detalle
            #--Enviar correo---
            mail.enviar_correo(remitente, destinatarios, asunto, mensaje)

#---Generar alertas a cada usuario----------
#lista_ids = ["0"] o [] --> todos los usuarios
def generar_alertas2(lista_ids, ventana):
    print('generando alertas...')
    #--usuarios---
    usersFinal = obtener_usuarios_final(lista_ids)
    usersDB = obtener_usuarios_ausencias()
    #---Fecha---
    new_date = util.obtener_fecha_inicio(ventana)
    str_date = new_date.isoformat() + "Z"
    hoy = datetime.now()
    #---Remitente y asunto--
    remitente = MAIL_FROM
    asunto = "Clockify: Registros con incidencias - " + hoy.strftime("%d/%m/%Y %H:%M%p")
    for u in usersFinal:
        ausencias = get_ausencias(u, usersDB)
        usuarioDetalle = get_user_bad_tes(u, str_date, ausencias)

        if(len(usuarioDetalle['tes'])>0 or usuarioDetalle['tes_rango']>0):
            #--Destinatario--
            destinatarios = []
            destinatarios.append(usuarioDetalle['email'])
            # print("enviar correo a:", destinatarios)
            #--Mensaje---
            mensaje = get_mensaje_cabecera_usuario(usuarioDetalle)
            mensaje += get_mensaje(usuarioDetalle)
            # print("Mensaje a enviar:", mensaje)
            #---Enviar correo---
            mail.enviar_correo(remitente, destinatarios, asunto, mensaje)

#---Obtener registros sin tarea----------
# {id, name, email, tes: {id, description, projectId, project_name, start, end, duration, motivo},
#                   tes_rango: {fecha, motivo, detalle: {start, end, duration,project_name, motivo}}}
def get_user_bad_tes(user, start_date, ausencias):
    print("----Buscando incidencias para usuario:---",user['name'])
    usuario = {}
    if user:
        usuario['id'] = user['id']
        usuario['name']  = user['name']
        usuario['email'] = user['email']

    usuario['tes'] = []
    usuario['tes_rango'] = []

    alerta1 = user['alerta1']
    alerta2 = user['alerta2']
    alerta3 = user['alerta3']

    tes = []
    proyectos = []
    if (alerta1==1) or (alerta2==1) or (alerta3==1):
        tes = data_time_entries.get_time_entries(user['id'], start_date)
        proyectos = data_projects.get_all_projects_on_workspace_id_desc()
    
    #---Alerta 1 y 2----
    tes_total = tes.copy()
    bad_tes = []
    if (alerta2==1):
        for te in tes_total:
            if te['timeInterval']['end'] is not None and te['projectId'] is None:
                new_te = get_task_detail(te, proyectos)
                new_te['motivo'] = 'No ingresó el nombre del proyecto ni la tarea'
                bad_tes.append(new_te)
                tes_total.remove(te)
    if (alerta1==1):
        for te in tes_total:
            if te['timeInterval']['end'] is not None and te['taskId'] is None:
                new_te = get_task_detail(te, proyectos)
                new_te['motivo'] = 'No ingresó el nombre de la tarea'
                bad_tes.append(new_te)
    # print("bad entries, no task, o projects: user %s" % user['name'], bad_tes)
    if(len(bad_tes) > 0 ): usuario['tes'] = bad_tes

    #---Alerta 3----
    motivo1 = "Ha trabajado menos tiempo de lo esperado"
    motivo2 = "Ha trabajado más tiempo de lo esperado"
    bad_tes_rango = []
    if (alerta3==1):
        print("alerta3", alerta3)
        tes_agrupados_fecha = get_tes_agrupados_fecha(tes, proyectos)
        for te in tes_agrupados_fecha:
            #---Horas min-----
            hMin = user['horas_min']
            for a in ausencias:
                if(a['fecha']==te['fecha']):
                    hMin = hMin - a['horas']
            hMax = user['horas_max']
            if user['extras']==1:
                hMax = hMax + 50
            min = {"days":0, "hours":hMin, "mins":0, "secs":0}
            max = {"days":0, "hours":hMax, "mins":0, "secs":0}

            tiempo_total = te['tiempo_total']
            if (util.compare_time(tiempo_total, min)==-1 or util.compare_time(tiempo_total, max) == 1):
                if (util.compare_time(tiempo_total, min)==-1):
                    te['motivo'] = motivo1
                if (util.compare_time(tiempo_total, max) == 1):
                    te['motivo'] = motivo2
                bad_tes_rango.append(te)

    if(len(bad_tes_rango) > 0 ): usuario['tes_rango'] = bad_tes_rango

    print("Clockify. usuario y sus bad entries.", usuario)
    return usuario

#{fecha, tiempo_total:{days, hours, mins, secs}, motivo, detalle:{start, end, duration, project_name}}
def get_tes_agrupados_fecha(tes, proyectos):
    new_tes = []
    for te in tes:
        fecha = util.format_date2(te['timeInterval']['start'])
        # print("fecha a analizar", fecha)
        te_agr = {}
        if (existe_fecha_tes(fecha, new_tes)):
            # print("existe fecha", fecha)
            for t in new_tes:
                if(t['fecha']==fecha):
                    # print("fecha existente", t)
                    tiempo_nuevo = util.get_time_dict(te['timeInterval']['duration'])
                    # print("tiempo nuevo", tiempo_nuevo)
                    t['tiempo_total'] = util.sum_time_dict(t['tiempo_total'],tiempo_nuevo)
                    # print("nuevo tiempo total", t['tiempo_total'])
                    t['detalle'].append(get_task_detail2(te,proyectos))
                    # print("registro despues de sumar tiempos", t)
                    break
        else:
            te_agr['fecha'] = util.format_date2(te['timeInterval']['start'])
            te_agr['tiempo_total'] = util.get_time_dict(te['timeInterval']['duration'])   #asignar
            te_agr['motivo'] = "Fuera de rango de horas" 
            detalles = []
            detalle_tarea = get_task_detail2(te,proyectos)
            detalles.append(detalle_tarea)
            te_agr['detalle'] = detalles
            print("registro", te_agr)
            new_tes.append(te_agr)
    return new_tes

def existe_fecha_tes(strFecha, tt):
    for t in tt:
        if(t['fecha']==strFecha):
            return True
    return False

#---Obtener usuarios finales a generar------
#lista_ids = ["0"] o [] --> todos los usuarios
def obtener_usuarios_final(lista_ids):
    usersFinal = []
    usersTotal = alertasdb.lista_usuarios()
    if (len(lista_ids) == 0 or lista_ids[0]=="0"):
        usersFinal = usersTotal
    else:
        for u in usersTotal:
            if u['id'] in lista_ids:
                usersFinal.append(u)
    return usersFinal


def get_task_detail(te, proyectos):
    new_te = {}
    new_te['id'] = te['id']
    new_te['description'] = te['description']
    new_te['start']    = util.format_date(te['timeInterval']['start'])
    new_te['end']      = util.format_date(te['timeInterval']['end'])
    new_te['duration'] = util.format_time(te['timeInterval']['duration'])
    #---Proyecto---
    if te['projectId'] is not None:
        p_found = get_project_from_array(proyectos,te['projectId'])
        new_te['projectId'] = p_found['id']
        new_te['project_name'] = p_found['name']
    else:
        new_te['projectId'] = ""
        new_te['project_name'] = ""

    return new_te

def get_task_detail2(te, proyectos):
    new_te = {}
    new_te['start']    = util.format_date3(te['timeInterval']['start'])
    new_te['end']      = util.format_date3(te['timeInterval']['end'])
    new_te['duration'] = util.format_time(te['timeInterval']['duration'])
    #---Proyecto---
    if te['projectId'] is not None:
        p_found = get_project_from_array(proyectos,te['projectId'])
        new_te['projectId'] = p_found['id']
        new_te['project_name'] = p_found['name']
    else:
        new_te['projectId'] = ""
        new_te['project_name'] = ""

    return new_te


#---Generar alertas----------
def generar_alertas(lista_emails, start_date):
    remitente = "anny.ruiz.tello@gmail.com" 
    asunto = "Alerta Nueva2: Registros de tiempo con incidencias" 

    for e in lista_emails:
        usuario = get_entries_no_task(e, start_date)
        
        #--Enviar correo--
        destinatarios = []
        destinatarios.append(e)

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

#========MENSAJES==============================
#---tabla con registros sin tarea o proyecto------
def msg_te_no_tasks_projects(tes, pre_titulo=""):
    th = constantes.TH
    td = constantes.TD
    registros = ""
    for te in tes:
        registros += """
                    <tr>{0}%s</td> {0}%s</td> {0}%s</td> {0}%s</td> {0}%s</td> </tr>
                    """ % (te['project_name'], 
                           te['start'], 
                           te['end'], 
                           te['duration'],
                           te['motivo'])
    registros = registros.format(td)

    mensaje = """
            <h4>%sRegistros sin tarea/proyecto</h4>
            <table style="border-collapse: collapse; border: 0.5px solid #DDD; width:100%%;">
                <tr>
                {0}Proyecto</th>  {0}Fecha Inicio</th> {0}Fecha Fin</th> {0}Duración</th> {0}Motivo</th>
                </tr>
            %s
            </table>
            """  % (pre_titulo,registros)
    mensaje = mensaje.format(th)
    return mensaje

#---tabla con fechas fuera de rango de horas------
#{fecha,motivo,detalle:{start,end, duration, project_name}}
def msg_te_fuera_rango(tes_rangos, pre_titulo=""):
    th = constantes.TH
    th1 = constantes.TH1
    td = constantes.TD
    registros = ""
    for te in tes_rangos:
        detalle_fila =  ""

        for d in te['detalle']:
            detalle_fila += """
                            <tr>{0}%s</td> {0}%s</td> {0}%s</td> {0}%s</td> </tr>
                            """ % (d['start'], 
                                   d['end'], 
                                   d['duration'],
                                   d['project_name'])
        detalle_fila = detalle_fila.format(td)
        detalle_tabla = """
            <table style="border-collapse: collapse; border: 0.5px solid #DDD; width:100%%;">
                <tr>
                {0}Inicio</th>  {0}Fin</th> {0}Duración</th> {0}Proyecto</th>
                </tr>
            %s
            </table>
            """  % detalle_fila
        detalle_tabla = detalle_tabla.format(th1)
        tiempo_total = util.format_time2(te['tiempo_total'])
        registros += """
                    <tr>{0}%s<br>Total: <b>%s</b></td> {0}%s</td> {0}%s</td> </tr>
                    """ % (te['fecha'], 
                           tiempo_total,
                           detalle_tabla,
                           te['motivo'])
    registros = registros.format(td)
    mensaje = """
            <h4>%sCantidad de tiempo trabajado</h4>
            <table style="border-collapse: collapse; border: 0.5px solid #DDD; width:100%%;">
                <tr>
                {0}Fecha</th>  {0}Detalle</th> {0}Motivo</th>
                </tr>
            %s
            </table>
            """  % (pre_titulo,registros)
    mensaje = mensaje.format(th)
    return mensaje

def get_mensaje_cabecera_usuario(usuario):
    mensaje = """Hola %s <br/> 
                Se han encontrado las siguientes incidencias en los registros de Clockify:<br/> <br/>
                """  % usuario['name']
    return mensaje


#---Obtiene el HTML de las dos tablas de incidencias------
def get_mensaje(usuario):
    mensaje = ""
    if(len(usuario['tes'])>0):
        mensaje += msg_te_no_tasks_projects(usuario['tes'])
    if(len(usuario['tes_rango'])>0):
        mensaje += msg_te_fuera_rango(usuario['tes_rango'])
    return mensaje

#---Obtiene el HTML de las dos tablas para supervisor------
def get_mensaje_sup(usuario):
    mensaje = ""
    pre_titulo = "<b>%s</b>: " % usuario['name']
    if(len(usuario['tes'])>0):
        mensaje += msg_te_no_tasks_projects(usuario['tes'], pre_titulo)
    if(len(usuario['tes_rango'])>0):
        mensaje += msg_te_fuera_rango(usuario['tes_rango'], pre_titulo)
    return mensaje


#---Obtener usuarios desde clockify-----
#{id, email, name}
def obtener_usuarios():
    new_users = []
    usuarios = data_users.get_users()
    for u in usuarios:
        # if (u['status'] in ["ACTIVE", "NOT_REGISTERED"] ):
        if (u['status'] in ["ACTIVE"] ):
            newUser = {}
            newUser['id']    = u['id']
            newUser['email'] = u['email']
            newUser['name']  = u['name']
            new_users.append(newUser)
    print("list usuarios alertas clockify:", new_users)
    return new_users



def obtener_usuarios_ausencias():
    pp = personas.lista_personas()

    for p in pp:
        #--Ausencias---
        data = (int(p['id']),)            
        aa = personas.lista_ausencias_user(data)
        array_days_hours = personas.obtener_array_ausencias(aa)
        #--Festivos---
        days_festivos = calendario.array_festivos_horas()
        array_days_hours = array_days_hours + days_festivos
        unicos_days_hours = personas.valores_unicos_array(array_days_hours)

        p['ausencias'] = unicos_days_hours

def get_ausencias(user, usuariosBD):
    ausencias = []
    for u in usuariosBD:
        if(u['name']==user['name']):
            ausencias = u['ausencias']
    return ausencias


if __name__ == '__main__':
    # user = get_bad_entries("6138e28053548466de3a0ab2","")
    #user = get_entries_no_task("ernesto","2021-09-17")
    # user = get_bad_entries("ernesto","")
    #print(user)
#    generar_alertas(["ernestohp@hotmail.com"],"2021-09-19")
 #   obtener_usuarios()
    generar_alertas2(['614dedceb49ce00a90d6e7f7'], 'ultimo_dia')




