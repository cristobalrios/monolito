import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import HomeStyles from '../styles/homeStyles';
import { useMutation } from '@apollo/client';
import { ADD_TO_FAVOURITES, DELETE_FROM_FAVOURITES } from '../graphql/mutations/mutations';
import { ADVANCED_SEARCH, GET_AIRING, GET_FAVOURITES } from '../graphql/queries/queries';
import imagenref from '../utils/ChatGPT_Image_tipica.png';
import { useNavigate } from 'react-router-dom';

const genreMap = {
  '1': 'Action',
  '2': 'Adventure',
  '3': 'Racing',
  '4': 'Comedy',
  '5': 'Avant Garde',
  '6': 'Mythology',
  '7': 'Mystery',
  '8': 'Drama',
  '10': 'Fantasy',
  '11': 'Strategy Game',
  '13': 'Historical',
  '14': 'Horror',
  '17': 'Martial Arts',
  '18': 'Mecha',
  '19': 'Music',
  '20': 'Parody',
  '21': 'Samurai',
  '22': 'Romance',
  '23': 'School',
  '24': 'Sci-Fi',
  '26': 'Girls Love',
  '28': 'Boys Love',
  '29': 'Space',
  '30': 'Sports',
  '31': 'Super Power',
  '32': 'Vampire',
  '35': 'Harem',
  '36': 'Slice of Life',
  '37': 'Supernatural',
  '38': 'Military',
  '39': 'Detective',
  '40': 'Psychological',
  '41': 'Suspense',
  '46': 'Award Winning',
  '47': 'Gourmet',
  '50': 'Adult Cast',
  '51': 'Anthropomorphic',
  '52': 'CGDCT',
  '53': 'Childcare',
  '54': 'Combat Sports',
  '55': 'Delinquents',
  '56': 'Educational',
  '57': 'Gag Humor',
  '58': 'Gore',
  '59': 'High Stakes Game',
  '60': 'Idols (Female)',
  '61': 'Idols (Male)',
  '62': 'Isekai',
  '63': 'Iyashikei',
  '64': 'Love Polygon',
  '66': 'Mahou Shoujo',
  '67': 'Medical',
  '68': 'Organized Crime',
  '69': 'Otaku Culture',
  '70': 'Performing Arts',
  '71': 'Pets',
  '72': 'Reincarnation',
  '73': 'Reverse Harem',
  '74': 'Love Status Quo',
  '75': 'Showbiz',
  '76': 'Survival',
  '77': 'Team Sports',
  '78': 'Time Travel',
  '79': 'Video Game',
  '81': 'Crossdressing',
};

const HomeScreen = () => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [minScore, setMinScore] = useState<number | undefined>(undefined);
  const [generos, setGeneros] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [animesList, setAnimesList] = useState<any[]>([]);
  const [generosVisibles, setGenerosVisibles] = useState(8); // Estado para controlar la cantidad de géneros visibles
  const navigate = useNavigate();

  const [addToFavourites] = useMutation(ADD_TO_FAVOURITES);
  const [deleteFromFavourites] = useMutation(DELETE_FROM_FAVOURITES);
  const [searchAnime, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(ADVANCED_SEARCH);
  const [getAiringAnime, { loading: airingLoading, error: airingError, data: airingData }] = useLazyQuery(GET_AIRING);
  const [getUserFavourites, { data: favoritesData }] = useLazyQuery(GET_FAVOURITES);

  // Restaurar búsqueda desde localStorage al cargar el componente
  useEffect(() => {
    const savedSearch = localStorage.getItem('homeSearch');
    if (savedSearch) {
      const { nombre, tipo, estado, minScore, generos, animesList, hasSearched } = JSON.parse(savedSearch);
      setNombre(nombre || '');
      setTipo(tipo || '');
      setEstado(estado || '');
      setMinScore(minScore || undefined);
      setGeneros(generos || []);
      setAnimesList(animesList || []);
      setHasSearched(hasSearched || false);

      // Realizar la búsqueda automáticamente si hay un estado guardado
      const variables: any = {};
      if (nombre) variables.nombre = nombre;
      if (tipo) variables.tipo = tipo;
      if (estado) variables.estado = estado;
      if (minScore !== undefined) variables.minScore = minScore;
      if (generos.length > 0) variables.genero = generos.join(',');

      if (Object.keys(variables).length > 0) {
        searchAnime({ variables });
      }
    } else {
      getAiringAnime(); // Si no hay búsqueda guardada, cargar animes en emisión
    }
  }, [getAiringAnime, searchAnime]);

  // Guardar búsqueda en localStorage antes de navegar
  const handleNavigateToFavourites = () => {
    const searchState = {
      nombre,
      tipo,
      estado,
      minScore,
      generos,
      animesList,
      hasSearched,
    };
    localStorage.setItem('homeSearch', JSON.stringify(searchState));
    navigate('/Favourites');
  };

  useEffect(() => {
    if (airingData?.enEmision && !hasSearched) {
      setAnimesList(airingData.enEmision.map((anime: any) => ({
        ...anime,
        isFavorite: false,
      })));
    }
  }, [airingData, hasSearched]);

  useEffect(() => {
    if (searchData?.busquedaAvanzada) {
      setAnimesList(searchData.busquedaAvanzada.map((anime: any) => ({
        ...anime,
        isFavorite: false,
      })));
    }
  }, [searchData]);

  useEffect(() => {
    const checkFavourites = async () => {
      if (!localStorage.getItem('token')) return;
      
      try {
        await getUserFavourites({
          context: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        });
      } catch (err) {
        console.error('Error al obtener favoritos:', err);
      }
    };
    checkFavourites();
  }, [getUserFavourites]);

  useEffect(() => {
    if (favoritesData?.obtenerFavoritos) {
      const favouriteIds = favoritesData.obtenerFavoritos.map((fav: { malId: any; }) => fav.malId);
      setAnimesList((prev) =>
        prev.map((anime) => ({
          ...anime,
          isFavorite: favouriteIds.includes(anime.malId),
        }))
      );
    }
  }, [favoritesData]);

  const handleSearch = () => {
    const variables: any = {};

    if (nombre !== '') variables.nombre = nombre;
    if (tipo !== '') variables.tipo = tipo;
    if (estado !== '') variables.estado = estado;
    if (minScore !== undefined) variables.minScore = minScore;
    if (generos.length > 0) variables.genero = generos.join(',');

    setHasSearched(true);
    searchAnime({
      variables,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleAnimeClick = (animeId: string) => {
    // Guardar el estado de búsqueda en localStorage antes de navegar
    const searchState = {
      nombre,
      tipo,
      estado,
      minScore,
      generos,
      animesList,
      hasSearched,
    };
    localStorage.setItem('homeSearch', JSON.stringify(searchState));
    navigate(`/AnimeInfo/${animeId}`); // Navegar a la página de detalles del anime
  };

  const toggleGenero = (genero: string) => {
    setGeneros((prev) =>
      prev.includes(genero) ? prev.filter((g) => g !== genero) : [...prev, genero]
    );
  };

  const showAiringAnime = !hasSearched && airingData?.enEmision;
  const showSearchResults = hasSearched && searchData?.busquedaAvanzada;
  const isLoading = airingLoading || searchLoading;
  const error = airingError || searchError;
  
  const handleToggleFavourite = async (anime: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesión para guardar favoritos');
      return;
    }
    
    try {
      const malId = anime.malId || anime.mal_id;
      let response;
      
      if (anime.isFavorite) {
                response = await deleteFromFavourites({
          variables: {malId},
          context: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        });
        if (response.data?.DeleteAnime?.success) {
          alert(`"${anime.title}" ha sido eliminado de tus favoritos.`);
        }
      } else {
        response = await addToFavourites({
          variables: {malId},
          context: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        });
        if (response.data?.SaveAnime?.success) {
          alert(`"${anime.title}" ha sido agregado a tus favoritos.`);
        }
      } 
      
      if (response.data?.SaveAnime?.success || response.data?.DeleteAnime?.success) {
        
        setAnimesList(prev => prev.map(a => 
          (a.malId === malId || a.mal_id === malId) ? {...a, isFavorite: !a.isFavorite} : a
        ));
      } else {
        const errorMessage = response.data?.SaveAnime?.message || 
                           response.data?.DeleteAnime?.message || 
                           'Error desconocido';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar favoritos');
    }
  };

  return (
    <div style={HomeStyles.container}>
      {/* Barra superior morada */}
      <header style={HomeStyles.header}>
        <h1 style={HomeStyles.logo}>OTAKUyt</h1>
        <div style={HomeStyles.navContainer}>
          <button 
            style={HomeStyles.navButton}
            onClick={handleNavigateToFavourites} // Guardar búsqueda antes de navegar
          >
          ❤️ <span>Favoritos</span>
          </button>
          
          {/* Cerrar Sesión */}
          <button 
            style={HomeStyles.navButton}
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
          >
            🚪 <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <div style={HomeStyles.content}>
        <h2 style={HomeStyles.sectionTitle}>Listado de animes</h2>
        <p style={HomeStyles.sectionSubtitle}>
          Haga click en el título del anime para ver información detallada.
        </p>

        {/* Barra de búsqueda avanzada */}
        <div style={HomeStyles.searchContainer}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Buscar por nombre..."
            style={HomeStyles.searchInput}
          />
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={HomeStyles.searchInput}
          >
            <option value="">Tipo</option>
            <option value="TV">serie de TV</option>
            <option value="Movie">Película</option>
            <option value="OVA">OVA</option>
            <option value="special">Especial de televisión </option>
            <option value="ONA">ONA</option>
            <option value="Music">videos Musicales</option>
          </select>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            style={HomeStyles.searchInput}
          >
            <option value="">Estado</option>
            <option value="airing">En emisión</option>
            <option value="complete">Finalizado</option>
            <option value="upcoming">Próximamente</option>
          </select>
          <input
            type="number"
            value={minScore || ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value >= 1 && value <= 10) {
                setMinScore(value);
              } else if (value < 1) {
                setMinScore(1); // Ajusta automáticamente al mínimo permitido
              } else if (value > 10) {
                setMinScore(10); // Ajusta automáticamente al máximo permitido
              }
            }}
            placeholder="Puntuación mínima (entre 1 y 10)"
            step="0.1"
            style={HomeStyles.searchInput}
          />
          <button onClick={handleSearch} style={HomeStyles.searchButton}>
            Buscar
          </button>
        </div>

        {/* Filtros de género */}
        <div style={{ margin: '15px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Seleccionar géneros:</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(genreMap)
              .slice(0, generosVisibles) // Mostrar solo los géneros visibles
              .map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => toggleGenero(key)}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    backgroundColor: generos.includes(key) ? '#6200ea' : '#f9f9f9',
                    color: generos.includes(key) ? '#fff' : '#000',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                  }}
                >
                  {value}
                </button>
              ))}
          </div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            {generosVisibles < Object.keys(genreMap).length && (
              <button
                onClick={() => setGenerosVisibles((prev) => prev + 8)} // Mostrar 8 más
                style={{
                  padding: '10px 15px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: '#6200ea',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                }}
              >
                Ver más
              </button>
            )}
            {generosVisibles > 8 && (
              <button
                onClick={() => setGenerosVisibles((prev) => Math.max(prev - 8, 8))} // Mostrar 8 menos
                style={{
                  padding: '10px 15px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: '#6200ea',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                }}
              >
                Ver menos
              </button>
            )}
          </div>
        </div>

        {/* Botón para limpiar búsqueda */}
        <div style={{ marginTop: '20px', textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => {
              setNombre('');
              setTipo('');
              setEstado('');
              setMinScore(undefined);
              setGeneros([]);
              setHasSearched(false);
              setGenerosVisibles(8); // Restablecer géneros visibles a 8
              getAiringAnime(); // Mostrar animes en emisión por defecto
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: '#ff6b6b',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
          >
            Limpiar búsqueda
          </button>
        </div>

        {/* Resultados */}
        {isLoading && <p style={{ textAlign: 'center' }}>Cargando resultados...</p>}
        {error && <p style={{ color: '#ff6b6b', textAlign: 'center' }}>Error: {error.message}</p>}

        {/* Mostrar resultados de búsqueda si hay una búsqueda */}
        {showSearchResults && (
          <ul style={HomeStyles.animeList}>
            {animesList.map((anime: any) => (
                <li key={anime.malId} style={HomeStyles.animeItem}>
                   <div style={{ display: 'flex', gap: '20px' }}>
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      style={{
                        width: '250px',
                        height: '350px',
                        objectFit: 'contain',
                        borderRadius: '5px',
                      }}
                      onError={(e) => {
                        e.currentTarget.src = imagenref;
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{ ...HomeStyles.animeTitle, cursor: 'pointer', color: '#ffffff' }}
                        onClick={() => handleAnimeClick(anime.malId)}
                      >
                        {anime.title}
                      </h3>
                      <p style={HomeStyles.animeDescription}>
                        {anime.synopsis || 'Sin descripción'}
                      </p>
                      <button 
                      style={{ 
                        ...HomeStyles.favouriteButton,
                        ...(anime.isFavorite ? { 
                          color: 'white'
                        } : {}),
                        transition: 'all 0.3s ease',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavourite(anime, e);
                      }}
                    >
                      {anime.isFavorite ? '× Eliminar de favoritos' : '♡ Agregar a favoritos'}
                    </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        )}

        {/* Mostrar animes en emisión por defecto cuando no hay búsqueda */}
        {showAiringAnime && (
          <>
            <h3 style={{ ...HomeStyles.sectionTitle, fontSize: '32px', margin: '20px 0' }}>
              En Emisión
            </h3>
            <ul style={HomeStyles.animeList}>
              {animesList.map((anime: any) => (
                  <li key={anime.malId} style={HomeStyles.animeItem}>
                     <div style={{ display: 'flex', gap: '20px' }}>
                    <img
                      src={anime.imageUrl}
                      alt={anime.title}
                      style={{
                        width: '250px',
                        height: '350px',
                        objectFit: 'contain',
                        borderRadius: '5px',
                      }}
                      onError={(e) => {
                        e.currentTarget.src = imagenref;
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{ ...HomeStyles.animeTitle, cursor: 'pointer', color: '#ffffff' }}
                        onClick={() => handleAnimeClick(anime.malId)}
                      >
                        {anime.title}
                      </h3>
                      <p style={HomeStyles.animeDescription}>
                        {anime.synopsis || 'Sin descripción'}
                      </p>
                      <button 
                      style={{ 
                        ...HomeStyles.favouriteButton,
                        ...(anime.isFavorite ? { 
                          color: 'white'
                        } : {}),
                        transition: 'all 0.3s ease',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavourite(anime, e);
                      }}
                    >
                      {anime.isFavorite ? '× Eliminar de favoritos' : '♡ Agregar a favoritos'}
                    </button>
                    </div>
                  </div>
                  </li>
                ))}
            </ul>
          </>
        )}

        {showSearchResults && searchData.busquedaAvanzada.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>No hay resultados para la búsqueda.</p>
        )}

        {!showAiringAnime && !showSearchResults && !isLoading && !error && (
          <p style={{ textAlign: 'center', color: '#666' }}>
            Ingresa filtros y haz clic en "Buscar" para encontrar animes.
          </p>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;