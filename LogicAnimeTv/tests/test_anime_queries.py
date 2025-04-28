import unittest
from unittest.mock import *
from flaskr.schemas.anime.queries import *

class TestSaveAnimeMutation(unittest.TestCase):

    @patch("flaskr.schemas.anime.queries.buscar_anime_avanzado")
    def test_busqueda_avanzada(self, mock_buscar_anime_avanzado):
        mock_buscar_anime_avanzado.return_value = [
            {
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
        ]
        result = AnimeQueries().resolve_busqueda_avanzada(None, nombre="Test Anime", tipo="TV", estado="Finished")
        mock_buscar_anime_avanzado.assert_called_once_with({"q": "Test Anime", "type": "TV", "status": "Finished"})
        self.assertEqual(result[0]["title"], "Test Anime")

    @patch("flaskr.schemas.anime.queries.buscar_anime_avanzado")
    def test_en_emision(self, mock_buscar_anime_avanzado):
        mock_buscar_anime_avanzado.return_value = [
            {"mal_id": 2, "title": "Anime en Emisión", "status": "airing"}
        ]

        result = AnimeQueries().resolve_en_emision(None)

        mock_buscar_anime_avanzado.assert_called_once_with({"status": "airing"})
        self.assertEqual(result[0]["title"], "Anime en Emisión")


    @patch("flaskr.schemas.anime.queries.Anime.objects")
    @patch("flaskr.schemas.anime.queries.verify_token")
    def test_obtener_favoritos_success(self, mock_verify_token, mock_anime_objects):
        mock_context = MagicMock()
        mock_context.headers.get.return_value = "Bearer fake_token"

        mock_verify_token.return_value = "user123"
        mock_anime_objects.return_value = [{"title": "Favorite Anime"}]

        result = AnimeQueries().resolve_obtener_favoritos(info=MagicMock(context=mock_context))

        mock_verify_token.assert_called_once_with("fake_token")
        mock_anime_objects.assert_called_once_with(user="user123")
        self.assertEqual(result[0]["title"], "Favorite Anime")

    def test_obtener_favoritos_no_auth_header(self):
        mock_context = MagicMock()
        mock_context.headers.get.return_value = None

        result = AnimeQueries().resolve_obtener_favoritos(info=MagicMock(context=mock_context))

        self.assertEqual(result, [])


    @patch("flaskr.schemas.anime.queries.verify_token")
    def test_obtener_favoritos_invalid_token(self, mock_verify_token):
        mock_context = MagicMock()
        mock_context.headers.get.return_value = "Bearer invalid_token"

        mock_verify_token.return_value = None

        result = AnimeQueries().resolve_obtener_favoritos(info=MagicMock(context=mock_context))

        mock_verify_token.assert_called_once_with("invalid_token")
        self.assertEqual(result, [])

    @patch("flaskr.schemas.anime.queries.buscar_anime_por_id")
    def test_buscar_anime_por_id_success(self, mock_buscar_anime_por_id):
        mock_buscar_anime_por_id.return_value = {
            "mal_id": 1,
            "title": "Naruto"
        }

        result = AnimeQueries().resolve_buscar_anime_por_id(None, mal_id=1)

        mock_buscar_anime_por_id.assert_called_once_with(1)
        self.assertEqual(result["title"], "Naruto")

    @patch("flaskr.schemas.anime.queries.buscar_anime_por_id")
    def test_buscar_anime_por_id_error(self, mock_buscar_anime_por_id):
        mock_buscar_anime_por_id.return_value = {"error": "Not Found"}

        result = AnimeQueries().resolve_buscar_anime_por_id(None, mal_id=9999)

        mock_buscar_anime_por_id.assert_called_once_with(9999)
        self.assertIsNone(result)




