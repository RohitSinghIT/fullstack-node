// Example of how to make GraphQL API calls from web routes
// This is useful when you want to call your own GraphQL API from web routes

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export class GraphQLClient {
  private endpoint: string;

  constructor(endpoint: string = 'http://localhost:4000/graphql') {
    this.endpoint = endpoint;
  }

  async query<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json() as GraphQLResponse<T>;

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data as T;
    } catch (error) {
      console.error('GraphQL query error:', error);
      throw error;
    }
  }

  async mutation<T = any>(mutation: string, variables?: Record<string, any>): Promise<T> {
    return this.query<T>(mutation, variables);
  }
}

// Example usage in web routes:
/*
import { GraphQLClient } from '../utils/graphql-client';

const graphqlClient = new GraphQLClient();

// In a web route:
router.get('/users-via-graphql', async (req, res) => {
  try {
    const query = `
      query {
        users {
          id
          name
          email
          role
        }
      }
    `;
    
    const result = await graphqlClient.query(query);
    res.render('users', { users: result.users });
  } catch (error) {
    res.render('error', { message: 'Failed to fetch users' });
  }
});
*/

// Predefined queries for common operations
export const QUERIES = {
  GET_USERS: `
    query {
      users {
        id
        name
        email
        role
        createdAt
      }
    }
  `,
  
  GET_USER: `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
        role
        createdAt
      }
    }
  `,
  
  ME: `
    query {
      me {
        id
        name
        email
        role
      }
    }
  `,
};

export const MUTATIONS = {
  LOGIN: `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        user {
          id
          name
          email
          role
        }
        token
      }
    }
  `,
  
  SIGNUP: `
    mutation Signup($input: SignupInput!) {
      signup(input: $input) {
        user {
          id
          name
          email
          role
        }
        token
      }
    }
  `,
}; 