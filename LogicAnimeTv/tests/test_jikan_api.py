import unittest
from unittest.mock import patch, MagicMock
from flaskr.services.jikan_api import *

class TestJikanAPI(unittest.TestCase):

    @patch("flaskr.services.jikan_api.requests.get")
    def test_buscar_anime_por_id_success(self, mock_get):
        # Mock the response from the requests.get call
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "data": {
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
        }
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response

        # Call the function with a test mal_id
        result = buscar_anime_por_id(1)

        # Assert that the result is as expected
        self.assertEqual(result["mal_id"], 1)
        self.assertEqual(result["title"], "Test Anime")
        self.assertEqual(result["synopsis"], "Test Synopsis")
        self.assertEqual(result["genres"][0]["name"], "Action")
        self.assertEqual(result["episodes"], 12)
        self.assertEqual(result["type"], "TV")
        self.assertEqual(result["images"]["jpg"]["image_url"], "http://example.com/image.jpg")
        self.assertEqual(result["aired"]["from"], "2023-01-01")
        self.assertEqual(result["rating"], "PG-13")
        self.assertEqual(result["score"], 8.5)
        self.assertEqual(result["rank"], 1)
        self.assertEqual(result["status"], "Finished")
        self.assertFalse(result["airing"])
        self.assertEqual(result["trailer"]["url"], "http://example.com/trailer")