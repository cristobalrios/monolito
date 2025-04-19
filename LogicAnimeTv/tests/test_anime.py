import unittest
import mongomock
from mongoengine import connect, disconnect

# Importa tus modelos
from flaskr.models.user_model import User
from flaskr.models.anime_model import Anime, Aired

class TestAnimeModel(unittest.TestCase):
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
        Anime.drop_collection()
        User.drop_collection()

    def test_save_anime(self):
        # 1. Crear y guardar un usuario de prueba
        user = User(email="test_user@example.com", password="test_password")
        user.save()

        # 2. Crear un subdocumento Aired
        aired = Aired(
            from_date="2023-09-29T00:00:00+00:00",
            to_date="2024-03-22T00:00:00+00:00",
            string_date="Sep 29, 2023 to Mar 22, 2024"
        )

        # 3. Crear y guardar un anime asociado al usuario
        anime = Anime(
            mal_id=123,
            title="Test Anime",
            synopsis="This is a test anime.",
            genres=["Action", "Adventure"],
            episodes=12,
            type="TV",
            image_url="http://example.com/image.jpg",
            aired=aired,
            rating="PG-13",
            score=8.5,
            rank=1,
            status="Finished",
            airing=False,
            trailer_url="http://example.com/trailer.mp4",
            user=user
        )
        anime.save()

        # 4. Recuperar y verificar
        anime_from_db = Anime.objects(mal_id=123, user=user).first()
        self.assertIsNotNone(anime_from_db, "El anime no se guardó en la base de datos mockeada")
        self.assertEqual(anime_from_db.title, "Test Anime")
        self.assertEqual(anime_from_db.user.email, "test_user@example.com")
        self.assertListEqual(anime_from_db.genres, ["Action", "Adventure"])

if __name__ == '__main__':
    unittest.main()
