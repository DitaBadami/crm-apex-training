const { ApolloServer, gql } = require('apollo-server');
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://pokeapi-graphiql.herokuapp.com/',
  cache: new InMemoryCache()
});

const query = gql`
  query {
    pokemon(name: "pikachu") {
      id
      name
      height
      weight
      types {
        slot
        type {
          name
        }
      }
    }
  }
`;

client.query({ query })
  .then(response => {
    console.log(response.data.pokemon);
  })
  .catch(error => {
    console.error(error);
  });