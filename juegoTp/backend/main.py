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
                            'Giros':tienda.giros
                            }
            }
            usuarios_data.append(usuario_data)
        if (len(usuario_data) == 0):
            return jsonify({'success':False,"mensaje":"No tenemos usuarios cargados"}),409
        else:
            return jsonify({'success':True,'usuarios':usuarios_data})
    except Exception as error:
        print(error)
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
                        'Giros':tienda.giros
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
        garajes = Garaje.query.filter_by(usuario_id=id_usuario)
        tienda = db.session.get(Tienda,usuario.tienda_id)

        for garaje in garajes:
            db.session.delete(garaje)
        db.session.commit()  
        db.session.delete(usuario)
        db.session.commit()  
        db.session.delete(tienda)
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
        
        return jsonify({'success':True,'message':'Usuario editado con exito','Id_usuario':id_usuario})
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({'success':False,'message':'No se pudo editar el usuario'}),500

@app.route('/autos/<nivel_tienda>',methods=["GET"]) 
def data_autos(nivel_tienda):
    try:
        nivel_tienda = int(nivel_tienda)
        autos_data=[]
        if (nivel_tienda == 1):
            niveles = [1,2,3]
        elif(nivel_tienda == 2):
            niveles = [2,3]
        else:
            niveles=[3]
        for nivel in niveles:
            autos = Auto.query.filter_by(nivel=nivel).all()
            for auto in autos: 
                auto_data={
                    'Id':auto.id ,
                    'Nivel':auto.nivel,
                    'Marca':auto.marca,
                    'Modelo':auto.modelo,
                    'Año': auto.año,
                    'Precio':auto.precio,
                    'Imagen':auto.imagen
                }
                autos_data.append(auto_data)
        return jsonify(autos_data)
    except Exception as error:
        print(error)
        return jsonify({'success':False,"mensaje":"No tenemos autos cargados de ese nivel"}),409

@app.route('/tienda/<id_tienda>/giros', methods=["PUT"])
def editar_giros(id_tienda):
    try:
        formulario_data =request.json
        giros_actualizados = formulario_data.get("Giros_actualizados")

        tienda = db.session.get(Tienda,id_tienda)
        tienda.giros = giros_actualizados
        db.session.commit() 
        
        return jsonify({'success':True,'message':'Giros actualizados con exito'})
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({'success':False,'message':'No se pudo actualizar los giros'}),500

@app.route('/tienda/<id_tienda>/nivel', methods=["PUT"])
def editar_nivel(id_tienda):
    try:
        formulario_data =request.json
        nivel_actualizado = formulario_data.get("Nivel_actualizado")
        usuario = Usuario.query.filter_by(tienda_id=id_tienda).first()
        tienda = db.session.get(Tienda,id_tienda)
        if (nivel_actualizado == 2):
            precio = 15000
        else:
            precio = 40000
        usuario.plata -= precio
        tienda.nivel = nivel_actualizado
        db.session.commit() 
        
        return jsonify({'success':True,'message':'Nivel actualizados con exito'})
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({'success':False,'message':'No se pudo actualizar el Nivel'}),500

@app.route('/garaje/<id_usuario>',methods=["GET"]) 
def garaje_usuario(id_usuario):
    try:
        garaje = db.session.query(Garaje).join(Auto).filter(Garaje.usuario_id == id_usuario).all()    
        garaje_data=[]
        for auto_info in garaje:
            auto = db.session.get(Auto, auto_info.auto_id)
            auto_data={
                'Id':auto.id ,
                'Marca':auto.marca,
                'Nivel':auto.nivel,
                'Modelo':auto.modelo,
                'Año': auto.año,
                'Precio':auto.precio,
                'Imagen':auto.imagen,
                'En_venta':auto_info.auto_en_venta,
                'Id_garaje':auto_info.id,
                'Precio_venta':auto_info.precio_de_venta
            }
            garaje_data.append(auto_data)

        return jsonify(garaje_data)
    except Exception as error:
        print(error)
        return jsonify({'success':False,"mensaje":"No tenemos autos en el garaje"}),409

@app.route('/garaje/<id_usuario>', methods=["POST"])
def comprar_auto(id_usuario):
    try:
        data_request =request.json
        id_auto = data_request.get("id_auto")
        indice_boton = data_request.get("indice_boton")
        auto = db.session.get(Auto, id_auto)
        usuario = db.session.get(Usuario, id_usuario)
        
        nuevo_garaje = Garaje(auto_id= id_auto , usuario_id= id_usuario)
        db.session.add(nuevo_garaje)

        usuario.plata -= auto.precio
        db.session.commit()

        return jsonify({'success':True,'message':'Compra realizada con exito','indice_boton':indice_boton,'Plata':usuario.plata,'Precio':auto.precio})
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({'success':False,'message':'No se pudo comprar el auto'}),500

@app.route('/garaje/<id_usuario>', methods=["PUT"])
def poner_en_venta(id_usuario):
    try:
        cambios_data =request.json
        nuevo_precio_venta = cambios_data.get("Nuevo_precio_venta")
        id_garaje = cambios_data.get("Id_garaje")

        garaje = db.session.get(Garaje,id_garaje)
        auto = db.session.get(Auto,garaje.auto_id)
        
        garaje.precio_de_venta = nuevo_precio_venta
        garaje.auto_en_venta = True
        db.session.commit() 
        
        return jsonify({'success':True,'message':'Auto puesto en venta con exito','Id_garaje':id_garaje,'Precio':auto.precio,'Precio_de_venta':nuevo_precio_venta})
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({'success':False,'message':'El auto no se pudo poner en venta'}),500

@app.route('/garaje/<id_garaje>/vender',methods=["POST"])
def vender_auto(id_garaje):
    try:
        data =request.json
        ganancia = data.get("Ganancia")
        garaje = db.session.get(Garaje,id_garaje)
        usuario = db.session.get(Usuario,garaje.usuario_id)
        usuario.plata += ganancia

        db.session.delete(garaje)  
        db.session.commit() 

        return jsonify({'success':True,"message":"Venta realizada con exito",'Plata':usuario.plata,'Id_garaje':id_garaje,'Ganancia':ganancia})
    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'success':False,"message":"No se pudo realizar la venta"}),409

@app.route('/garaje/<id_usuario>/sacar_venta', methods=["PUT"])
def sacar_en_venta(id_usuario):
    try:
        cambios_data =request.json
        id_garaje = cambios_data.get("Id_garaje")

        garaje = db.session.get(Garaje,id_garaje)
        garaje.precio_de_venta = 0
        garaje.auto_en_venta = False
        db.session.commit() 
        
        return jsonify({'success':True,'message':'Auto sacado de la venta con exito','Id_garaje':id_garaje})
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({'success':False,'message':'El auto no se pudo sacar de la venta'}),500

@app.route('/usuarios/<id_usuario>/terminar_dia/<dia>', methods=["PUT"])
def terminar_dia(id_usuario,dia):
    try:
        usuario = db.session.get(Usuario,id_usuario)
        usuario.dia = int(dia) + 1
        tienda = db.session.get(Tienda,usuario.tienda_id)
        tienda.giros += 3
        db.session.commit() 
        
        return jsonify({'success':True,'message':'Dia actualizado con exito'})
    except Exception as error:
        print(error)
        db.session.rollback()
        return jsonify({'success':False,'message':'El dia no se pudo actualizar'}),500

if __name__ == '__main__':
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run()