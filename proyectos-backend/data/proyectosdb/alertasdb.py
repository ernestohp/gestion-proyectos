import psycopg2
from .conexion import create_connection

#==========Obtener Usuarios para alertas====================
def lista_usuarios():
    conn = create_connection()
    sql = """
            SELECT email, name, id, horas_min, horas_max, alerta1, alerta2, alerta3
            FROM public."usuario_alerta"
        """
    try:
        cur = conn.cursor()
        cur.execute(sql)
        columns = ('email', 'name', 'id', 'horas_min', 'horas_max', 'alerta1', 'alerta2', 'alerta3')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results

    except:
        print("error al obtener los usuarios")
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========insertar un usuario====================
def insertar_usuario(data):
    print("data:", data)
    conn = create_connection()
    sql = """
            INSERT INTO 
            public."usuario_alerta"(email, horas_min, horas_max, id, name, alerta1, alerta2, alerta3)
	        VALUES(%s, %s, %s, %s, %s, %s, %s, %s);
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return 1

    except(Exception, psycopg2.Error) as error:
        print("error al insertar el usuario", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()



#==========Obtener Usuarios supervisores====================
def lista_usuarios_sup():
    conn = create_connection()
    sql = """
            SELECT name, email, id
            FROM public."usuario_alerta_sup"
        """
    try:
        cur = conn.cursor()
        cur.execute(sql)
        columns = ('name', 'email', 'id')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results
    except:
        print("error al obtener los usuarios sup")
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========insertar un usuario sup====================
def insertar_usuario_sup(data):
    print("data:", data)
    conn = create_connection()
    sql = """
            INSERT INTO 
            public."usuario_alerta_sup"(name, email, id)
	        VALUES(%s, %s, %s);
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return 1

    except(Exception, psycopg2.Error) as error:
        print("error al insertar el usuario sup", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()



#==========Obtener Parametros====================
def lista_param():
    conn = create_connection()
    sql = """
            SELECT name, value1, value2
            FROM public."usuario_alerta_param"
        """
    try:
        cur = conn.cursor()
        cur.execute(sql)
        columns = ('name', 'value1', 'value2')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results
    except:
        print("error al obtener los parametros")
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========insertar un parametro====================
def insertar_param(data):
    print("data:", data)
    conn = create_connection()
    sql = """
            INSERT INTO 
            public."usuario_alerta_param"(name, value)
	        VALUES(%s, %s);
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return 1

    except(Exception, psycopg2.Error) as error:
        print("error al insertar el prametro", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========actualizar un parametro====================
def actualizar_parametro(data):
    print("data:", data)
    conn = create_connection()
    sql = """
            UPDATE public."usuario_alerta_param" 
            SET value1 = (%s), value2 = (%s)
            WHERE name = (%s)
        """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return True
    except(Exception, psycopg2.Error) as error:
        print("error al actualizar el parametro", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()





