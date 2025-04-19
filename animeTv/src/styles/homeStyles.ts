import { CSSProperties } from 'react';

const HomeStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
        backgroundAttachment: 'fixed',
    minHeight: '100vh',
    flexDirection: 'column',  // Asegura que todo se organice de forma vertical
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to right,rgb(139, 235, 215),rgb(18, 4, 88))',
    padding: '20px',  // Añadir un poco de padding para que no se vea tan pegado
  },
  title: {
    color: 'white',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2.5rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',  // Organiza el input y el botón en una fila
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',  // Permite que el contenido se ajuste en pantallas más pequeñas
    width: '100%',
    maxWidth: '600px',  // Limita el ancho total de la sección de búsqueda
  },
  input: {
    padding: '12px 20px',
    borderRadius: '25px',
    border: 'none',
    width: '100%',
    fontSize: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  button: {
    padding: '12px 30px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  buttonHover: {
    backgroundColor: '#3a7bc8',
    transform: 'translateY(-2px)',
  },
  animeList: {
    listStyle: 'none',
    padding: '0',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  animeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255,255,255,0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  animeCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  },
  animeTitle: {
    color: '#333',
    marginTop: '0',
    marginBottom: '15px',
    fontSize: '1.5rem',
    textAlign: 'center',
  },
  animeDescription: {
    color: '#666',
    lineHeight: '1.6',
    textAlign: 'center',
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    fontSize: '1.2rem',
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  promptText: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontSize: '1.1rem',
    fontStyle: 'italic',
  },
};

export default HomeStyles;
