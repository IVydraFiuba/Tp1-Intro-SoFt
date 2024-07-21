from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom_usuario = db.Column(db.String(255), nullable=False)
    nom_concesionaria = db.Column(db.String(255), nullable=False)
    tienda_id = db.Column(db.Integer, db.ForeignKey('tiendas.id'), nullable=False)
    plata = db.Column(db.Integer, nullable=False , default=10000)
    dia = db.Column(db.Integer, nullable=False , default=1)
class Tienda(db.Model):
    __tablename__ = 'tiendas'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nivel = db.Column(db.Integer, nullable=False , default=3)
    giros = db.Column(db.Integer, nullable=False , default=3)

class Garaje(db.Model):
    __tablename__='garajes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    auto_id = db.Column(db.Integer, db.ForeignKey('autos.id'), nullable=False)
    auto_en_venta = db.Column(db.Boolean, nullable=False, default=False)
    precio_de_venta = db.Column(db.Integer, nullable=False, default=0)
class Auto(db.Model):
    __tablename__ = "autos"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nivel = db.Column(db.Integer, nullable=False )
    marca = db.Column(db.String(255), nullable=False)
    modelo = db.Column(db.String(255), nullable=False)
    año = db.Column(db.Integer, nullable=False)
    precio = db.Column(db.Integer, nullable=False )
    imagen = db.Column(db.String(255), nullable=False)

__all__ = ['db','Usuario','Tienda','Garaje','Auto']