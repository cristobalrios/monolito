import unittest
from unittest.mock import *
from flaskr.schemas.user.mutations import *

class TestCreateUserMutation(unittest.TestCase):

    @patch("flaskr.schemas.user.mutations.User")
    def test_create_user_success(self, mock_user_class):

        mock_user_class.objects.return_value.first.return_value = None

        mock_user_instance = MagicMock()
        mock_user_class.return_value = mock_user_instance

        result = CreateUser.mutate(None, None, email="email@test.cl", password="password")
        self.assertTrue(result.success)
        self.assertEqual(result.message, "Usuario creado exitosamente")
        mock_user_instance.save.assert_called_once()
        mock_user_instance.set_password.assert_called_once_with("password")
    
    @patch("flaskr.schemas.user.mutations.User")
    def test_create_user_email_already_exists(self, mock_user_class):

        mock_user_class.objects.return_value.first.return_value = True
        result = CreateUser.mutate(None, None, email="email@test.cl", password="password")
        self.assertFalse(result.success)
        self.assertEqual(result.message, "El correo ya está en uso")

    @patch("flaskr.schemas.user.mutations.generate_token")
    @patch("flaskr.schemas.user.mutations.User")
    def test_user_login_success(self, mock_user_class, mock_generate_token):
        mock_user_instance = MagicMock()
        mock_user_class.objects.return_value.first.return_value = mock_user_instance
        mock_user_instance.check_password.return_value = True
        mock_user_instance.id = "user_id"
        mock_generate_token.return_value = "token123"

        result = LoginUser.mutate(None, None, email="email@test.cl", password="password")
        self.assertTrue(result.success)
        self.assertEqual(result.message, "Inicio de sesión exitoso")
        self.assertEqual(result.token, "token123")
        mock_user_instance.check_password.assert_called_once_with("password")
        mock_generate_token.assert_called_once_with("user_id")

    @patch("flaskr.schemas.user.mutations.generate_token")
    @patch("flaskr.schemas.user.mutations.User")
    def test_user_login_invalid_credentials(self, mock_user_class, mock_generate_token):
        mock_user_instance = MagicMock()
        mock_user_class.objects.return_value.first.return_value = mock_user_instance
        mock_user_instance.check_password.return_value = False

        result = LoginUser.mutate(None, None, email="email@test.cl", password="wrong_password")
        self.assertFalse(result.success)
        self.assertEqual(result.message, "Credenciales inválidas")
        mock_user_instance.check_password.assert_called_once_with("wrong_password")
        mock_generate_token.assert_not_called()

    @patch("flaskr.schemas.user.mutations.generate_token")
    @patch("flaskr.schemas.user.mutations.User")
    def test_user_login_user_not_found(self, mock_user_class, mock_generate_token):
        mock_user_class.objects.return_value.first.return_value = None

        result = LoginUser.mutate(None, None, email="not_existing_email", password="password")
        self.assertFalse(result.success)
        self.assertEqual(result.message, "Credenciales inválidas")
        mock_user_class.objects.return_value.first.assert_called_once_with(email="not_existing_email")

       