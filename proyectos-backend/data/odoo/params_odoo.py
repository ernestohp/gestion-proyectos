import xmlrpc.client
# URL = "https://ern666.odoo.com"
# DB = "ern666"
# USERNAME = 'ernestohp@hotmail.com'
# PASSWORD = "cc110930b9a60d43d3799e88823114d47ff871e3"

#-----Parametros de Cnexion------
URL = "https://demo3.odoo.com"
DB = "demo_150_1638453020"
USERNAME = "admin"
PASSWORD = "admin"

#---Coste por hora-----
COSTE_HORA = 75

#---Estado ganado----
ESTADO_GANADO = 100
ETIQUETAS_AUSENCIAS = ["Local Holiday", "National Holiday", "Imascono closed"] 
MODE_ODOO_CUSTOM = False

#--cambio 02-12-2021 ehp--
FECHA_MIN = '2021-12-01'
#-----


# info = xmlrpc.client.ServerProxy('https://demo.odoo.com/start').start()
# url2, db2, username2, password2 = info['host'], info['database'], info['user'], info['password']
# print(url2)
# print(db2)
# print(username2)
# print(password2)
