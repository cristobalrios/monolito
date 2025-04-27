import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import HomeStyles from '../styles/homeStyles';
import { useMutation } from '@apollo/client';
import { ADD_TO_FAVOURITES, DELETE_FROM_FAVOURITES } from '../graphql/mutations/mutations';
import { ADVANCED_SEARCH, GET_AIRING, GET_FAVOURITES } from '../graphql/queries/queries';
import imagenref from '../utils/NoImageAvailable.png';
import { useNavigate } from 'react-router-dom';
import genreMap from '../genres/GenreMap';

const HomeScreen = () => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [minScore, setMinScore] = useState<number | undefined>(undefined);
  const [generos, setGeneros] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [animesList, setAnimesList] = useState<any[]>([]);
  const [generosVisibles, setGenerosVisibles] = useState(8);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const navigate = useNavigate();

  const [addToFavourites] = useMutation(ADD_TO_FAVOURITES);
  const [deleteFromFavourites] = useMutation(DELETE_FROM_FAVOURITES);
  const [searchAnime, { loading: searchLoading, error: searchError, data: searchData }] = useLazyQuery(ADVANCED_SEARCH);
  const [getAiringAnime, { loading: airingLoading, error: airingError, data: airingData }] = useLazyQuery(GET_AIRING);
  const [getUserFavourites, { data: favoritesData }] = useLazyQuery(GET_FAVOURITES);

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
      getAiringAnime();
      setHasSearched(false);
    }
  }, [getAiringAnime]);

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
    if (!hasSearched) {
      getAiringAnime();
    }
  }, [hasSearched, getAiringAnime]);

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
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        });
      } catch (err) {
        console.error('Error al obtener favoritos:', err);
      }
    };
    checkFavourites();
  }, [getUserFavourites]);

  useEffect(() => {
    if (favoritesData?.obtenerFavoritos) {
      const favouriteIds = favoritesData.obtenerFavoritos.map((fav: { malId: any }) => fav.malId);

      if (airingData?.enEmision) {
        setAnimesList((prev) =>
          airingData.enEmision.map((anime: any) => ({
            ...anime,
            isFavorite: favouriteIds.includes(anime.malId),
          }))
        );
      }

      if (searchData?.busquedaAvanzada) {
        setAnimesList((prev) =>
          searchData.busquedaAvanzada.map((anime: any) => ({
            ...anime,
            isFavorite: favouriteIds.includes(anime.malId),
          }))
        );
      }
    }
  }, [favoritesData, airingData, searchData]);

  useEffect(() => {
    if (!favoritesData && airingData?.enEmision) {
      setAnimesList(
        airingData.enEmision.map((anime: any) => ({
          ...anime,
          isFavorite: false,
        }))
      );
    }
  }, [airingData, favoritesData]);

  const handleSearch = () => {
    const variables: any = {};
    if (nombre !== '') variables.nombre = nombre;
    if (tipo !== '') variables.tipo = tipo;
    if (estado !== '') variables.estado = estado;
    if (minScore !== undefined) variables.minScore = minScore;
    if (generos.length > 0) variables.genero = generos.join(',');

    setHasSearched(true);
    searchAnime({ variables });
    setIsFilterModalOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    setNombre('');
    setTipo('');
    setEstado('');
    setMinScore(undefined);
    setGeneros([]);
    setGenerosVisibles(8);
    setHasSearched(false);
    localStorage.removeItem('homeSearch');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleAnimeClick = (animeId: string) => {
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
    navigate(`/AnimeInfo/${animeId}`);
  };

  const toggleGenero = (genero: string) => {
    setGeneros((prev) =>
      prev.includes(genero) ? prev.filter((g) => g !== genero) : [...prev, genero]
    );
  };

  const showAiringAnime = !hasSearched && (airingData?.enEmision || animesList.length > 0);
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
          variables: { malId },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
        if (response.data?.DeleteAnime?.success) {
          alert(`"${anime.title}" ha sido eliminado de tus favoritos.`);
        }
      } else {
        response = await addToFavourites({
          variables: { malId },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
        if (response.data?.SaveAnime?.success) {
          alert(`"${anime.title}" ha sido agregado a tus favoritos.`);
        }
      }

      if (response.data?.SaveAnime?.success || response.data?.DeleteAnime?.success) {
        setAnimesList((prev) =>
          prev.map((a) =>
            (a.malId === malId || a.mal_id === malId) ? { ...a, isFavorite: !a.isFavorite } : a
          )
        );
      } else {
        const errorMessage =
          response.data?.SaveAnime?.message ||
          response.data?.DeleteAnime?.message ||
          'Error desconocido';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar favoritos');
    }
  };

  const handleClearSearch = async () => {
    setNombre('');
    setTipo('');
    setEstado('');
    setMinScore(undefined);
    setGeneros([]);
    setGenerosVisibles(8);
    setHasSearched(false);
    
    localStorage.removeItem('homeSearch');
    const token = localStorage.getItem('token');
    
    try {
      const [airingResult, favouritesResult] = await Promise.all([
        getAiringAnime(),
        token ? getUserFavourites({
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }) : Promise.resolve({ data: null }),
      ]);
  
      const airingAnimes = airingResult.data?.enEmision || [];
      const favouriteIds = favouritesResult.data?.obtenerFavoritos?.map((fav: { malId: number }) => fav.malId) || [];
  
      setAnimesList(
        airingAnimes.map((anime: any) => ({
          ...anime,
          isFavorite: favouriteIds.includes(anime.malId),
        }))
      );
    } catch (error) {
      console.error('Error al limpiar búsqueda:', error);
    }
  };

  return (
    <div style={HomeStyles.container}>
      {/* Barra superior morada */}
      <header style={HomeStyles.header}>
        <h1 style={{ ...HomeStyles.logo, cursor: 'pointer' }} onClick={() => navigate('/Home')}>
          OTAKUyt
        </h1>
        <div style={{ ...HomeStyles.navContainer, flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '600px', width: '100%' }}>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Buscar por nombre..."
              style={{ ...HomeStyles.searchInput, flex: 1 }}
            />
            <button
              onClick={() => setIsFilterModalOpen(true)}
              style={HomeStyles.optionButton}
            >
              Filtros
            </button>
            {/* Botón para limpiar búsqueda */}
            
            <button
              onClick={handleClearSearch}
              style={HomeStyles.optionButton}
            >
              Limpiar búsqueda
            </button>

          </div>
        </div>
        <div style={HomeStyles.navContainer}>
          {localStorage.getItem('token') && (
            <button style={HomeStyles.navButton} onClick={handleNavigateToFavourites}>
              ❤️ <span>Favoritos</span>
            </button>
          )}
          <button style={HomeStyles.navButton} onClick={handleLogout}>
            🚪 <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Modal de filtros */}
      {isFilterModalOpen && (
        <div style={HomeStyles.modalOverlay}>
          <div style={HomeStyles.modalContent}>
            <h2 style={{ ...HomeStyles.sectionTitle, color: '#ffffff', fontSize: '24px', margin: '0 0 20px 0' }}>
              Filtros de búsqueda
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={HomeStyles.searchInput}
              >
                <option value="">Tipo</option>
                <option value="TV">Serie de TV</option>
                <option value="Movie">Película</option>
                <option value="OVA">OVA</option>
                <option value="special">Especial de televisión</option>
                <option value="ONA">ONA</option>
                <option value="Music">Videos musicales</option>
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
                    setMinScore(1);
                  } else if (value > 10) {
                    setMinScore(10);
                  }
                }}
                placeholder="Puntuación mínima (entre 1 y 10)"
                step="0.1"
                style={HomeStyles.searchInput}
              />
              <div>
                <label style={{ ...HomeStyles.sectionTitle, color: '#ffffff', fontSize: '16px', fontWeight: 'bold' }}>
                  Seleccionar Géneros:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {Object.entries(genreMap)
                    .slice(0, generosVisibles)
                    .map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => toggleGenero(key)}
                        style={{
                          padding: '10px 15px',
                          borderRadius: '5px',
                          border: '1px solid #ccc',
                          backgroundColor: generos.includes(key) ? '#0f4e09' : '#f9f9f9',
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
                      onClick={() => setGenerosVisibles((prev) => prev + 8)}
                      style={HomeStyles.optionButton}
                    >
                      Ver más
                    </button>
                  )}
                  {generosVisibles > 8 && (
                    <button
                      onClick={() => setGenerosVisibles((prev) => Math.max(prev - 8, 8))}
                      style={HomeStyles.optionButton}
                    >
                      Ver menos
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleSearch} style={HomeStyles.optionButton}>
                Aplicar filtros
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                style={{ ...HomeStyles.optionButton, backgroundColor: 'transparent' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div style={HomeStyles.content}>
        <h2 style={HomeStyles.sectionTitle}>Listado de animes</h2>
        <p style={HomeStyles.sectionSubtitle}>
          Haga clic en el título del anime para ver información detallada.
        </p>

        {/* Resultados */}
        {isLoading && <p style={{ textAlign: 'center' }}>Cargando resultados...</p>}
        {error && <p style={{ color: '#ff6b6b', textAlign: 'center' }}>Error: {error.message}</p>}

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
                    {localStorage.getItem('token') && (
                      <button
                        style={{
                          ...HomeStyles.favouriteButton,
                          ...(anime.isFavorite ? { color: 'white' } : {}),
                          transition: 'all 0.3s ease',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavourite(anime, e);
                        }}
                      >
                        {anime.isFavorite ? '× Eliminar de favoritos' : '♡ Agregar a favoritos'}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

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
                      {localStorage.getItem('token') && (
                        <button
                          style={{
                            ...HomeStyles.favouriteButton,
                            ...(anime.isFavorite ? { color: 'white' } : {}),
                            transition: 'all 0.3s ease',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavourite(anime, e);
                          }}
                        >
                          {anime.isFavorite ? '× Eliminar de favoritos' : '♡ Agregar a favoritos'}
                        </button>
                      )}
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