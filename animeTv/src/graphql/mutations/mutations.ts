import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    CreateUser(email: $email, password: $password) {
      success
      message
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    Login(email: $email, password: $password) {
      success
      message
      token
    }
  }
`;

export const ADD_TO_FAVOURITES = gql`
  mutation SaveAnime($malId: Int!) {
    SaveAnime(malId: $malId) {
      success
      message
    }
  }
`;

export const DELETE_FROM_FAVOURITES = gql`
  mutation DeleteAnime($malId: Int!) {
    DeleteAnime(malId: $malId) {
      success
      message
    }
  }
`;
