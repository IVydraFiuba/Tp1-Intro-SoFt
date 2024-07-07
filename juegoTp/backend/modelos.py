from flask_sqlalchemy import SQLAlchemy

db=SQLAlchemy()

#sirve para que pueda importar usando el * enves de poner todos los nombres
__all__ = ['db','','']