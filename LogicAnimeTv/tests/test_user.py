import unittest
import mongomock
from mongoengine import connect, disconnect

# Importa tus modelos
from flaskr.models.user_model import User


class TestUserModel(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Conectar a la base de datos mock en memoria
        connect(
            db='testdb',
            host='mongodb://localhost',
            mongo_client_class=mongomock.MongoClient,
            uuidRepresentation='standard'  # Evita la advertencia de PyMongo
        )

    @classmethod
    def tearDownClass(cls):
        # Desconectar de la base de datos mock
        disconnect()

    def setUp(self):
        # Limpiar las colecciones antes de cada test
        User.drop_collection()

    def test_create_user(self):
        # 1. Crear un usuario de prueba
        user = User(email="test@test.cl", password="test_password")
        user.set_password(user.password)
        user.save()

        user_from_db = User.objects(email="test@test.cl").first()

        self.assertIsNotNone(user_from_db)
        self.assertTrue(user_from_db.check_password("test_password"))
        self.assertFalse(user_from_db.check_password("wrong_password"))
   




if __name__ == '__main__':
    unittest.main()
