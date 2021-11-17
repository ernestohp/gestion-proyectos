import psycopg2
from .conexion import create_connection
from datetime import datetime, timedelta

#==========Listar las personas====================
def lista_personas():
    conn = create_connection()
    sql = """
            SELECT id, name, email, account_manager, project_owner  FROM public."persona"
        """
    try:
        cur = conn.cursor()
        cur.execute(sql)
        columns = ('id', 'name', 'email', 'account_manager', 'project_owner')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results

    except:
        print("error al obtener las personas")
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========insertar una persona====================
def insertar_persona(data):
    conn = create_connection()
    sql = """
            INSERT INTO public."persona"(id,name, email)
	        VALUES(%s, %s, %s)  RETURNING id;
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return cur.fetchone()[0]

    except(Exception, psycopg2.Error) as error:
        print("error al insertar la persona", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()


#==========Listar las ausencias====================
def lista_ausencias():
    conn = create_connection()
    sql = """
            SELECT id, name, 
                   to_char(date_from,'DD/MM/YYYY'), 
                   to_char(date_to,'DD/MM/YYYY'), 
                   number_of_days, persona, hour_from, hour_to, request_unit, number_of_hours
            FROM public."ausencia"
        """
    try:
        cur = conn.cursor()
        cur.execute(sql)
        columns = ('id', 'name', 'date_from', 'date_to', 'number_of_days', 
                   'persona', 'hour_from', 'hour_to', 'request_unit', 'number_of_hours')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results

    except(Exception, psycopg2.Error) as error:
        print("error al listar las ausencias:", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========insertar una ausencia====================
def insertar_ausencia(data):
    conn = create_connection()
    sql = """
            INSERT INTO public."ausencia"(id, name, date_from, date_to, 
                                          number_of_days, persona, hour_from, hour_to, 
                                          request_unit, number_of_hours)
	        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)  RETURNING id;
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return cur.fetchone()[0]

    except(Exception, psycopg2.Error) as error:
        print("error al insertar la ausencia", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()


#==========Listar las ausencias para un usuario====================
def lista_ausencias_user(data):
    print(data)
    conn = create_connection()
    sql = """
            SELECT id, name, 
                   to_char(date_from,'DD/MM/YYYY'), 
                   to_char(date_to,'DD/MM/YYYY'), 
                   number_of_days, persona, hour_from, hour_to,request_unit, number_of_hours
            FROM public."ausencia"
            WHERE persona = %s
        """
    try:
        cur = conn.cursor()
        cur.execute(sql, data)
        columns = ('id', 'name', 'date_from', 'date_to', 'number_of_days', 
                   'persona', 'hour_from', 'hour_to', 'request_unit', 'number_of_hours')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results

    except(Exception, psycopg2.Error) as error:
        print("error al listar las ausecias del usuario:", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()


#==========actualizar account_manager====================
def actualizar_account_manager(data):
    # print("data:", data)
    conn = create_connection()
    sql = """
            UPDATE public."persona" 
            SET account_manager = (%s)
            WHERE id = (%s)
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return True
    except(Exception, psycopg2.Error) as error:
        print("error al actualizar la persona, account_manager", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========actualizar project_owner====================
def actualizar_project_owner(data):
    # print("data:", data)
    conn = create_connection()
    sql = """
            UPDATE public."persona" 
            SET project_owner = (%s)
            WHERE id = (%s)
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return True
    except(Exception, psycopg2.Error) as error:
        print("error al actualizar la persona, project_owner", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()



def obtener_array_ausencias(pp):
    array_days_hours = []
    if len(pp) > 0:
        for p in pp:
            array_days_hours = array_days_hours + obtener_array_ausencias_individual(p)
    #---valores unicos
    array_unicos = valores_unicos_array(array_days_hours)
    return array_unicos


def obtener_array_ausencias_individual(p):
    array_days_hours = []
    s = p['date_from']
    if p['request_unit'] == 'hours':
        d_h = {}
        d_h['fecha'] = s
        d_h['horas'] = p['number_of_hours']
        array_days_hours.append(d_h)
    else:
        n_days = p['number_of_days']
        d_from = datetime(int(s[6:]), int(s[3:5]), int(s[0:2]))
        dayN = d_from - timedelta(days=1)
        i = 0
        while i < n_days:
            dayN = dayN + timedelta(days=1)
            if(dayN.weekday() not in [5,6]):
                d_h = {}
                d_s =  str(dayN.day) + "/" + str(dayN.month) + "/" + str(dayN.year)
                d_h['fecha'] = d_s
                d_h['horas'] = 8
                array_days_hours.append(d_h)
                i += 1
    return array_days_hours

#---Valores unicos por fecha
#[{"fecha": "9/12/2021", "horas": 8},....] 
def valores_unicos_array(arreglo):
    arreglo_unicos = []
    for a in arreglo:
        existe = False
        for u in arreglo_unicos:
            if a['fecha'] == u['fecha']:
                existe = True
                if a['horas'] > u['horas']:
                    u['horas'] = u['horas'] + a['horas']
                    if u['horas'] > 8:
                        u['horas'] = 8
        if not existe:
            arreglo_unicos.append(a)
    return arreglo_unicos

