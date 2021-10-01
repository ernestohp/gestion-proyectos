import requests
from data.clockify import params_ckfy
# import params_ckfy

BASE_URL     = params_ckfy.CLOCKIFY_BASE_URL
WORKSPACE_ID = params_ckfy.CLOCKIFY_WORKSPACE_ID
HEADERS      = params_ckfy.CLOCKIFY_HEADERS

#========USUARIOS========================
#-------Obtener tareas de proyecto-----
def get_users():
    users = []
    res = requests.get("%s/workspaces/%s/users" % (BASE_URL, WORKSPACE_ID),
                    headers=HEADERS)
    if(res.status_code==200):
        users = res.json()
        if len(users)==0:
            print("Clockify, no existen usuarios en el workspace %s" % WORKSPACE_ID)
    else:
        print("Clockify, error al consultar los usuarios. Error:%s " % res.status_code)
    return users

#---Obtener usuario by Id----
def get_user_by_id(user_id):
    usuario = {}
    usuarios = get_users()
    for u in usuarios:
        if u['id'] == user_id:
            usuario = u
            break
    return usuario

#---Obtener usuario by Email----
def get_user_by_email(email):
    user_found = {}
    res = requests.get("%s/workspaces/%s/users" % (BASE_URL, WORKSPACE_ID), 
                        headers=HEADERS, 
                        params={'email': email})
    if(res.status_code==200):
        usuarios = res.json()
        if len(usuarios)>0:
            user_found = usuarios[0]
        else:
            print("Clockify, no existe el usuario con correo %s" % email)
    else:
        print("Clockify, error al consultar el usuario. Error:%s " % res.status_code)
    return user_found



if __name__ == '__main__':
    # print(get_users())
    print(get_user_by_email("ernesto"))

