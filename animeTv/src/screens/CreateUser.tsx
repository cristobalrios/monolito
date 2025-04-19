import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations/Login';
import { useNavigate } from 'react-router-dom';
import AuthStyles from '../styles/authStyles';
import { CREATE_USER } from '../graphql/mutations/CeateUser';

const CreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUser, { loading: creating, error: createError }] = useMutation(CREATE_USER);
  const [login, { loading: loggingIn, error: loginError }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    try {
      const createResponse = await createUser({ variables: { email, password } });
      if (createResponse?.data?.CreateUser?.success) {
        // Usuario creado, realizar login automáticamente
        const loginResponse = await login({ variables: { email, password } });
        if (loginResponse?.data?.Login?.success) {
          localStorage.setItem('token', loginResponse.data.Login.token); // Guardar el token en localStorage
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
    <form onSubmit={handleCreateUser} style={AuthStyles.container}>
      <div style={AuthStyles.card}>
        <h2 style={AuthStyles.title}>📝 Crear Cuenta</h2>
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
        <button style={AuthStyles.button} type="submit" disabled={creating || loggingIn}>
          {creating ? 'Creando cuenta...' : loggingIn ? 'Iniciando sesión...' : 'Crear cuenta'}
        </button>

        {(createError || loginError) && (
          <p style={AuthStyles.errorText}>
            ❌ Error: {(createError || loginError)?.message}
          </p>
        )}
      </div>
    </form>
  );
};

export default CreateUser;