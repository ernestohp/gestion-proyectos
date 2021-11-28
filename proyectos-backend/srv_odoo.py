from data.odoo import projects
from data.odoo import util
from data.odoo import employees
from data.odoo import account_managers
from data.odoo import params_odoo
from data.odoo import calendario as cal_odoo

from data.clockify import mail_params
from data.clockify import mail

from data.proyectosdb import clientes
from data.proyectosdb import proyectos
from data.proyectosdb import personas
from data.proyectosdb import calendario

URL_APP_PROYECTOS="http://localhost:3000"
MODE_ODOO_CUSTOM = False


def get_data_from_odoo():
    #-----Empleados-------
    personas_db = personas.lista_personas()
    personas_odoo = employees.get_employees()
    nuevas_personas = util.obtener_diferencial2(personas_odoo,personas_db)
    print("personal nuevo: ",nuevas_personas)
    for p in nuevas_personas:
        data = (p['id'], p['name'], p['work_email'])
        personas.insertar_persona(data)

    #----Ausencias-------
    ausencias_db = personas.lista_ausencias()
    ausencias_odoo = employees.get_ausencias_all()
    nuevas_ausencias = util.obtener_diferencial2(ausencias_odoo,ausencias_db)
    print("nuevas ausencias aprobadas: ",nuevas_ausencias)
    for p in nuevas_ausencias:
        request_unit = 'hours' if p['request_unit_hours'] else 'days'
        hours_from = p['request_hour_from'] if p['request_hour_from'] else p['date_from'][11:13]
        hours_to   = p['request_hour_to']   if p['request_hour_to']   else p['date_to'][11:13]
        data = (p['id'], p['name'], p['request_date_from'], p['request_date_to'], 
                p['number_of_days'], p['employee_id'][0], 
                hours_from, hours_to, request_unit, p['number_of_hours_display']
                )
        personas.insertar_ausencia(data)    

    #---Calendario - eventos
    eventos_bd = calendario.lista_eventos()
    eventos_odoo = cal_odoo.get_general_holiday()
    # nuevos_eventos = util.obtener_diferencial2(eventos_odoo,eventos_bd)
    ids_eventos_bd = [e['id'] for e in eventos_bd]
    print("eventos odoo: ", eventos_odoo)
    for e in eventos_odoo:        
        allday = 1 #if e['allday'] else 0
        if e['id'] in ids_eventos_bd:
            data = (e['name'], e['date_from'][0:10], e['date_to'][0:10], allday, e['id'])
            calendario.actualizar_evento(data)
        else:
            data = (e['name'], e['date_from'][0:10], e['date_to'][0:10], allday, e['id'])
            calendario.insertar_evento(data)


    #---Leer proyectos desde Odoo---- 
    proyectos_ganados = projects.get_projects_won()

    #----Clientes------
    lista_clientes = clientes.lista_clientes()
    customers = util.obtener_valores_unicos(proyectos_ganados,'partner_id')
    nuevos_clientes = util.obtener_diferencial(customers,lista_clientes)
    print("clientes nuevos: ",nuevos_clientes)
    for c in nuevos_clientes:
        data = (c[0], c[1])
        clientes.insertar_cliente(data)

    #----Account Managers--------
    #lista_amanagers = amanagers.lista_amanager()
    amanagers_odoo = util.obtener_valores_unicos(proyectos_ganados,'user_id')
    amanagers_emps = util.filtrar_emps_1(personas_odoo, 'name', amanagers_odoo)
    print("AManagers: ",amanagers_emps)
    for c in amanagers_emps:
        data = (1,c['id'])
        personas.actualizar_account_manager(data)


    #---Grabar Project Owner -------
    if MODE_ODOO_CUSTOM:
        powner_odoo = util.obtener_valores_unicos(proyectos_ganados,'x_project_owner')
        powner_emps = util.filtrar_emps_2(personas_odoo, 'name', powner_odoo)
        print("POwners: ",powner_emps)
        for c in powner_emps:
            data = (1,c['id'])
            personas.actualizar_project_owner(data)

    #---Importar proyectos ganados -------
    estado_ganado=params_odoo.ESTADO_GANADO
    lista_proyectos_db = proyectos.lista_proyectos()
    ids_proyectos_db = [a['id'] for a in lista_proyectos_db]

    proyectos_mod_ins = util.obtener_diferencial_proyectos(proyectos_ganados, lista_proyectos_db)
    print("proyectos nuevos y a modificar: ", proyectos_mod_ins)
    for p in proyectos_mod_ins:
        amanager_id = util.get_id(amanagers_emps, p['user_id'][1])
        pwoner_id = 1
        if MODE_ODOO_CUSTOM:
            pwoner_id = util.get_id(powner_emps, p['x_project_owner'])
        horas_estimadas = util.getHorasEstimadas(p)
        date_dead_line = None if not p['date_deadline'] else p['date_deadline']
        x_prev_final = None if not p['x_prev_final'] else p['x_prev_final']
        x_fecha_hito_1 = None if not p['x_fecha_hito_1'] else p['x_fecha_hito_1']
        x_fecha_hito_2 = None if not p['x_fecha_hito_2'] else p['x_fecha_hito_2']
        x_fecha_hito_3 = None if not p['x_fecha_hito_3'] else p['x_fecha_hito_3']
        x_fecha_hito_4 = None if not p['x_fecha_hito_4'] else p['x_fecha_hito_4']
        x_fecha_hito_5 = None if not p['x_fecha_hito_5'] else p['x_fecha_hito_5']
        x_fecha_hito_6 = None if not p['x_fecha_hito_6'] else p['x_fecha_hito_6']
        data = None
        if p['id'] not in ids_proyectos_db:
            if MODE_ODOO_CUSTOM:
                data = (p['display_name'],date_dead_line,estado_ganado, 
                    p['partner_id'][0], pwoner_id, amanager_id, p['expected_revenue'],
                    horas_estimadas,
                    x_prev_final, 
                    x_fecha_hito_1, x_fecha_hito_2, x_fecha_hito_3,
                    x_fecha_hito_4, x_fecha_hito_5, x_fecha_hito_6,
                    p['x_importe_hito_1'], p['x_importe_hito_2'], p['x_importe_hito_3'],
                    p['x_importe_hito_4'], p['x_importe_hito_5'], p['x_importe_hito_6'],
                    p['id'])
            else:
                data = (p['display_name'],date_dead_line,estado_ganado, 
                    p['partner_id'][0], pwoner_id, amanager_id, p['expected_revenue'],
                    horas_estimadas,
                    p['id'])
            proyectos.insertar_proyecto(data, MODE_ODOO_CUSTOM)
            
            #---enviar email---
            personas_db_new = personas.lista_personas()
            (emails_to, emails_cc) = util.get_emails_usuarios_pm_am(personas_db_new, pwoner_id)
            asunto = get_asunto_email(p)
            mensaje = get_mensaje_email(p)
            mail.enviar_correo_con_cc(mail_params.MAIL_FROM, emails_to, emails_cc, asunto, mensaje)
        else:
            if MODE_ODOO_CUSTOM:
                data = (p['display_name'],date_dead_line,
                    p['partner_id'][0], pwoner_id, amanager_id, p['expected_revenue'],
                    horas_estimadas,
                    x_prev_final, 
                    x_fecha_hito_1, x_fecha_hito_2, x_fecha_hito_3,
                    x_fecha_hito_4, x_fecha_hito_5, x_fecha_hito_6,
                    p['x_importe_hito_1'], p['x_importe_hito_2'], p['x_importe_hito_3'],
                    p['x_importe_hito_4'], p['x_importe_hito_5'], p['x_importe_hito_6'],
                    p['id'])
            else:
                data = (p['display_name'],date_dead_line,
                    p['partner_id'][0], pwoner_id, amanager_id, p['expected_revenue'],
                    horas_estimadas,
                    p['id'])
            proyectos.actualizar_proyecto_completo(data, MODE_ODOO_CUSTOM)

def get_mensaje_email(p):
    url_seleccionar_plantilla = URL_APP_PROYECTOS + "/proyectos/plantilla/"+str(p['id'])
    mensaje = """Hola <br/> 
                Se ha generado un nuevo proyecto ganado. <br/>
                <b>%s</b>
                Para editar el proyecto, ingrese al siguiente enlace: <br/>
                %s
                Gracias.
                """  % (p['display_name'], url_seleccionar_plantilla)
    return mensaje

def get_asunto_email(p):
    asunto = "Nuevo Proyecto Ganado - %s " % p['display_name']
    return asunto



if __name__ == '__main__':
    # import sys
    # import os
    # print("dirnamex:",os.getcwd())
    # sys.path.insert(0,"D:\pry\gestion-proyectos\proyectos-backend\data")
    # print(sys.path)
    get_data_from_odoo()
