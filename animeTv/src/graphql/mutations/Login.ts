import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    Login(email: $email, password: $password) {
      success
      message
      token
    }
  }
`;
