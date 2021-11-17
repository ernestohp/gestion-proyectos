import psycopg2
from .conexion import create_connection

#==========Listar los eventos====================
def lista_eventos():
    conn = create_connection()
    sql = """
            SELECT id, name, to_char(start_date,'DD/MM/YYYY'), stop_date, allday  
            FROM public."calendario"
        """
    try:
        cur = conn.cursor()
        cur.execute(sql)
        columns = ('id', 'name', 'start_date', 'stop_date', 'allday')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results

    except:
        print("error al obtener los eventos")
        return False
    finally:
        if conn:
            cur.close()
            conn.close()


#==========insertar un evento====================
def insertar_evento(data):
    conn = create_connection()
    sql = """
            INSERT INTO public."calendario"(name, start_date, stop_date, allday, id)
	        VALUES(%s, %s, %s, %s, %s)  RETURNING id;
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return cur.fetchone()[0]

    except(Exception, psycopg2.Error) as error:
        print("error al insertar el evento", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()


#==========actualizar evento====================
def actualizar_evento(data):
    print("data:", data)
    conn = create_connection()
    sql = """
            UPDATE public."calendario" 
            SET name = (%s), start_date = (%s), stop_date = (%s), allday = (%s)
            WHERE id = (%s)
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return True
    except(Exception, psycopg2.Error) as error:
        print("error al actualizar el evento", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()


def array_festivos_horas():
    array_festivos = []
    festivos = lista_eventos()
    for f in festivos:
        d_h = {}
        d_h['fecha'] = f['start_date']
        d_h['horas'] = 8
        array_festivos.append(d_h)
    return array_festivos
    
