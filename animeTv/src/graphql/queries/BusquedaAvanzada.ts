import { gql } from '@apollo/client';

export const ADVANCED_SEARCH = gql`
  query BusquedaAvanzada(
    $nombre: String
    $tipo: String
    $estado: String
    $minScore: Float
    $genero: String
  ) {
    busquedaAvanzada(
      nombre: $nombre
      tipo: $tipo
      estado: $estado
      minScore: $minScore
      genero: $genero
    ) {
      malId
      title
      synopsis
      genres
      episodes
      type
      imageUrl
      rating
      score
      rank
      status
      airing
      trailerUrl
      aired {
        fromDate
        toDate
        stringDate
      }
    }
  }
`;