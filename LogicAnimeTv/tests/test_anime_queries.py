import unittest
from unittest.mock import *
from flaskr.schemas.anime.queries import *

class TestSaveAnimeMutation(unittest.TestCase):

    @patch("flaskr.services.jikan_api.buscar_anime_avanzado")
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