import { CSSProperties } from 'react';

const AuthStyles: { [key: string]: CSSProperties } = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right,rgb(139, 235, 215),rgb(18, 4, 88))',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: 10,
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: 400,
    textAlign: 'center',
  },
  title: {
    marginBottom: 25,
    fontSize: 24,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderRadius: 15,
    border: '1px solid #ccc',
    fontSize: 16,
    boxSizing: 'border-box', 
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: 15,
    fontSize: 16,
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  errorText: {
    marginTop: 15,
    color: '#D8000C',
    fontWeight: 500,
  },
};

export default AuthStyles;
