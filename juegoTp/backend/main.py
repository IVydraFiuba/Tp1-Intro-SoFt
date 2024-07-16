from flask import Flask , request , jsonify
from flask_cors import CORS
import base64

from configuracion import Desarrollo,Entrega
from modelos import *

app = Flask(__name__)
app.config.from_object(Desarrollo) 
CORS(app)

@app.route('/usuarios',methods=["GET"]) 
def data_usuarios():
    try:
        usuarios = Usuario.query.all()
        usuarios_data=[]
        for usuario in usuarios:
            tienda = db.session.get(Tienda, usuario.tienda_id)
            usuario_data={
                'success':True,
                'Id':usuario.id ,
                'Nombre':usuario.nom_usuario,
                'Nombre_concesionaria':usuario.nom_concesionaria,
                'Plata':usuario.plata,
                'Dia':usuario.dia,
                'Tienda':{'Id':tienda.id,
                            'Nivel':tienda.nivel,
                            'Giros':tienda.giros,
                            'Auto1_venta':tienda.auto1_venta,
                            'Auto2_venta':tienda.auto2_venta,
                            'Auto3_venta':tienda.auto3_venta
                            }
            }
            usuarios_data.append(usuario_data)
        return jsonify(usuarios_data)
    except Exception:
        print(Exception)
        return jsonify({'success':False,"mensaje":"No tenemos usuarios cargados"}),409

@app.route('/usuarios', methods=["POST"])
def nueva_partida():
    try:
        formulario_data =request.json
        Nom_usuario = formulario_data.get("nom_usuario")
        Nom_concesionaria = formulario_data.get("nom_concesionaria")
        Plata = formulario_data.get("plata")
        Dia = formulario_data.get("dia")
        Giros = formulario_data.get("giros")
        Nivel = formulario_data.get("nivel_concesionaria")

        nueva_tienda = Tienda(nivel=Nivel,giros=Giros)
        db.session.add(nueva_tienda)
        db.session.flush()
        nuevo_usuario = Usuario(nom_usuario=Nom_usuario, nom_concesionaria=Nom_concesionaria,tienda_id=nueva_tienda.id,plata = Plata, dia = Dia)
        db.session.add(nuevo_usuario)
        db.session.commit()

        return jsonify({'success':True,'message':'Usuario creado con exito', 'Id_usuario':nuevo_usuario.id}) 
    
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({'success':False,'message':'No se pudo crear el usuario'}),500

@app.route('/usuarios/<id_usuario>',methods=["GET"]) 
def data_usuario(id_usuario):
    try:
        usuario = db.session.get(Usuario,id_usuario)
        usuario_data=[]
        tienda = db.session.get(Tienda, usuario.tienda_id)
        usuario_data={
            'Id':usuario.id ,
            'Nombre':usuario.nom_usuario,
            'Nombre_concesionaria':usuario.nom_concesionaria,
            'Plata':usuario.plata,
            'Dia':usuario.dia,
            'Tienda':{'Id':tienda.id,
                        'Nivel':tienda.nivel,
                        'Giros':tienda.giros,
                        'Auto1_venta':tienda.auto1_venta,
                        'Auto2_venta':tienda.auto2_venta,
                        'Auto3_venta':tienda.auto3_venta
                        }
            }
        return jsonify(usuario_data)
    except Exception as error:
        print(error)
        return jsonify({'success':False,"mensaje":"No tenemos ese usuario cargado"}),409

@app.route('/usuarios/<id_usuario>',methods=["DELETE"])
def eliminar_usuario(id_usuario):
    try:
        usuario = db.session.get(Usuario,id_usuario)
        Garaje.query.filter_by(usuario_id=id_usuario).delete()
        tienda = db.session.get(Tienda,usuario.tienda_id)
        Usuario.query.filter_by(tienda_id=tienda.id).delete()
        db.session.delete(usuario)  
        db.session.commit() 

        return jsonify({'success':True,"message":"Usuario eliminado con exito"})
    except Exception as error:
        print(error)
        return jsonify({'success':False,"message":"No se pudo eliminar el usuario"}),409

@app.route('/usuarios/<id_usuario>', methods=["PUT"])
def editar_usuario(id_usuario):
    try:
        formulario_data =request.json
        Nom_nuevo = formulario_data.get("nom_nuevo")
        Nom_nuevo_concesionaria = formulario_data.get("nom_nuevo_concesionaria")

        usuario = db.session.get(Usuario,id_usuario)
        usuario.nom_usuario = Nom_nuevo
        usuario.nom_concesionaria = Nom_nuevo_concesionaria
        db.session.commit() 
        
        return jsonify({'success':True,'message':'Usuario editado con exito'})
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({'success':False,'message':'No se pudo editar el usuario'}),500

@app.route('/autos/<nivel_tienda>',methods=["GET"]) 
def data_autos(nivel_tienda):
    try:
        autos = Auto.query.filter_by(nivel=nivel_tienda).all()
        autos_data=[]
        for auto in autos:
            imagen_base64 = base64.b64encode(auto.imagen).decode('utf-8') if auto.imagen else None
            auto_data={
                'Id':auto.id ,
                'Nivel':auto.nivel,
                'Marca':auto.marca,
                'Modelo':auto.modelo,
                'Año': auto.año,
                'Precio':auto.precio,
                'Imagen':imagen_base64
            }
            autos_data.append(auto_data)
        return jsonify(autos_data)
    except Exception as error:
        print(error)
        return jsonify({'success':False,"mensaje":"No tenemos autos cargados"}),409

@app.route('/garaje/<id_usuario>',methods=["GET"]) 
def garaje_usuario(id_usuario):
    try:
        usuario = db.session.get(Usuario, id_usuario)
        garaje = db.session.query(Garaje).join(Auto).filter(Garaje.usuario_id == id_usuario).all()    
        garaje_data=[]
        for auto in garaje:
            auto = db.session.get(Auto, auto.auto_id)
            imagen_base64 = base64.b64encode(auto.imagen).decode('utf-8') if auto.imagen else None
            auto_data={
                'Id':auto.id ,
                'Marca':auto.marca,
                'Nivel':auto.nivel,
                'Modelo':auto.modelo,
                'Año': auto.año,
                'Precio':auto.precio,
                'Imagen':imagen_base64
            }
            garaje_data.append(auto_data)

        return jsonify(garaje_data)
    except Exception as error:
        print(error)
        return jsonify({'success':False,"mensaje":"No tenemos autos en el garaje"}),409

@app.route('/garaje/<id_usuario>', methods=["POST"])
def comprar_auto(id_usuario):
    #FALTAN VALIDACIONES
    try:
        data_request =request.json
        id_auto = data_request.get("id_auto")
        auto = db.session.get(Auto, id_auto)
        usuario = db.session.get(Usuario, id_usuario)
        
        nuevo_garaje = Garaje(auto_id= id_auto , usuario_id= id_usuario)
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
        # with open('toyota-corolla.jpg', 'rb') as f:
        #     imagen_data = f.read()
        # nuevo_auto = Auto(marca='Toyota', modelo='Corolla',nivel=2, año=2022, precio=20000, imagen=imagen_data)
        # db.session.add(nuevo_auto)
        # db.session.commit()
    app.run()