import psycopg2
from .conexion import create_connection

#==========Listar tareas de un proyecto====================
def tareas_por_proyecto(data):
    conn = create_connection()
    # print(data)
    sql = """
            SELECT id, persona, fecha_ini, fecha_fin, tiempo_estimado, plantilla_id
            FROM public."tarea"
            WHERE proyecto = %s
        """
    try:
        cur = conn.cursor()
        cur.execute(sql, data)
        columns = ('id', 'persona', 'fecha_ini', 'fecha_fin','tiempo_estimado', 'plantilla_id')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results

    except(Exception, psycopg2.Error) as error:
        print("error al obtener las tareas", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========insertar una tarea====================
def insertar_tarea(data):
    # print("data:", data)
    conn = create_connection()
    sql = """
            INSERT INTO public."tarea"(proyecto,persona,fecha_ini,fecha_fin,tiempo_estimado,plantilla_id)
	        VALUES(%s, %s, %s, %s, %s, %s)  RETURNING id;
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return cur.fetchone()[0]

    except(Exception, psycopg2.Error) as error:
        print("error al insertar la tarea", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========obtener id de una tarea====================
def obtener_id_tarea(id):
    conn = create_connection()
    sql = """
            SELECT id, persona, fecha_ini, fecha_fin, tiempo_estimado, plantilla_id
            FROM public."tarea"
            WHERE plantilla_id = %(pid)s
        """
    try:
        cur = conn.cursor()
        cur.execute(sql, {"pid": id})
        row = cur.fetchone()
        id = 0
        if row is not None:
            id = row[0]
        return id

    except(Exception, psycopg2.Error) as error:
        print("error al obtener id de la tarea", error)
        return 0
    finally:
        if conn:
            cur.close()
            conn.close()

#==========actualizar una tarea====================
def actualizar_tarea(data):
    print("data:", data)
    conn = create_connection()
    sql = """
            UPDATE public."tarea" 
            SET proyecto = (%s), persona = (%s), fecha_ini = (%s), fecha_fin = (%s), tiempo_estimado = (%s)
            WHERE plantilla_id = (%s)
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return True
    except(Exception, psycopg2.Error) as error:
        print("error al actualizar la tarea", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()
