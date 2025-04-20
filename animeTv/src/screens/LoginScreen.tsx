import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations/mutations';
import { useNavigate } from 'react-router-dom';
import AuthStyles from '../styles/authStyles';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    try {
      const response = await login({ variables: { email, password } });
      if (response?.data?.Login?.success) {
        localStorage.setItem('token', response.data.Login.token);
        navigate('/Home');
      } else {
        alert('Credenciales incorrectas.');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div style={AuthStyles.container}>
      <h1 style={AuthStyles.logo}>OTAKUyt</h1>
      <p style={AuthStyles.subtitle}>Bienvenido!</p>
      
      <input
        style={AuthStyles.input}
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleLogin(e);
          }
        }}
      />
      
      <input
        style={AuthStyles.input}
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleLogin(e);
          }
        }}
      />
      
      <button 
        style={AuthStyles.button} 
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Autenticando...' : 'Iniciar Sesión'}
      </button>
      
      <button
        style={AuthStyles.secondaryButton}
        onClick={() => navigate('/CreateUser')}
      >
        Crear Cuenta
      </button>

      {error && (
        <p style={AuthStyles.errorText}>
          ❌ Error: {error.message.includes('Network') ? 'No se pudo conectar al servidor.' : error.message}
        </p>
      )}
      
      <p style={AuthStyles.footer}>
        ©Los Mochilas - 2025. Todos los derechos reservados.
      </p>
    </div>
  );
};

export default LoginScreen;