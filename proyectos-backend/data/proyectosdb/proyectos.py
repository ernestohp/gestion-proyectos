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

    # sql = """
    #         SELECT pr.id, pr.nombre, pr.descripcion, 
    #             pr.cliente as cliente_id, cl.nombre as cliente,
    #             pr.product_owner as product_owner_id, po.nombre as product_owner, 
    #             pr.account_manager as account_manager_id, am.nombre as account_manager,
    #             to_char(pr.fecha_entrega,'DD/MM/YYYY') AS fecha_entrega,
    #             CASE 
    #                 WHEN pr.estado=1 THEN 'Borrador' 
    #                 WHEN pr.estado=2 THEN 'Planificación completada' 
    #                 WHEN pr.estado=3 THEN 'Cerrado' 
    #                 ELSE 'Ganado' 
    #             END AS estado, pr.estado as estado_id,
    #             plantilla
    #         FROM public.proyecto pr, public.cliente cl, public.product_owner po, public.account_manager am
    #         WHERE pr.cliente = cl.id AND pr.product_owner=po.id AND pr.account_manager=am.id
    #     """

    sql = """
        SELECT pr.id, pr.nombre, pr.descripcion, 
                pr.cliente as cliente_id, cl.nombre as cliente,
                pr.project_owner as project_owner_id, po.name as project_owner, 
                pr.account_manager as account_manager_id, am.name as account_manager,
                to_char(pr.fecha_entrega,'DD/MM/YYYY') AS fecha_entrega,
                es.nombre estado, pr.estado as estado_id,
                plantilla, precio_venta::numeric::float,
                x_prev_final,
                x_fecha_hito_1, x_fecha_hito_2, x_fecha_hito_3,
                x_fecha_hito_4, x_fecha_hito_5, x_fecha_hito_6,
                x_importe_hito_1, x_importe_hito_2, x_importe_hito_3,
                x_importe_hito_4, x_importe_hito_5, x_importe_hito_6, 
                x_horas_estimadas
            FROM public.proyecto pr 
				 LEFT OUTER JOIN public.cliente cl ON pr.cliente = cl.id
				 LEFT OUTER JOIN public.persona po ON pr.project_owner=po.id 
				 LEFT OUTER JOIN public.persona am ON pr.account_manager=am.id
				 LEFT OUTER JOIN public.proyecto_estado es ON pr.estado = es.id
    """

    try:
        cur = conn.cursor()
        cur.execute(sql)
        columns = ('id', 'nombre', 'descripcion', 
                    'cliente_id', 'cliente', 
                    'project_owner_id', 'project_owner',
                    'account_manager_id','account_manager',
                    'fecha_entrega', 'estado', 'estado_id', 'plantilla', 'precio_venta',
                    'x_prev_final',
                    'x_fecha_hito_1', 'x_fecha_hito_2', 'x_fecha_hito_3',
                    'x_fecha_hito_4', 'x_fecha_hito_5', 'x_fecha_hito_6',
                    'x_importe_hito_1', 'x_importe_hito_2', 'x_importe_hito_3',
                    'x_importe_hito_4', 'x_importe_hito_5', 'x_importe_hito_6', 
                    'x_horas_estimadas'
                    )
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



#==========actualizar descripcion del proyecto====================
def actualizar_proyecto_descripcion(data):
    print("data:", data)
    conn = create_connection()
    sql = """
            UPDATE public."proyecto" 
            SET descripcion = (%s), estado = (%s)
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

#==========actualizar descripcion del proyecto====================
def actualizar_proyecto(data):
    print("data:", data)
    conn = create_connection()
    sql = """
            UPDATE public."proyecto" 
            SET descripcion = (%s), account_manager = (%s), project_owner = (%s)
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


#==========actualizar platilla del proyecto====================
def actualizar_proyecto_plantilla(data):
    print("data:", data)
    conn = create_connection()
    sql = """
            UPDATE public."proyecto" 
            SET plantilla = (%s)
            WHERE id = (%s)
            """
    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return True
    except(Exception, psycopg2.Error) as error:
        print("error al actualizar el proyecto, plantilla", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()


#==========insertar una nuevo proyecto====================
def insertar_proyecto(data, mode_custom_odoo):
    # print("data:", data)
    conn = create_connection()
    sql = ""
    if mode_custom_odoo:
        sql = """
                INSERT INTO public."proyecto"(nombre, fecha_entrega, estado, cliente,
                                            project_owner, account_manager, precio_venta,
                                            x_horas_estimadas, 
                                            x_prev_final, 
                                            x_fecha_hito_1, x_fecha_hito_2, x_fecha_hito_3,
                                            x_fecha_hito_4, x_fecha_hito_5, x_fecha_hito_6,
                                            x_importe_hito_1, x_importe_hito_2, x_importe_hito_3,
                                            x_importe_hito_4, x_importe_hito_5, x_importe_hito_6,
                                            id)
                VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)  
                RETURNING id;
                """
    else:
        sql = """
            INSERT INTO public."proyecto"(nombre, fecha_entrega, estado, cliente,
                                          project_owner, account_manager, precio_venta,
                                          x_horas_estimadas, id)
	        VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)  RETURNING id;
            """


    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return cur.fetchone()[0]

    except(Exception, psycopg2.Error) as error:
        print("error al insertar el proyecto", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

#==========actualizar descripcion del proyecto====================
def actualizar_proyecto_completo(data, mode_custom_odoo):
    print("data:", data)
    conn = create_connection()
    sql = ""
    if mode_custom_odoo:
        sql = """
                UPDATE public."proyecto" 
                SET nombre = (%s), fecha_entrega = (%s), cliente = (%s),
                    project_owner = (%s), account_manager = (%s), precio_venta = (%s),
                    x_horas_estimadas = (%s),
                    x_prev_final = (%s), 
                    x_fecha_hito_1 = (%s), x_fecha_hito_2 = (%s), x_fecha_hito_3 = (%s),
                    x_fecha_hito_4 = (%s), x_fecha_hito_5 = (%s), x_fecha_hito_6 = (%s),
                    x_importe_hito_1 = (%s), x_importe_hito_2 = (%s), x_importe_hito_3 = (%s),
                    x_importe_hito_4 = (%s), x_importe_hito_5 = (%s), x_importe_hito_6 = (%s)
                WHERE id = (%s)
                """
    else:
        sql = """
                UPDATE public."proyecto" 
                SET nombre = (%s), fecha_entrega = (%s), cliente = (%s),
                    project_owner = (%s), account_manager = (%s), precio_venta = (%s),
                    x_horas_estimadas = (%s)
                WHERE id = (%s)
                """

    try:
        cur = conn.cursor()
        cur.execute(sql,data)
        conn.commit()
        return True
    except(Exception, psycopg2.Error) as error:
        print("error al actualizar el proyecto completo", error)
        return False
    finally:
        if conn:
            cur.close()
            conn.close()

