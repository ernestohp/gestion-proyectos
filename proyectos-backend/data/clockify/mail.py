import smtplib 
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def enviar_correo(remitente, destinatarios, asunto, mensaje):
    gmail_user = 'anny.ruiz.tello@gmail.com'
    gmail_password = 'anirak77'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = asunto
    msg['From'] = remitente
    msg['To'] = ", ".join(destinatarios)
    part1 = MIMEText(mensaje, 'html')
    msg.attach(part1)

    try: 
        smtp = smtplib.SMTP_SSL('smtp.gmail.com', 465)  #587
        # smtp = smtplib.SMTP('smtp.gmail.com', 587) 
        smtp.ehlo()
        smtp.login(gmail_user, gmail_password)
        smtp.sendmail(remitente, destinatarios, msg.as_string())
        print ("Correo enviado: ", destinatarios )
    except: 
        print ("""Error: el mensaje no pudo enviarse""")

def enviar_correo_con_cc(remitente, to, cc, asunto, mensaje):
    gmail_user = 'anny.ruiz.tello@gmail.com'
    gmail_password = 'anirak77'

    msg = MIMEMultipart('alternative')
    msg['Subject'] = asunto
    msg['From'] = remitente
    msg['To'] = ", ".join(to)
    msg['Cc'] = ", ".join(cc)
    part1 = MIMEText(mensaje, 'html')
    msg.attach(part1)

    try: 
        smtp = smtplib.SMTP_SSL('smtp.gmail.com', 465) 
        smtp.ehlo()
        smtp.login(gmail_user, gmail_password)
        smtp.sendmail(remitente, destinatarios, msg.as_string())
        print ("Correo enviado: ", destinatarios )
    except: 
        print ("""Error: el mensaje no pudo enviarse""")




if __name__ == '__main__':

    remitente = "anny.ruiz.tello@gmail.com" 
    destinatarios = ["ernesto.huari@gmail.com", "anny.ruiz.tello@gmail.com"]
    cc=["anny.ruiz.tello@gmail.com", "ernestohp@hotmail.com"]
    asunto = "Mail 10 enviado desde python" 
    mensaje = """
                Hola!<br/> <br/> 
                Este es un <b>e-mail</b> enviando desde <b>Python</b> <br/><br/>
                <table style="border-collapse: collapse; border: 0.5px solid #DDD; width:100%;">
                    <tr>
                    <th style="text-align: left;padding: 8px;border: 0.5px solid #DDD; 
                    background-color: #1287B4;color: white;">Proyecto</th>
                    <th style="text-align: left;padding: 8px;border: 0.5px solid #DDD; 
                    background-color: #1287B4;color: white;">Fecha</th>
                    <th style="text-align: left;padding: 8px;border: 0.5px solid #DDD; 
                    background-color: #1287B4;color: white;">Duracion</th>
                    </tr>
                    <tr>
                    <td style="text-align: left;padding: 8px;border: 0.5px solid #DDD;">Plataforma XYZ</td>
                    <td style="text-align: left;padding: 8px;border: 0.5px solid #DDD;">2021-10-01</td>
                    <td style="text-align: left;padding: 8px;border: 0.5px solid #DDD;">10 horas</td>
                    </tr>
                    <tr>
                    <td style="text-align: left;padding: 8px;border: 0.5px solid #DDD;">Plataforma XYZ</td>
                    <td style="text-align: left;padding: 8px;border: 0.5px solid #DDD;">2021-10-02</td>
                    <td style="text-align: left;padding: 8px;border: 0.5px solid #DDD;">10 horas 5 minutos</td>
                    </tr>
                </table>
                """

    mensaje2 = """
                Hola! %s <br/> <br/> 
                Este es un <b>e-mail</b> enviando desde <b>Python</b> <br/><br/>
                <table style="border-collapse: collapse; border: 0.5px solid #DDD; width:100%%;">
                    <tr>
                    {0}Proyecto</th>
                    {0}Fecha</th>
                    {0}Duracion</th>
                    </tr>
                    <tr>
                    {1}Plataforma XYZ</td>
                    {1}2021-10-01</td>
                    {1}10 horas</td>
                    </tr>
                    <tr>
                    {1}Plataforma XYZ</td>
                    {1}2021-10-02</td>
                    {1}10 horas 5 minutos</td>
                    </tr>
                </table>
                """ % ("Neto")
    th = """<th style="text-align: left;padding: 8px;border: 0.5px solid #DDD; 
                    background-color: #1287B4;color: white;">"""
    td = """<td style="text-align: left;padding: 8px;border: 0.5px solid #DDD;">"""
    mensaje3 = mensaje2.format(th, td)
    # enviar_correo(remitente, destinatarios, asunto, mensaje3)
    enviar_correo_con_cc(remitente, destinatarios,cc, asunto, mensaje3)