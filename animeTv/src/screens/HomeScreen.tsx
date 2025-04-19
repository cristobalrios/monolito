import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import HomeStyles from '../styles/homeStyles';
import { ADVANCED_SEARCH } from '../graphql/queries/BusquedaAvanzada';
import imagenref from '../utils/ChatGPT_Image_tipica.png';

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

  const [searchAnime, { loading, error, data }] = useLazyQuery(ADVANCED_SEARCH);

  const handleSearch = () => {
    const variables: any = {};

    if (nombre !== '') variables.nombre = nombre;
    if (tipo !== '') variables.tipo = tipo;
    if (estado !== '') variables.estado = estado;
    if (minScore !== undefined) variables.min_score = minScore;
    if (generos.length > 0) variables.genero = generos.join(',');

    console.log('Parámetros enviados:', variables); // Para depuración

    searchAnime({
      variables,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleGenero = (genero: string) => {
    setGeneros((prev) =>
      prev.includes(genero) ? prev.filter((g) => g !== genero) : [...prev, genero]
    );
  };

  return (
    <div style={{ ...HomeStyles.container, backgroundAttachment: 'fixed' }}>
      <h1 style={HomeStyles.title}>Búsqueda Avanzada de Animes</h1>

      <div style={HomeStyles.searchContainer}>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Buscar por nombre..."
          style={HomeStyles.input}
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          style={HomeStyles.select}
        >
          <option value="">Tipo</option>
          <option value="TV">TV</option>
          <option value="Movie">Película</option>
          <option value="OVA">OVA</option>
        </select>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          style={HomeStyles.select}
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
          style={HomeStyles.input}
        />
        <div style={HomeStyles.genreContainer}>
          {(['1', '2', '3', '4', '5'] as Array<keyof typeof genreMap>).map((genero) => (
            <label key={genero} style={HomeStyles.genreLabel}>
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
        <button onClick={handleSearch} style={HomeStyles.button}>
          Buscar
        </button>
      </div>

      {loading && <p style={HomeStyles.loadingText}>Cargando resultados...</p>}
      {error && <p style={HomeStyles.errorText}>Error: {error.message}</p>}

      {data && data.busquedaAvanzada? (
        <>
          {console.log('Datos recibidos del backend:', data.busquedaAvanzada)}
          <div style={HomeStyles.resultsContainer}>
            <ul style={HomeStyles.animeList}>
                {data.busquedaAvanzada
                .slice()
                .sort((a: any, b: any) => a.title.localeCompare(b.title))
                .map((anime: any) => (
                <li key={anime.mal_id} style={HomeStyles.animeCard}>
                  <img
                    src={anime.imageUrl}
                    alt={anime.title}
                    style={HomeStyles.animeImage}
                    onError={(e) => {
                      e.currentTarget.src = imagenref; // Cambia la imagen a una por defecto si falla
                    }}
                  />
                  <h3 style={HomeStyles.animeTitle}>{anime.title}</h3>
                  <p style={HomeStyles.animeDescription}>
                    {anime.synopsis || 'Sin descripción'}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        !loading && !error && (
          <p style={HomeStyles.promptText}>
            Ingresa filtros y haz clic en "Buscar" para encontrar animes.
          </p>
        )
      )}

      {data && data.busquedaAvanzada.length === 0 && (
        <p style={HomeStyles.noResultsText}>No hay resultados para la busqueda.</p>
      )}
    </div>
  );
};

export default HomeScreen;