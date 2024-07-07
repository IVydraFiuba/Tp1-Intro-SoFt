from flask import Flask , request , jsonify
from flask_cors import CORS

from configuracion import Desarrollo,Entrega
from modelos import *

app = Flask(__name__)
app.config.from_object(Desarrollo) 
CORS(app)

@app.route('usuarios',methods=["GET"]) #Por defauld es GET pero no esta mal ponerlo
def data_usuarios():
    try:
        usuarios = Usuario.query.all()
        usuarios_data=[]
        for usuario in usuarios:
            concesionaria = Concesionaria.query.get(usuario.concesionaria_id)
            usuario_data={
                'Id':usuario.id ,
                        'Nombre':usuario.nom_usuario,
                        'Concesionaria':{'Id': concesionaria.id,
                                    'Nombre': concesionaria.nom_concesionaria,
                                    },
                        'Plata': usuario.plata, 
            }
            usuarios_data.append(usuario_data)
        return jsonify(usuarios_data)
    except:
        return jsonify({'success':False,"mensaje":"No tenemos usuarios cargados"}),409


if __name__ == '__main__':
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run()