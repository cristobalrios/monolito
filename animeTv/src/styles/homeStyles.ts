import { CSSProperties } from 'react';

const HomeStyles: { [key: string]: CSSProperties } = {
  animeDescription: {
    fontSize: '14px',
    color: '#808080',
    margin: '0 0 15px 0',
    lineHeight: '1.5',
  },
  animeList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  animeInfoContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
  },
  animeInfoHeader: {
    fontSize: '2rem',
    margin: '0 0 10px 0',
    color: '#ffffff',
    paddingBottom: '10px'
  },
  animeInfoSubheader: {
    color: '#aaa',
    fontStyle: 'italic',
    marginBottom: '20px'
  },
  animeInfoButton: {
    backgroundColor: 'transparent',
    color: '#260d6e',
    border: '1px solid #260d6e',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  animeInfoButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px'
  },
  animeInfoDescription: {
    color: '#bbb',
    lineHeight: '1.6'
  },
  animeInfoDetailsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: '5px',
    padding: '15px',
  },
  animeInfoDetailsTitle: {
    fontSize: '1.2rem',
    color: '#ffffff',
    marginBottom: '15px'
  },
  animeInfoDetailsText: {
    margin: '5px 0',
    color: '#bbb'
  },
  animeInfoDivider: {
    borderTop: '1px solid #333',
    margin: '20px 0'
  },
  animeInfoImage: {
    width: '250px',
    height: '350px',
    objectFit: 'cover',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
  },
  animeInfoTrailerContainer: {
    marginTop: '30px'
  },
  animeItem: {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  animeTitle: {
    fontSize: '28px',
    margin: '0 0 10px 0',
    color: '#ffffff',
  },
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: "'Arial', sans-serif",
    paddingTop: '70px',
  },
  content: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  divider: {
    border: 'none',
    height: '1px',
    backgroundColor: '#ddd',
    margin: '20px 0',
  },
  favouriteButton: {
    backgroundColor: '#2f2f2f',
    border: '1px solid #949494',
    color: '#ffffff',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  genreTag: {
    backgroundColor: '#0f4e09',
    border: '1px solid #b4afb9',
    color: '#ffffff',
    padding: '5px 12px',
    borderRadius: '5px',
    fontSize: '0.9rem'
  },
  header: {
    backgroundColor: '#260d6e',
    padding: '5px 10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  logo: {
    fontFamily: '"Niramit", sans-serif',
    fontSize: '48px',
    fontStyle: 'italic',
    color: 'white',
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  searchButton: {
    backgroundColor: '#260d6e',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 20px',
    cursor: 'pointer',
  },
  searchContainer: {
    display: 'flex',
    margin: '20px 0',
    gap: '10px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 15px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  sectionSubtitle: {
    fontFamily: '"Niramit", sans-serif',
    fontSize: '16px',
    fontStyle: 'italic',
    marginBottom: '40px',
    color: 'gray',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '54px',
    fontStyle: 'italic',
    margin: '50px 0 30px 0',
    color: '#260d6e',
    textAlign: 'center',
  },
};

export default HomeStyles;