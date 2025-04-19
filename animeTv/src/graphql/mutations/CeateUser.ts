import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    CreateUser(email: $email, password: $password) {
      success
      message
    }
  }
`;