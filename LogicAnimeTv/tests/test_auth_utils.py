import unittest
from unittest.mock import patch, MagicMock
from flaskr.auth.utils import generate_token, verify_token
import jwt as pyjwt

@patch("flaskr.auth.utils.SECRET_KEY", new="mocked_secret_key")
class TestAuthUtils(unittest.TestCase):

    @patch("flaskr.auth.utils.pyjwt.encode")
    def test_generate_token(self, mock_encode):
        mock_encode.return_value = "mocked_token"
        

        usuario_id = "12345"
        token = generate_token(usuario_id)

        mock_encode.assert_called_once()

        self.assertEqual(token, "mocked_token")

    @patch("flaskr.auth.utils.pyjwt.decode")
    def test_verify_token_success(self, mock_decode):
        mock_decode.return_value = {"user_id": "12345"}

        result = verify_token("fake_token")

        mock_decode.assert_called_once_with("fake_token", "mocked_secret_key", algorithms=["HS256"])

        self.assertEqual(result, "12345")

    @patch("flaskr.auth.utils.pyjwt.decode")
    def test_verify_token_expired(self, mock_decode):
        mock_decode.side_effect = pyjwt.ExpiredSignatureError("Token expired")
        result = verify_token("fake_token")

        mock_decode.assert_called_once_with("fake_token", "mocked_secret_key", algorithms=["HS256"])
        self.assertIsNone(result)   

    @patch("flaskr.auth.utils.pyjwt.decode")
    def test_verify_token_invalid(self, mock_decode):
        mock_decode.side_effect = pyjwt.InvalidTokenError("Invalid token")
        result = verify_token("fake_token")
        
        mock_decode.assert_called_once_with("fake_token", "mocked_secret_key", algorithms=["HS256"])
        self.assertIsNone(result)
