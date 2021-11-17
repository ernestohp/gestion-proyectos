from flask import Flask
from flask_cors import CORS

from endpoints.recursos import rec_bp
from endpoints.proyectos import pro_bp
from endpoints.tareas import tarea_bp
from endpoints.clockify import ckf_bp
from endpoints.openproject import opp_bp
from endpoints.alertas import alertas_bp

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(rec_bp)
app.register_blueprint(pro_bp)
app.register_blueprint(tarea_bp)
app.register_blueprint(ckf_bp)
app.register_blueprint(opp_bp)
app.register_blueprint(alertas_bp)


#---Activar cuando se esté en desarrollo
if __name__ == "__main__":
    app.run(debug=True)
    # app.run(host='127.0.0.1', port=3000)