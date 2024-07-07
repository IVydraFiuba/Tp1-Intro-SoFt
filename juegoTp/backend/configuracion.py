class Config:
    DEBUG = True
    TESTING = True
    port = 5000
    #Configuracion de base de datos
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://postgres:password@localhost:5432/tp1-BD'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
class Entrega(Config):
    DEBUG = False
    TESTING = False
class Desarrollo(Config):
    #Que herede todo lo de arriba
    pass