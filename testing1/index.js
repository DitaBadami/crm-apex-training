const { ApolloServer, gql } = require('apollo-server');
//import { ApolloClient, InMemoryCache } from '@apollo/client';

//for pokemon api
// const client = new ApolloClient({
//   //uri: 'https://pokeapi-graphiql.herokuapp.com/',
//   uri: 'https://beta.pokeapi.co/graphql/v1beta',
//   cache: new InMemoryCache()
// });

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
#define pokemona type
	
type Pokemon {
	name: string!
	height: Int
	weight: Int
}

type Query {
	getPokemon: [Pokemon]
	
}
`;
//getPokemon(filter: Pokemon_filter): [Pokemon!]! 
//getAllPokemon(page: Int): [Pokemon!]!
//resolver - defines where data is coming from - in this case it will be pokemon api - https://pokeapi-graphiql.herokuapp.com
//testing by hardcoding some data
const getPokemon = [
{
	name: 'Pikachu',
	height: 2,
	weight: 3
},
{
	name: 'Bert',
	height: 12,
	weight: 13
}
];

const resolvers = {
  Query: {
    getPokemon: () => getPokemon,
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
})