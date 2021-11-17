import psycopg2
from .conexion import create_connection

#==========Listar Account Manager====================
def lista_amanager():
    conn = create_connection()
    sql = """
            SELECT id, name, email FROM public."account_manager"
        """
    try:
        cur = conn.cursor()
        cur.execute(sql)
        columns = ('id', 'name', 'email')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results

    except(Exception, psycopg2.Error) as error:
        print("error al listar los account managers:", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()


#==========insertar un Account manager=============
def insertar_amanager(data):
    conn = create_connection()
    sql = """
            INSERT INTO public."account_manager"(id, name, email)
	        VALUES(%s, %s, %s)  RETURNING id;
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return cur.fetchone()[0]

    except(Exception, psycopg2.Error) as error:
        print("error al insertar el account manager", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()
