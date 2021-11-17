from datetime import datetime, timedelta

#---2021-09-20T15:19:09Z------
#---Formato 28/09/2021 15:36:05----
def format_date(str):
    year = int(str[0:4])
    month = int(str[5:7])
    day = int(str[8:10])
    hour = int(str[11:13])
    minute = int(str[14:16])
    second = int(str[17:19])
    fecha = datetime(year, month, day, hour, minute, second)
    return fecha.strftime("%d/%m/%Y %H:%M:%S")

#---Formato 28/09/2021----
def format_date2(str):
    year = int(str[0:4])
    month = int(str[5:7])
    day = int(str[8:10])
    hour = int(str[11:13])
    minute = int(str[14:16])
    second = int(str[17:19])
    fecha = datetime(year, month, day, hour, minute, second)
    return fecha.strftime("%d/%m/%Y")

#---Formato 15:36:05----
def format_date3(str):
    year = int(str[0:4])
    month = int(str[5:7])
    day = int(str[8:10])
    hour = int(str[11:13])
    minute = int(str[14:16])
    second = int(str[17:19])
    fecha = datetime(year, month, day, hour, minute, second)
    return fecha.strftime("%H:%M:%S")


#--PT3M51S---P1DT3H
def format_time(str):
    i_p = str.find('P')
    i_t = str.find('T')
    i_d = str.find('D')
    i_h = str.find('H')
    i_m = str.find('M')
    i_s = str.find('S')
    days  = None
    hours = None
    mins  = None
    secs  = None

    if (i_d != -1): days  = str[i_p+1:i_d]
    if (i_h != -1): hours = str[i_t+1:i_h]
    if (i_m != -1): 
        if (i_h != -1) : mins  = str[i_h+1:i_m]
        else: mins  = str[i_t+1:i_m]
    if (i_s != -1): 
        if (i_m != -1):
            secs  = str[i_m+1:i_s]
        else:
            if (i_h != -1) : secs  = str[i_h+1:i_s]
            else: secs  = str[i_t+1:i_s]

    strFinal = ""
    if days:  strFinal = strFinal + days  + "D "
    if hours: strFinal = strFinal + hours + "H "
    if mins:  strFinal = strFinal + mins + "MIN "
    if secs:  strFinal = strFinal + secs + "S"
    # print("tiempo duracion", str)
    # print("tiempo duracion", strFinal)
    return strFinal


def get_time_dict(str):
    i_p = str.find('P')
    i_t = str.find('T')
    i_d = str.find('D')
    i_h = str.find('H')
    i_m = str.find('M')
    i_s = str.find('S')
    days  = None
    hours = None
    mins  = None
    secs  = None

    if (i_d != -1): days  = str[i_p+1:i_d]
    if (i_h != -1): hours = str[i_t+1:i_h]
    if (i_m != -1): 
        if (i_h != -1) : mins  = str[i_h+1:i_m]
        else: mins  = str[i_t+1:i_m]
    if (i_s != -1): 
        if (i_m != -1):
            secs  = str[i_m+1:i_s]
        else:
            if (i_h != -1) : secs  = str[i_h+1:i_s]
            else: secs  = str[i_t+1:i_s]

    time_dict = {"days":0, "hours":0, "mins":0, "secs":0}
    if days is not None:  time_dict['days']  = int(days)
    if hours is not None: time_dict['hours'] = int(hours)
    if mins is not None:  time_dict['mins']  = int(mins)
    if secs is not None:  time_dict['secs']  = int(secs)
    return time_dict


def sum_time_dict(dict1, dict2):
    time_dict = {}
    time_dict['secs']  = dict1['secs']  + dict2['secs']    
    time_dict['mins']  = dict1['mins']  + dict2['mins']
    if (time_dict['secs'] > 59):
        time_dict['secs'] -= 60
        time_dict['mins'] += 1
    time_dict['hours'] = dict1['hours'] + dict2['hours']
    if (time_dict['mins'] > 59):
        time_dict['mins'] -= 60
        time_dict['hours'] += 1

    time_dict['days']  = dict1['days']  + dict2['days']
    
    return time_dict

#---time1 > time2 : 1
#---time1 < time2 : -1
#---time1 = time2 : 0
def compare_time(time1, time2):
    if time1['days'] > time2['days']:
        return 1
    elif time1['days'] < time2['days']:
        return -1
    else:
        if time1['hours'] > time2['hours']:
            return 1
        elif time1['hours'] < time2['hours']:
            return -1
        else:
            if time1['mins'] > time2['mins']:
                return 1
            elif time1['mins'] < time2['mins']:
                return -1
            else:
                if time1['secs'] > time2['secs']:
                    return 1
                elif time1['secs'] < time2['secs']:
                    return -1
                else:
                    return 0


def format_time2(time1):
    time_str = ""
    if(time1['days']>0):
        time_str += str(time1['days']) + "D "
    if(time1['hours']>0):
        time_str += str(time1['hours']) + "H "
    if(time1['mins']>0):
        time_str += str(time1['mins']) + "M "
    if(time1['secs']>0):
        time_str += str(time1['secs']) + "S "
    return time_str

#---Obtener fecha exacta------
#['ultimo_dia'],['inicio_sem'], ['ultima_sem'], ['inicio_mes'], ['ultimo_mes']
def obtener_fecha_inicio(ventana):
    hoy = datetime.now()
    new_date = hoy
    if (ventana == 'ultimo_dia'):
        # new_date = hoy - timedelta(days = 1)
        new_date = datetime(hoy.year, hoy.month, hoy.day)
    elif (ventana == 'inicio_sem'):
        day_of_week = hoy.weekday()
        inicio_semana = hoy - timedelta(days = day_of_week)
        new_date = datetime(inicio_semana.year, inicio_semana.month, inicio_semana.day)
    elif (ventana == 'ultima_sem'):
        new_date = hoy - timedelta(days = 7)
    elif (ventana == 'inicio_mes'):
        new_date = datetime(hoy.year, hoy.month, 1)
    else:# (ventana == 'ultimo_mes')
        new_date = hoy - timedelta(days = 30)

    print("fecha desde el cual analizar", new_date)
    return new_date





if __name__ == '__main__':
    print(format_time2({'secs': 26, 'mins': 27, 'hours': 25, 'days': 0}))
