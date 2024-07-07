from flask import Flask , request , jsonify
from flask_cors import CORS

from configuracion import Desarrollo,Entrega
from modelos import *

app = Flask(__name__)
app.config.from_object(Desarrollo) 
CORS(app)

@app.route('/usuarios',methods=["GET"]) #Por defauld es GET pero no esta mal ponerlo
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
                                    'Nombre': concesionaria.nom_concesionaria
                                    },
                        'Plata': usuario.plata
            }
            usuarios_data.append(usuario_data)
        return jsonify(usuarios_data)
    except:
        return jsonify({'success':False,"mensaje":"No tenemos usuarios cargados"}),409

@app.route('/usuarios', methods=["POST"])
def nueva_partida():
    try:
        formulario_data =request.json
        Nom_usuario = formulario_data.get("nom_usuario")
        Nom_concesionaria = formulario_data.get("nom_concesionaria")
        #Aca si es necesario podria hacer validaciones de los datos que me paso el usuario
        #
        #
        nueva_concesionaria = Concesionaria(nom_concesionaria=Nom_concesionaria)
        db.session.add(nueva_concesionaria)
        db.session.flush()
        nuevo_usuario = Usuario(nom_usuario=Nom_usuario, concesionaria_id=nueva_concesionaria.id)
        db.session.add(nuevo_usuario)
        db.session.commit()

        #Una buena practica es retornar lo que registramos
        return jsonify({
            'success':True,
            'Usuario':{'Id':nuevo_usuario.id ,
                        'Nombre':nuevo_usuario.nom_usuario,
                        'Concesionaria':{'Id': nueva_concesionaria.id,
                                    'Nombre': nueva_concesionaria.nom_concesionaria
                                    },
                        'Plata': nuevo_usuario.plata}
            }) 
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({'success':False,'message':'No se pudo crear el usuario'}),500

if __name__ == '__main__':
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run()