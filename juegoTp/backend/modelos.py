from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()

class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom_usuario = db.Column(db.String(255), nullable=False)
    concesionaria_id = db.Column(db.Integer, db.ForeignKey('concesionarias.id'), nullable=False)
    plata = db.Column(db.Integer, nullable=False , default=5000)

class Concesionaria(db.Model):
    __tablename__ = 'concesionarias'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nom_concesionaria = db.Column(db.String(255), nullable=False)

class Garaje(db.Model):
    __tablename__='garajes'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    concesionaria_id = db.Column(db.Integer, db.ForeignKey('concesionarias.id'), nullable=False)
    auto_id = db.Column(db.Integer, db.ForeignKey('autos.id'), nullable=False)
class Auto(db.Model):
    __tablename__ = "autos"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    marca = db.Column(db.String(255), nullable=False)
    modelo = db.Column(db.String(255), nullable=False)
    año = db.Column(db.Integer, nullable=False)
    precio = db.Column(db.Integer, nullable=False )
    imagen = db.Column(db.LargeBinary, nullable=False)


#sirve para que pueda importar usando el * enves de poner todos los nombres
__all__ = ['db','Usuario','Concesionaria','Garaje','Auto']