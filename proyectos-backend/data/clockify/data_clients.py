import requests
from data.clockify import params_ckfy
# import params_ckfy

BASE_URL     = params_ckfy.CLOCKIFY_BASE_URL
WORKSPACE_ID = params_ckfy.CLOCKIFY_WORKSPACE_ID
HEADERS      = params_ckfy.CLOCKIFY_HEADERS

#========CLIENTE========================
#--------Crear cliente----------
def create_client(client_name):
    res = requests.post("%s/workspaces/%s/clients" % 
                        (BASE_URL, WORKSPACE_ID), 
                        headers=HEADERS,
                        json={"name": client_name})
    if(res.status_code==201):
        id_client = res.json()['id']
        print("Clockify, Se creó el cliente %s" % client_name)
        return id_client
    else:
        res2 = res.json()
        print("Clockify, error al crear el cliente.\nError: %s, %s " % (res2['code'],res2['message']))
        return ""

#--------Obtener cliente id-------
def get_client_id(client_name):
    id_cliente = ""
    res = requests.get("%s/workspaces/%s/clients" % (BASE_URL, WORKSPACE_ID), 
                        headers=HEADERS, 
                        params={'name': client_name})

    if(res.status_code==200):
        clientes = res.json()
        if len(clientes)>0:
            id_cliente = clientes[0]['id']
        else:
            print("Clockify, no existe el cliente %s" % client_name)
    else:
        print("Clockify, error al consultar el cliente. Error:%s " % res.status_code)
    return id_cliente




if __name__ == '__main__':
    print(get_client_id("ABC"))
    # print(create_client("Madrid Carrefour"))