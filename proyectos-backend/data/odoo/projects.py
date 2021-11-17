# import conexion_odoo
from data.odoo import conexion_odoo

def get_projects_won():
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                    'crm.lead', 'search_read',
                    [[['won_status', '=', 'won']]],      #won, pending
                    # [],      #won, pending
                    # {'fields':['display_name', 'partner_name','won_status','active','stage_id',"day_close"]})
                    {'fields':['display_name', 
                                'user_id',          #Account manager     #falta proyect_manager
                                'partner_id',       #Cliente             #precio_hora,cantidad de horas
                                'date_deadline',    #fecha estimada
                                'expected_revenue', #precio venta
                                'contact_name'
                                # ,'x_project_owner', 'x_prev_final', 'x_horas_estimadas'
                                # 'x_fecha_hito_1', 'x_fecha_hito_2', 'x_fecha_hito_3',
                                # 'x_fecha_hito_4', 'x_fecha_hito_5', 'x_fecha_hito_6',
                                # 'x_importe_hito_1', 'x_importe_hito_2', 'x_importe_hito_3',
                                # 'x_importe_hito_4', 'x_importe_hito_5', 'x_importe_hito_6'
                                ]})
    return rs



def pruebas():
    (models, db, uid, password) = conexion_odoo.create_connection()

    rs = models.execute_kw(db, uid, password,
                    'hr.employee', 'search_read',
                    [[['work_email', '=', 'ernest.reed47@example.com']]],
                    {'fields':['name', 'company_id', 'department_id']}
                    )
    print("un empleado",rs)

    rs = models.execute_kw(db, uid, password,
                    'hr.employee', 'search_read',
                    [[['active', '=', True]]],
                    {'fields':['name', 'company_id', 'department_id']}
                    )
    print(len(rs))
    for e in rs:
        print("empleado",e)



if __name__ == '__main__':
    pps = get_projects_won()
    for p in pps:
        print(p)

