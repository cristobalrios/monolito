import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_FAVOURITES } from '../graphql/queries/queries';
import { DELETE_FROM_FAVOURITES } from '../graphql/mutations/mutations';
import HomeStyles from '../styles/homeStyles';
import { useNavigate } from 'react-router-dom';
import imagenref from '../utils/ChatGPT_Image_tipica.png';

const Favourites = () => {
  const [favouritesList, setFavouritesList] = useState<any[]>([]);
  const [getUserFavourites, { loading, error, data }] = useLazyQuery(GET_FAVOURITES, {
    fetchPolicy: 'network-only', // Asegura que siempre se haga una nueva solicitud al servidor
  });
  const [deleteFromFavourites] = useMutation(DELETE_FROM_FAVOURITES);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Ejecutar la consulta para obtener los favoritos
    getUserFavourites({
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }, [navigate, getUserFavourites]);

  useEffect(() => {
    if (data?.obtenerFavoritos) {
      setFavouritesList(
        data.obtenerFavoritos.map((anime: any) => ({
          ...anime,
          isFavorite: true, // Todos los animes aquí son favoritos por definición
        }))
      );
    }
  }, [data]);

  const handleAnimeClick = (animeId: string) => {
    navigate(`/AnimeInfo/${animeId}`);
  };

  const handleRemoveFavourite = async (anime: { malId: any }, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesión para realizar esta acción');
      return;
    }

    try {
      setFavouritesList((prev) => prev.filter((item) => item.malId !== anime.malId));

      const response = await deleteFromFavourites({
        variables: { malId: anime.malId },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (response.data?.DeleteAnime?.success) {
        // Volver a consultar los favoritos para asegurar la sincronización
        getUserFavourites({
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
        alert('Anime eliminado de favoritos');
      } else {
        const errorMessage =
          response.data?.DeleteAnime?.message || 'Error desconocido al eliminar de favoritos';
        alert(errorMessage);
      }
    } catch (err) {
      console.error('Error al eliminar de favoritos:', err);
      if (err instanceof Error) {
        alert('Error al eliminar de favoritos: ' + err.message);
      } else {
        alert('Error al eliminar de favoritos: ' + String(err));
      }
    }
  };

  if (loading) return <p style={HomeStyles.sectionTitle}>Cargando favoritos...</p>;
  if (error) return <p style={HomeStyles.error}>Error: {error.message}</p>;

  return (
    <div style={HomeStyles.container}>
      <header style={HomeStyles.header}>
        <h1 style={HomeStyles.logo}>OTAKUyt</h1>
        <div style={HomeStyles.navContainer}>
          {/* Botón de Volver */}
          <button
            style={HomeStyles.navButton}
            onClick={() => navigate(-1)} // Navega a la página anterior
          >
            ↩️ <span>Volver</span>
          </button>

          {/* Cerrar Sesión */}
          <button
            style={HomeStyles.navButton}
            onClick={() => {
              // Eliminar el token de autenticación
              localStorage.removeItem('token');
              // Eliminar la búsqueda guardada en localStorage
              localStorage.removeItem('homeSearch');
              // Redirigir al usuario a la página de inicio o login
              navigate('/');
            }}
          >
            🚪 <span>Salir</span>
          </button>
        </div>
      </header>

      <div style={HomeStyles.content}>
        <h2 style={HomeStyles.sectionTitle}>Tus animes favoritos</h2>

        {favouritesList.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            No tienes animes favoritos aún.
          </p>
        ) : (
          <ul style={HomeStyles.animeList}>
            {favouritesList.map((anime: any) => (
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
                        color: 'white',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={(e) => handleRemoveFavourite(anime, e)}
                    >
                      × Eliminar de favoritos
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Favourites;