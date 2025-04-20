import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER, CREATE_USER } from '../graphql/mutations/mutations';
import { useNavigate } from 'react-router-dom';
import AuthStyles from '../styles/authStyles';

const CreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [createUser, { loading: creating, error: createError }] = useMutation(CREATE_USER);
  const [login, { loading: loggingIn, error: loginError }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, ingrese un formato de correo válido.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    try {
      const createResponse = await createUser({ variables: { email, password } });
      if (createResponse?.data?.CreateUser?.success) {
        const loginResponse = await login({ variables: { email, password } });
        if (loginResponse?.data?.Login?.success) {
          localStorage.setItem('token', loginResponse.data.Login.token);
          navigate('/Home');
        } else {
          alert('Error al iniciar sesión automáticamente.');
        }
      } else {
        alert(createResponse?.data?.CreateUser?.message || 'Error al crear el usuario.');
      }
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  };

  return (
    <div style={AuthStyles.container}>
      <h1 style={AuthStyles.logo}>OTAKUyt</h1>
      <h2 style={AuthStyles.subtitle}>Crear cuenta</h2>
      
      <input
        style={AuthStyles.input}
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleCreateUser(e);
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
            handleCreateUser(e);
          }
        }}
      />

      <input
        style={AuthStyles.input}
        type="password"
        placeholder="Repetir contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleCreateUser(e);
          }
        }}
      />

      <button 
        style={AuthStyles.button} 
        onClick={handleCreateUser}
        disabled={creating || loggingIn}
      >
        {creating ? 'Creando cuenta...' : loggingIn ? 'Iniciando sesión...' : 'Registrarse'}
      </button>

      <button
        style={AuthStyles.secondaryButton}
        onClick={() => navigate('/')}
      >
        Volver
      </button>

      {(createError || loginError) && (
        <p style={AuthStyles.errorText}>
          ❌ Error: {(createError || loginError)?.message}
        </p>
      )}
      
    </div>
  );
};

export default CreateUser;