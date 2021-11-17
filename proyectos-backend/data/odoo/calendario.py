# import conexion_odoo
# import params_odoo
from data.odoo import conexion_odoo
from data.odoo import params_odoo


def get_events_all():
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                    'calendar.event', 'search_read',
                    # [[ ['name', 'in', params_odoo.ETIQUETAS_AUSENCIAS]]], 
                    [],
                    {'fields':['id',
                               'name',
                               'start_date','start',
                               'stop_date', 'stop',
                               'allday'],
                    'order':'id asc'})
    return rs

#Obtener solo los eventos festivos allday
def get_events_holiday():
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                    'calendar.event', 'search_read',
                    [['&',['name', 'in', params_odoo.ETIQUETAS_AUSENCIAS], ['allday', '=', True]]],
                    # [],
                    {'fields':['id',
                               'name',
                               'start_date','start',
                               'stop_date', 'stop',
                               'allday'],
                    'order':'id asc'})
    return rs

def get_general_holiday():
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                    'resource.calendar.leaves', 'search_read',
                    [[ ['resource_id', '=', False]]], 
                    # [],
                    {'fields':['id',
                               'name',
                               'date_from','date_to',
                               'resource_id'],
                    'order':'id asc'})
    return rs



if __name__ == '__main__':
    pps = get_general_holiday()
    print("cantidad:", len(pps))
    for p in pps:
        print(p)
