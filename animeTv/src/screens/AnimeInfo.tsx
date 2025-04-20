import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ANIME_LIST } from '../graphql/queries/queries';
import HomeStyles from '../styles/homeStyles';

const AnimeInfo = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_ANIME_LIST, {
    variables: { id },
  });

  if (loading) return <p style={HomeStyles.loading}>Cargando información del anime...</p>;
  if (error) return <p style={HomeStyles.error}>Error: {error.message}</p>;

  const anime = data?.anime;

  return (
    <div style={HomeStyles.container}>
      <h1 style={HomeStyles.title}>{anime.title}</h1>
      <img
        src={anime.imageUrl}
        alt={anime.title}
        style={HomeStyles.image}
      />
      <p style={HomeStyles.description}>{anime.synopsis || 'Sin descripción disponible.'}</p>
      <p style={HomeStyles.details}>
        <strong>Estado:</strong> {anime.status}
      </p>
      <p style={HomeStyles.details}>
        <strong>Tipo:</strong> {anime.type}
      </p>
      <p style={HomeStyles.details}>
        <strong>Puntuación:</strong> {anime.score || 'N/A'}
      </p>
    </div>
  );
};

export default AnimeInfo;