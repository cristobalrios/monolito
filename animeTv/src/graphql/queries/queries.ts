import { gql } from '@apollo/client';

export const GET_ANIME_LIST = gql`
  query GetAnimeList {
    animes {
      id
      title
      description
    }
  }
`;

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

export const GET_AIRING = gql`
    query EnEmision {
        enEmision {
            malId
            airing
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

export const GET_FAVOURITES = gql`
  query ObtenerFavoritos {
    obtenerFavoritos {
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
    }
  }
`;