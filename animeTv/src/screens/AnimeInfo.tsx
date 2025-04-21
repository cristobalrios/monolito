import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ANIME } from '../graphql/queries/queries';
import { ADD_TO_FAVOURITES, DELETE_FROM_FAVOURITES } from '../graphql/mutations/mutations';
import HomeStyles from '../styles/homeStyles';
import imagenref from '../utils/ChatGPT_Image_tipica.png';

const AnimeInfo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorites, setCheckingFavorites] = useState(true);
  
  const { loading, error, data } = useQuery(GET_ANIME, {
    variables: { malId: parseInt(id || '0') },
  });

  const [addToFavourites] = useMutation(ADD_TO_FAVOURITES);
  const [deleteFromFavourites] = useMutation(DELETE_FROM_FAVOURITES);

  useEffect(() => {
    const checkIfFavorite = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCheckingFavorites(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              query {
                obtenerFavoritos {
                  malId
                }
              }
            `
          })
        });

        const result = await response.json();
        if (result.data?.obtenerFavoritos) {
          setIsFavorite(result.data.obtenerFavoritos.some((fav: any) => fav.malId === parseInt(id || '0')));
        }
      } catch (err) {
        console.error('Error al verificar favoritos:', err);
      } finally {
        setCheckingFavorites(false);
      }
    };

    checkIfFavorite();
  }, [id]);

  const handleToggleFavourite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para gestionar favoritos');
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await deleteFromFavourites({
          variables: { malId: parseInt(id || '0') },
          context: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        });
        alert('Anime eliminado de favoritos');
      } else {
        await addToFavourites({
          variables: { malId: parseInt(id || '0') },
          context: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        });
        alert('Anime agregado a favoritos');
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error al actualizar favoritos:', err);
      alert('Error al actualizar favoritos');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
    return date.toLocaleDateString('es-ES', options); // Formato en español
  };

  const getEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0]; // Extrae el ID del video
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading || checkingFavorites) return <p style={HomeStyles.sectionTitle}>Cargando información del anime...</p>;
  if (error) return <p style={HomeStyles.error}>Error: {error.message}</p>;

  const anime = data?.buscarAnimePorId;

  return (
    <div style={HomeStyles.container}>
      <header style={HomeStyles.header}>
        <h1 style={HomeStyles.logo}>OTAKUyt</h1>
        <div style={HomeStyles.navContainer}>
          <button 
            style={HomeStyles.navButton}
            onClick={() => navigate('/Favourites')}
          >
            ❤️ <span>Favoritos</span>
          </button>
          <button 
            style={HomeStyles.navButton}
            onClick={handleBack}
          >
            ↩️ <span>Volver</span>
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

      <div style={HomeStyles.content}>
        <h2 style={HomeStyles.sectionTitle}>Información de la serie</h2>
        {anime && (
          <div style={HomeStyles.animeInfoContainer}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Imagen y detalles principales */}
              <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  <img
                    src={anime.imageUrl}
                    alt={anime.title}
                    style={HomeStyles.animeInfoImage}
                    onError={(e) => {
                      e.currentTarget.src = imagenref;
                    }}
                  />
                  {/* Botón de favoritos debajo de la imagen */}
                  <button
                    onClick={handleToggleFavourite}
                    style={{
                      ...HomeStyles.favouriteButton,
                      ...(isFavorite ? HomeStyles.favouriteButton : {}),
                    }}
                  >
                    {isFavorite ? '× Eliminar de favoritos' : '♡ Agregar a favoritos'}
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <h1 style={HomeStyles.animeInfoHeader}>{anime.title}</h1>
                  {/* Géneros */}
                  {anime.genres && anime.genres.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {anime.genres.map((genre: string) => (
                          <span key={genre} style={HomeStyles.genreTag}>
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Detalles de emisión */}
                  {anime.aired && (
                    <div style={{ marginBottom: '20px', color: '#ddd' }}>
                      <p style={{ margin: '5px 0' }}>
                        <strong>Fecha de estreno:</strong>{' '}
                        {anime.aired.fromDate ? formatDate(anime.aired.fromDate) : '?'}
                      </p>
                      {anime.aired.toDate && (
                        <p style={{ margin: '5px 0' }}>
                          <strong>Última emisión:</strong> {formatDate(anime.aired.toDate)}
                        </p>
                      )}
                      {!anime.aired.toDate && anime.episodes > 1 || anime.episodes == null && (
                        <p style={{ margin: '5px 0', color: 'lightgreen', fontWeight: 'bold' }}>
                          EN EMISIÓN
                        </p>
                      )}
                    </div>
                  )}
                  {/* Divider */}
                  <div style={HomeStyles.animeInfoDivider}></div>
                  {/* Sinopsis */}
                  <div style={{ marginBottom: '0px' }}>
                    <h3 style={HomeStyles.animeInfoDetailsTitle}>Descripción</h3>
                    <p style={HomeStyles.animeInfoDescription}>
                      {anime.synopsis || 'Sin descripción disponible.'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Botón de favoritos */}
              <div style={HomeStyles.animeInfoButtonContainer}>
                <button 
                  onClick={handleToggleFavourite}
                  style={{
                    ...HomeStyles.animeInfoButton,
                    ...(isFavorite ? HomeStyles.animeInfoButtonActive : {})
                  }}
                >
                  {isFavorite ? '× Eliminar de favoritos' : '♡ Agregar a favoritos'}
                </button>
              </div>
              
              {/* Detalles adicionales */}
              <div style={HomeStyles.animeInfoDetailsContainer}>
                <h3 style={HomeStyles.animeInfoDetailsTitle}>Detalles adicionales</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                  <div>
                    <p style={HomeStyles.animeInfoDetailsText}>
                      <strong>Tipo:</strong> {anime.type || 'N/A'}
                    </p>
                    {anime.status === 'Finished Airing' && (
                      <p style={HomeStyles.animeInfoDetailsText}>
                        <strong>Episodios:</strong> {anime.episodes || 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <p style={HomeStyles.animeInfoDetailsText}>
                      <strong>Puntuación:</strong> {anime.score || 'N/A'}
                    </p>                                                        
                  </div>
                  <div>
                    <p style={HomeStyles.animeInfoDetailsText}>
                      <strong>Rank:</strong> {anime.rank ? `#${anime.rank}` : 'N/A'}
                    </p>                                
                  </div>
                  <p style={HomeStyles.animeInfoDetailsText}>
                      <strong>Rating:</strong> {anime.rating || 'N/A'}
                  </p>
                </div>
              </div>
              
              {/* Tráiler */}
              {anime.trailerUrl && (
                <div style={HomeStyles.animeInfoTrailerContainer}>
                  <h3 style={HomeStyles.animeInfoDetailsTitle}>Tráiler</h3>
                  <div
                    style={{
                      position: 'relative',
                      paddingBottom: '56.25%',
                      height: 0,
                      overflow: 'hidden',
                      borderRadius: '5px',
                    }}
                  >
                    <iframe
                      src={getEmbedUrl(anime.trailerUrl) || ''}
                      title={`${anime.title} Trailer`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeInfo; 