# import conexion_odoo
from data.odoo import conexion_odoo


def get_ausencias_all():
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                    'hr.leave', 'search_read',
                    [[ ['state', '=', 'validate']]],      #validate,confirm
                    # [['&',['state', '=', 'validate'], ['employee_id', '=', emp_id]]],
                    # [],
                    {'fields':['name',
                               'request_date_from', 
                               'request_date_to', 
                               'date_from','date_to',                                 
                               'employee_id',
                               'holiday_status_id', 'number_of_days', 	
                                'number_of_hours_display'
                                ,'request_hour_from', 'request_hour_to', 'request_unit_hours'],
                    'order':'id asc'})
    return rs

def get_ausencias(emp_id):
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                    'hr.leave', 'search_read',
                    # [[ ['state', '=', 'validate']]],      #validate,confirm
                    [['&',['state', '=', 'validate'], ['employee_id', '=', emp_id]]],
                    # [],
                    {'fields':['name',
                               'request_date_from', 
                               'request_date_to', 
                            #    'date_from','date_to',  
                               'number_of_days', 
                               'employee_id',
                               'holiday_status_id', "state"],
                    'order':'id asc'})
    return rs

def get_leave_types():
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                    'hr.leave.type', 'search_read',
                    [],
                    {'fields':['name',
                               'id']})
    return rs

def get_employees():
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                'hr.employee', 'search_read',
                [],
                {
                    # 'fields':['name', 'company_id', 'department_id', 'work_email'],
                    'fields':['name','work_email'],
                    'order':'id asc'
                })
    return rs

def get_users():
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                'res.users', 'search_read',
                [],
                {
                    'fields':['name','work_email'],
                    'order':'id asc'
                })
    return rs

if __name__ == '__main__':
    # pps = get_ausencias(3)
    # print("cantidad:", len(pps))
    # print(pps)

    # for p in pps:
    #     print(p)

    # tt = get_leave_types()
    # for p in tt:
    #     print(p)

    # pps = get_employees()
    # for p in pps:
    #     print(p)
    # pps = get_users()
    # for p in pps:
    #     print(p)


    pps = get_ausencias_all()
    print("cantidad:", len(pps))
    for p in pps:
        print(p, p['date_from'][11:13], p['date_to'][11:13])
