import conexion_odoo

#Odoo:  CRM -> Ventas -> Clientes

def get_clientes():
    (models, db, uid, password) = conexion_odoo.create_connection()
    rs = models.execute_kw(db, uid, password,
                    'res.partner', 'search_read',
                    [],
                    {'fields':['id','name', 'email', 'country_id'], #phone
                     'order':'id asc'
                    })
    return rs


# pickings = models.execute_kw(db, uid, pwd, 'stock.picking', 'search_read',
#                           [[['state', '=', 'done'], ['date_done', '>', '2019-01-01']]],
#                           {'fields':['name'], 
#                            'offset': 0, 
#                            'limit': 5, 
#                            'order': 'date_done desc'
#                           })

if __name__ == '__main__':
    pps = get_clientes()
    for p in pps:
        print(p)
