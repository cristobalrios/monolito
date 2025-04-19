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
