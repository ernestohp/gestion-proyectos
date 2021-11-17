import requests
from data.clockify import params_ckfy
# import params_ckfy

BASE_URL     = params_ckfy.CLOCKIFY_BASE_URL
WORKSPACE_ID = params_ckfy.CLOCKIFY_WORKSPACE_ID
HEADERS      = params_ckfy.CLOCKIFY_HEADERS

#========TIME ENTRIES========================
#---Obtener time entries 
#---para un usuario desde una fecha
def get_time_entries(user_id, start_date):
    # print(start_date)
    time_entries = []
    res = requests.get("%s/workspaces/%s/user/%s/time-entries" % 
                    (BASE_URL, WORKSPACE_ID, user_id), headers=HEADERS,
                    params={'start': start_date})

    if(res.status_code==200):
        time_entries = res.json()
        if len(time_entries)==0:
            print("Clockify, no existen time entries para el usuario %s" % user_id)
    else:
        print("Clockify, error al consultar time entries. Error:%s " % res.status_code)
    return time_entries




    #6138e28053548466de3a0ab2


if __name__ == '__main__':
    print(get_time_entries("6138e28053548466de3a0ab2",""))