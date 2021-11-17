import psycopg2
from .conexion import create_connection

#==========Listar las clientes====================
def lista_clientes():
    conn = create_connection()
    sql = """
            SELECT id, nombre FROM public."cliente"
        """
    try:
        cur = conn.cursor()
        cur.execute(sql)
        columns = ('id', 'nombre')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results

    except(Exception, psycopg2.Error) as error:
        print("error al listar los clientes:", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========insertar un cliente====================
def insertar_cliente(data):
    conn = create_connection()
    sql = """
            INSERT INTO public."cliente"(id,nombre)
	        VALUES(%s, %s)  RETURNING id;
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return cur.fetchone()[0]

    except(Exception, psycopg2.Error) as error:
        print("error al insertar el cliente", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()
