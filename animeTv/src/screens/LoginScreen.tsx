import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations/Login';
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
    console.log('Email:', email);
    console.log('Password:', password);
    try {
      const response = await login({ variables: { email, password } });
      console.log('Response:', response.data);
      if (response?.data?.Login?.success) {
        console.log('Token:', response.data.Login.token);
        localStorage.setItem('token', response.data.Login.token); // Guardar el token en localStorage
        navigate('/Home');
      } else {
        alert('Credenciales incorrectas.');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={handleLogin} style={AuthStyles.container}>
      <div style={AuthStyles.card}>
        <h2 style={AuthStyles.title}>🎟️ Iniciar Sesión</h2>
        <input
          style={AuthStyles.input}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={AuthStyles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={AuthStyles.button} type="submit" disabled={loading}>
          {loading ? 'Autenticando...' : 'Entrar'}
        </button>

        {error && (
          <p style={AuthStyles.errorText}>
            ❌ Error: {error.message.includes('Network') ? 'No se pudo conectar al servidor.' : error.message}
          </p>
        )}

        {/* Botón para redirigir a la página de creación de cuenta */}
        <button
          style={{ ...AuthStyles.button, marginTop: '10px', backgroundColor: '#4CAF50' }}
          type="button"
          onClick={() => navigate('/CreateUser')}
        >
          Crear cuenta
        </button>
      </div>
    </form>
  );
};

export default LoginScreen;
