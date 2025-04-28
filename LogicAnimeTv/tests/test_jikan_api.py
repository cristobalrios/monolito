import unittest
from unittest.mock import patch, MagicMock
from flaskr.services.jikan_api import *
from requests.exceptions import RequestException

class TestJikanAPI(unittest.TestCase):

    @patch("flaskr.services.jikan_api.requests.get")
    def test_search_anime_by_id(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {"data": {"mal_id": 1, "title": "Naruto"}}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        

        result = buscar_anime_por_id(1)

        mock_get.assert_called_once_with("https://api.jikan.moe/v4/anime/1")
        self.assertEqual(result, {"mal_id": 1, "title": "Naruto"})

    @patch("flaskr.services.jikan_api.requests.get")
    def test_search_anime_by_id_failure(self, mock_get):
        mock_get.side_effect = RequestException("Request failed")

        result = buscar_anime_por_id(9999)

        self.assertIn("error", result)
        self.assertEqual(result["error"], "Error al llamar a la API de Jikan")

    @patch("flaskr.services.jikan_api.requests.get")
    def test_buscar_anime_avanzado_success(self, mock_get):
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {
            "data": [
                {"title": "One Piece", "type": "TV"},
                {"title": "Naruto", "type": "TV"}
            ]
        }
        mock_get.return_value = mock_response

        params = {"q": "naruto"}
        result = buscar_anime_avanzado(params)

        mock_get.assert_called_once_with(
            "https://api.jikan.moe/v4/anime",
            params={"q": "naruto", "sfw": "true"}
        )
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0]["title"], "One Piece")

    @patch("flaskr.services.jikan_api.requests.get")
    def test_buscar_anime_avanzado_failure(self, mock_get):
        mock_get.side_effect = RequestException("Request failed")

        result = buscar_anime_avanzado({"q": "dragon"})

        self.assertIn("error", result)
        self.assertEqual(result["error"], "Error al llamar a la API de Jikan")
