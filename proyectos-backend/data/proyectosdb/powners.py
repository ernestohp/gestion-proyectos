import psycopg2
from .conexion import create_connection

#==========Listar PRODUCT OWNER====================
def lista_powners():
    conn = create_connection()
    sql = """
            SELECT id, nombre FROM public."product_owner"
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


#==========insertar un product owners==============
def insertar_powner(data):
    conn = create_connection()
    sql = """
            INSERT INTO public."product_owner"(id,nombre)
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
