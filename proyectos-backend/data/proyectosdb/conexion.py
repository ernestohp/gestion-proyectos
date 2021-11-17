import psycopg2

HOST = "localhost"
DATABASE = "proyectodb"
USER = "postgres"
PASSWORD = "anirak"

def create_connection():
    conn = None
    try:
        conn = psycopg2.connect(
                        host=HOST,
                        database=DATABASE, user=USER,
                        password="anirak")
    except:
        print("Error al conectarse a la BD")

    return conn