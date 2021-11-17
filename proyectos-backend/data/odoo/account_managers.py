# import conexion_odoo
from data.odoo import conexion_odoo
#Odoo:  CRM -> Configuración -> Team Members

def get_amanagers_all():
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                    # 'crm.team.member', 'search_read',
                    'res.users', 'search_read',
                    [],
                    {'fields':['id','name','email'], 
                     'order':'id asc'
                    })
    return rs


def get_amanagers_ids(ids):
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                    # 'crm.team.member', 'search_read',
                    'res.users', 'search_read',
                    [[['id', 'in', ids]]],
                    {'fields':['id','name','email'], 
                     'order':'id asc'
                    })
    return rs



if __name__ == '__main__':
    # pps = get_amanagers_all()
    # for p in pps:
    #     print(p)

    pps = get_amanagers_ids([2,6])
    for p in pps:
        print(p)
