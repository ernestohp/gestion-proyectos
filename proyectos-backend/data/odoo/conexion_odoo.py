import xmlrpc.client
# import params_odoo
from data.odoo import params_odoo

url      = params_odoo.URL
db       = params_odoo.DB
username = params_odoo.USERNAME
password = params_odoo.PASSWORD

def create_connection():
    uid = None
    models = None
    try:
        common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
        # print(common.version())

        uid = common.authenticate(db, username, password, {})
        # print("uid",uid)

        models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))
        # print("models",models)
    except:
        print("Error al conectarse a Odoo")

    return models, db, uid, password


# url = "https://ern666.odoo.com"
# db = "ern666"
# username = 'ernestohp@hotmail.com'
# # password = "cc110930b9a60d43d3799e88823114d47ff871e3"
# password = "anirak77"


# common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(url))
# print(common.version())

# uid = common.authenticate(db, username, password, {})
# print("uid",uid)

# models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(url))
# print("models",models)

# qq = models.execute_kw(db, uid, password,
#                     'res.partner', 'check_access_rights',
#                     ['read'], {'raise_exception': False})
# print(qq)

# rs = models.execute_kw(db, uid, password,
#                 'res.partner', 'search',
#                 [[['is_company', '=', True]]])

# # print(rs)

# rs = models.execute_kw(db, uid, password,
#                 'sale.order', 'search_read',
#                 [[['state', '=', 'sent']]],
#                 {'fields':['name', 'date_order', 'note']}
#                 )
# print("ordenes", rs)

# rs = models.execute_kw(db, uid, password,
#                 'hr.employee', 'search_read',
#                 [[['work_email', '=', 'ernest.reed47@example.com']]],
#                 {'fields':['name', 'company_id', 'department_id']}
#                 )
# print("empleados",rs)
