# import params_odoo
from data.odoo import params_odoo

def obtener_valores_unicos(proy_arr, campo):
    valores = []
    for p in proy_arr:
        valor = p[campo]
        if valor not in valores:
            valores.append(valor)
    return valores


#array 1: [[10, 'Deco Addict'], [11, 'Gemini Furniture'], [15, 'Lumber Inc'], ....]
#array 2: [{'id': 1, 'nombre': 'Barcelona ABC'}, {'id': 2, 'nombre': 'Iberdrola'}, ....]
def obtener_diferencial(array1, array2):
    ids_array1 = [a[0] for a in array1]
    ids_array2 = [a['id'] for a in array2]

    ids_nuevos = [i for i in ids_array1 if i not in ids_array2]

    diferencial = []
    for a in array1:
        if a[0] in ids_nuevos:
            diferencial.append(a)
    
    return diferencial

#array 1: [{"id":1, ...}, {"id":2, ...}... ]
#array 2: [{"id":1, ...}, {"id":2, ...}... ]
def obtener_diferencial2(array1, array2):
    ids_array1 = [a['id'] for a in array1]
    ids_array2 = [a['id'] for a in array2]

    ids_nuevos = [i for i in ids_array1 if i not in ids_array2]

    diferencial = []
    for a in array1:
        if a['id'] in ids_nuevos:
            diferencial.append(a)
    
    return diferencial

#array 1: [{"id":1, ...}, {"id":2, ...}... ]
#array 2: [{"id":1, ...}, {"id":2, ...}... ]
def obtener_diferencial_proyectos(array1, array2):
    ids_array1 = [a['id'] for a in array1]
    ids_array2 = [a['id'] for a in array2]

    ids_nuevos = [i for i in ids_array1 if i not in ids_array2]
    
    for a in array2:
        if(a['estado_id'] in [1,100] and a['id'] in ids_array1):
            ids_nuevos.append(a['id'])

    diferencial = []
    for a in array1:
        if a['id'] in ids_nuevos:
            diferencial.append(a)

    

    return diferencial





#array1: [[1, "Juan Perez"], []]  #valores unicos
#salida: [1,2,3...]
def obtener_ids(array1):
    ids = []
    for a in array1:
        ids.append(a[0])
    return ids

#array1: [{"id":1, "name":"Juan Perez"}, {}]  #valores unicos
#salida: [1,2,3...]
def obtener_ids2(array1):
    ids = []
    for a in array1:
        ids.append(a['id'])
    return ids



#array_1: [{'id', 'name', 'work_email', ...}, {}, ...]
#campo: 'name'
#array_2: [[10, 'Deco Addict'], [11, 'Gemini Furniture'], [15, 'Lumber Inc'], ....]
def filtrar_emps_1(array_1, campo, array_2):
    emps = []
    desc = []
    for e in array_2:
        desc.append(e[1])
    for p in array_1:
        if p[campo] in desc:
            emps.append(p)
    return emps

#array_2: ['Deco Addict', 'Gemini Furniture', 'Lumber Inc', ....]
def filtrar_emps_2(array_1, campo, array_2):
    emps = []
    desc = []
    for e in array_2:
        desc.append(e)
    for p in array_1:
        if p[campo] in desc:
            emps.append(p)
    return emps

#array_1: [{'id', 'name', 'work_email', ...}, {}, ...]
def get_id(array_1, name):
    id = 0
    for p in array_1:
        if name == p['name']:
            id = p['id']
            break
    return id


def getHorasEstimadas(p):
    nombres_importe = ['x_importe_hito_1', 'x_importe_hito_2', 'x_importe_hito_3',
                       'x_importe_hito_4', 'x_importe_hito_5', 'x_importe_hito_6' ]
    horas_estimadas = 0
    if ('x_horas_estimadas' in p) and p['x_horas_estimadas'] is not None:
        horas_estimadas = p['x_horas_estimadas']
    else:
        suma = 0
        for n in nombres_importe:
            if (n in p) and p[n] is not None:
                suma += p[n]
        horas_estimadas = suma / params_odoo.COSTE_HORA
        # horas_estimadas = p['expected_revenue'] / params_odoo.COSTE_HORA
    return horas_estimadas

def get_emails_usuarios_pm_am(usuarios, powner_id):
    emails_to = []
    emails_cc = []
    for u in usuarios:
        if u['id'] == powner_id:
            emails_to.append(u['email'])
       
        if (u['account_manager']==1 or u['project_owner']==1) and u['id'] != powner_id:
            emails_cc.append(u['email'])

    return (emails_to, emails_cc)
# def ordenar_valores(arreglo):
#     new_arr = []
