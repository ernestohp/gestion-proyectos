import psycopg2
from .conexion import create_connection

#==========Listar las proyectos====================
def lista_proyectos():
    conn = create_connection()
    # sql = """
    #         SELECT id, nombre, cliente, descripcion, product_owner, account_manager,
	#         to_char(fecha_entrega,'DD/MM/YYYY') AS fecha_entrega,
    #         CASE 
    #             WHEN estado=0 THEN 'Borrador' 
    #             WHEN estado=1 THEN 'Planificacion completada' 
    #             ELSE 'Cerrado' 
    #         END AS estado
    #         FROM public."proyecto"
    #     """
                # to_char(pr.fecha_entrega,'DD/MM/YYYY') AS fecha_entrega,

    sql = """
            SELECT pr.id, pr.nombre, pr.descripcion, 
                pr.cliente as cliente_id, cl.nombre as cliente,
                pr.product_owner as product_owner_id, po.nombre as product_owner, 
                pr.account_manager as account_manager_id, am.nombre as account_manager,
                to_char(pr.fecha_entrega,'DD/MM/YYYY') AS fecha_entrega,
                CASE 
                    WHEN pr.estado=0 THEN 'Borrador' 
                    WHEN pr.estado=1 THEN 'Planificación completada' 
                    ELSE 'Cerrado' 
                END AS estado, pr.estado as estado_id
            FROM public.proyecto pr, public.cliente cl, public.product_owner po, public.account_manager am
            WHERE pr.cliente = cl.id AND pr.product_owner=po.id AND pr.account_manager=am.id
        """


    try:
        cur = conn.cursor()
        cur.execute(sql)
        #conn.commit()
        columns = ('id', 'nombre', 'descripcion', 
                    'cliente_id', 'cliente', 
                    'product_owner_id', 'product_owner',
                    'account_manager_id','account_manager',
                    'fecha_entrega', 'estado', 'estado_id')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results

    except(Exception, psycopg2.Error) as error:
        print("error al obtener los proyectos", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

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

    except:
        print("error al obtener los clientes")
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========Listar las personas====================
def lista_personas():
    conn = create_connection()
    sql = """
            SELECT id, nombre FROM public."persona"
        """
    try:
        cur = conn.cursor()
        cur.execute(sql)
        columns = ('id', 'nombre')
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

    except:
        print("error al obtener los product owners")
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========Listar Account Manager====================
def lista_amanager():
    conn = create_connection()
    sql = """
            SELECT id, nombre FROM public."account_manager"
        """
    try:
        cur = conn.cursor()
        cur.execute(sql)
        columns = ('id', 'nombre')
        results = []
        for row in cur.fetchall():
            results.append(dict(zip(columns, row)))
        return results

    except:
        print("error al obtener los account manager")
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========actualizar descripcion del proyecto====================
def actualizar_descripcion_proyecto(data):
    print("data:", data)
    conn = create_connection()
    sql = """
            UPDATE public."proyecto" 
            SET descripcion = (%s)
            WHERE id = (%s)
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return True
    except(Exception, psycopg2.Error) as error:
        print("error al actualizar el proyecto", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()
