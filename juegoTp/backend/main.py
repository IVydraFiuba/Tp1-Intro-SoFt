from flask import Flask , request , jsonify
from flask_cors import CORS

from configuracion import Desarrollo,Entrega
from modelos import *

import base64

app = Flask(__name__)
app.config.from_object(Desarrollo) 
CORS(app)

@app.route('/usuarios',methods=["GET"]) 
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

@app.route('/usuarios/<id_usuario>',methods=["GET"]) #Por defauld es GET pero no esta mal ponerlo
def data_usuario(id_usuario):
    try:
        usuario = Usuario.query.get(id_usuario)
        usuario_data=[]
        concesionaria = Concesionaria.query.get(usuario.concesionaria_id)
        usuario_data={
            'Id':usuario.id ,
            'Nombre':usuario.nom_usuario,
            'Concesionaria':{'Id': concesionaria.id,
                            'Nombre': concesionaria.nom_concesionaria
                            },
            'Plata': usuario.plata
            }
        return jsonify(usuario_data)
    except:
        return jsonify({'success':False,"mensaje":"No tenemos ese usuario cargado"}),409

@app.route('/autos',methods=["GET"]) 
def data_autos():
    try:
        autos = Auto.query.all()
        autos_data=[]
        for auto in autos:
            imagen_base64 = base64.b64encode(auto.imagen).decode('utf-8') if auto.imagen else None
            auto_data={
                'Id':auto.id ,
                'Marca':auto.marca,
                'Modelo':auto.modelo,
                'Año': auto.año,
                'Precio':auto.precio,
                'Imagen':imagen_base64
            }
            autos_data.append(auto_data)
        return jsonify(autos_data)
    except:
        return jsonify({'success':False,"mensaje":"No tenemos autos cargados"}),409

@app.route('/garaje/<id_usuario>',methods=["GET"]) 
def garaje_usuario(id_usuario):
    try:
        #el metodo de query().get() ESTA OBSOLETO Y DEBE REMPLAZARSE 
        usuario = db.session.get(Usuario, id_usuario)
        garaje = db.session.query(Garaje).join(Concesionaria).filter(Concesionaria.id == usuario.concesionaria_id).all()
        print(garaje)        
        garaje_data=[]
        for auto in garaje:
            auto = db.session.get(Auto, auto.auto_id)
            imagen_base64 = base64.b64encode(auto.imagen).decode('utf-8') if auto.imagen else None
            auto_data={
                'Id':auto.id ,
                'Marca':auto.marca,
                'Modelo':auto.modelo,
                'Año': auto.año,
                'Precio':auto.precio,
                'Imagen':imagen_base64
            }
            garaje_data.append(auto_data)

        return jsonify(garaje_data)
    except:
        return jsonify({'success':False,"mensaje":"No tenemos autos en el garaje"}),409

@app.route('/comprar_auto', methods=["POST"])
def comprar_auto():
    #FALTAN VALIDACIONES
    try:
        data_request =request.json
        id_auto = data_request.get("id_auto")
        auto = Auto.query.get(id_auto)
        id_usuario = data_request.get("id_usuario")
        usuario = Usuario.query.get(id_usuario)

        nuevo_garaje = Garaje(auto_id= id_auto , concesionaria_id= usuario.concesionaria_id)
        db.session.add(nuevo_garaje)

        usuario.plata -= auto.precio
        db.session.commit()

        return jsonify({'success':True,'message':'Compra realizada con exito'})
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({'success':False,'message':'No se pudo comprar el auto'}),500


if __name__ == '__main__':
    db.init_app(app)
    with app.app_context():
        db.create_all()
        #TENGO QUE SACAR ESTO LUEGO DE AGREGAR LOS AUTOS
        # with open('toyota-corolla.jpg', 'rb') as f:
        #     imagen_data = f.read()
        # nuevo_auto = Auto(marca='Toyota', modelo='Corolla', año=2023, precio=25000, imagen=imagen_data)
        # db.session.add(nuevo_auto)
        db.session.commit()
    app.run()