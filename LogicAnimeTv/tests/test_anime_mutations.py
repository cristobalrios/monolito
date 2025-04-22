import unittest
from unittest.mock import *
from flaskr.schemas.anime.mutations import *

class TestSaveAnimeMutation(unittest.TestCase):

    @patch("flaskr.schemas.anime.mutations.verify_token")
    @patch("flaskr.schemas.anime.mutations.buscar_anime_por_id")
    @patch("flaskr.schemas.anime.mutations.User")
    @patch("flaskr.schemas.anime.mutations.Anime")
    def test_save_anime_success(self, mock_anime, mock_user, mock_buscar_anime_por_id, mock_verify_token):
        mock_verify_token.return_value = "user_id"
        mock_user.objects.return_value.first.return_value = "user_obj" #Enlazar objeto


        mock_buscar_anime_por_id.return_value = {
            "mal_id": 1,
            "title": "Test Anime",
            "synopsis": "Test Synopsis",
            "genres": [{"name": "Action"}],
            "episodes": 12,
            "type": "TV",
            "images": {"jpg": {"image_url": "http://example.com/image.jpg"}},
            "aired": {"from": "2023-01-01", "to": "2023-12-31", "string": "Jan 1, 2023 - Dec 31, 2023"},
            "rating": "PG-13",
            "score": 8.5,
            "rank": 1,
            "status": "Finished",
            "airing": False,
            "trailer": {"url": "http://example.com/trailer"}
        }
        mock_anime.objects.return_value.first.return_value = None

        mock_instance = MagicMock()
        mock_anime.return_value = mock_instance

        class fake_context:
            headers = {"Authorization": "Bearer token123"}

        info = MagicMock()
        info.context = fake_context()

        result = SaveAnime().mutate(info, mal_id=1)   

        self.assertTrue(result.success)
        self.assertEqual(result.message, "Anime guardado exitosamente")
        mock_instance.save.assert_called_once()

    def test_save_anime_no_token(self):
        
        info = MagicMock()
        info.context.headers = {}
        result = SaveAnime().mutate(info, mal_id=1)
        self.assertFalse(result.success)
        self.assertEqual(result.message, "No se proporcionó token de autorización")

    @patch("flaskr.schemas.anime.mutations.verify_token")
    def test_save_anime_invalid_token(self, mock_verify_token):
        class fake_context:
            headers = {"Authorization": "Bearer invalid_token"}
        info = MagicMock()
        info.context = fake_context()
        mock_verify_token.return_value = None
        result = SaveAnime().mutate(info, mal_id=1)

        self.assertFalse(result.success)
        self.assertEqual(result.message, "Token inválido o expirado")

    @patch("flaskr.schemas.anime.mutations.verify_token")
    @patch("flaskr.schemas.anime.mutations.buscar_anime_por_id")
    @patch("flaskr.schemas.anime.mutations.User")
    @patch("flaskr.schemas.anime.mutations.Anime")
    def test_save_anime_in_favorite(self, mock_anime, mock_user, mock_buscar_anime_por_id, mock_verify_token):
        class fake_context:
            headers = {"Authorization": "Bearer token123"}

        info = MagicMock()
        info.context = fake_context()
        mock_verify_token.return_value = "user_id"

        mock_buscar_anime_por_id.return_value = {
            "mal_id": 1,
            "title": "Test Anime",
            "synopsis": "Test Synopsis",
            "genres": [{"name": "Action"}],
            "episodes": 12,
            "type": "TV",
            "images": {"jpg": {"image_url": "http://example.com/image.jpg"}},
            "aired": {"from": "2023-01-01", "to": "2023-12-31", "string": "Jan 1, 2023 - Dec 31, 2023"},
            "rating": "PG-13",
            "score": 8.5,
            "rank": 1,
            "status": "Finished",
            "airing": False,
            "trailer": {"url": "http://example.com/trailer"}
        }
        mock_user.objects.return_value.first.return_value = "user_obj"
        mock_anime.objects.return_value.first.return_value = {
            "mal_id": 1,
            "title": "Test Anime",
            "synopsis": "Test Synopsis",
            "genres": [{"name": "Action"}],
            "episodes": 12,
            "type": "TV",
            "images": {"jpg": {"image_url": "http://example.com/image.jpg"}},
            "aired": {"from": "2023-01-01", "to": "2023-12-31", "string": "Jan 1, 2023 - Dec 31, 2023"},
            "rating": "PG-13",
            "score": 8.5,
            "rank": 1,
            "status": "Finished",
            "airing": False,
            "trailer": {"url": "http://example.com/trailer"}
        }

        result = SaveAnime().mutate(info, mal_id=1)
        self.assertFalse(result.success)
        self.assertEqual(result.message, "Anime ya guardado")
        mock_anime.save.assert_not_called()

class TestRemoveAnimeFromFavoritesMutation(unittest.TestCase):

    @patch("flaskr.schemas.anime.mutations.verify_token") 
    @patch("flaskr.schemas.anime.mutations.User") 
    @patch("flaskr.schemas.anime.mutations.Anime") 
    def test_remove_anime_from_favorites_success(self, mock_anime, mock_user, mock_verify_token):
        info = MagicMock()
        class fake_context:
            headers = {"Authorization": "Bearer token123"}

        info.context = fake_context()
        mock_verify_token.return_value = "user_id"
        mock_user.objects.return_value.first.return_value = "user_obj"
        anime_obj = MagicMock()
        mock_anime.objects.return_value.first.return_value = anime_obj

        response = RemoveAnimeFromFavorite().mutate(info, mal_id=1)

        anime_obj.delete.assert_called_once()
        self.assertTrue(response.success)
        self.assertEqual(response.message, "Anime eliminado de favoritos exitosamente")