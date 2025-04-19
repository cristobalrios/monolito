from mongoengine import *
from werkzeug.security import generate_password_hash, check_password_hash

class User(Document):
    email = StringField(required=True, unique=True)  # Correo electrónico del usuario
    password = StringField(required=True)  # Contraseña del usuario

    meta = {'collection': 'users'}  # Nombre de la colección en MongoDB

    def set_password(self, password):
        self.password = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
