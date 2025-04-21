import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import HomeStyles from '../styles/homeStyles';
import { useMutation } from '@apollo/client';
import { ADD_TO_FAVOURITES, DELETE_FROM_FAVOURITES } from '../graphql/mutations/mutations';
import { ADVANCED_SEARCH, GET_AIRING, GET_FAVOURITES } from '../graphql/queries/queries';
import imagenref from '../utils/ChatGPT_Image_tipica.png';
import { useNavigate } from 'react-router-dom';

const genreMap = {
  '1': 'Acción',
  '2': 'Aventura',
  '3': 'Comedia',
  '4': 'Drama',
  '5': 'Fantasía',
};

const HomeScreen = () => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [minScore, setMinScore] = useState<number | undefined>(undefined);
  const [generos, setGeneros] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [animesList, setAnimesList] = useState<any[]>([]);
  const navigate = useNavigate();


  const [addToFavourites] = useMutation(ADD_TO_FAVOURITES);
  const [deleteFromFavourites] = useMutation(DELETE_FROM_FAVOURITES);
  const [searchAnime, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(ADVANCED_SEARCH);
  const [getAiringAnime, { loading: airingLoading, error: airingError, data: airingData }] = useLazyQuery(GET_AIRING);
  const [getUserFavourites, { data: favoritesData }] = useLazyQuery(GET_FAVOURITES);

  useEffect(() => {
    getAiringAnime();
  }, [getAiringAnime]);

  useEffect(() => {
    if (airingData?.enEmision) {
      setAnimesList(airingData.enEmision.map((anime: any) => ({
        ...anime,
        isFavorite: false
      })));
    }
  }, [airingData]);
  
  useEffect(() => {
    if (searchData?.busquedaAvanzada) {
      setAnimesList(searchData.busquedaAvanzada.map((anime: any) => ({
        ...anime,
        isFavorite: false
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
    if (minScore !== undefined) variables.min_score = minScore;
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
    navigate(`/AnimeInfo/${animeId}`);
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
            onClick={() => navigate('/Favourites')}
          >
          ❤️ <span>Favoritos</span>
          </button>
          <button style={HomeStyles.navButton} onClick={handleLogout}>
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
            <option value="TV">TV</option>
            <option value="Movie">Película</option>
            <option value="OVA">OVA</option>
          </select>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            style={HomeStyles.searchInput}
          >
            <option value="">Estado</option>
            <option value="airing">En emisión</option>
            <option value="completed">Finalizado</option>
            <option value="upcoming">Próximamente</option>
          </select>
          <input
            type="number"
            value={minScore || ''}
            onChange={(e) => setMinScore(parseFloat(e.target.value))}
            placeholder="Puntuación mínima"
            style={HomeStyles.searchInput}
          />
          <button onClick={handleSearch} style={HomeStyles.searchButton}>
            Buscar
          </button>
        </div>

        {/* Filtros de género */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '15px 0' }}>
          {(['1', '2', '3', '4', '5'] as Array<keyof typeof genreMap>).map((genero) => (
            <label key={genero} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="checkbox"
                value={genero}
                checked={generos.includes(genero)}
                onChange={() => toggleGenero(genero)}
              />
              {genreMap[genero]}
            </label>
          ))}
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
                          backgroundColor: '#260d6e',
                          borderColor: '#260d6e',
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
                          backgroundColor: '#260d6e',
                          borderColor: '#260d6e',
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