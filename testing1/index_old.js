const { ApolloServer, gql } = require('apollo-server');

import { request, gql }  from 'graphql-request'
const graphURI = 'https://beta.pokeapi.co/graphql/v1beta';

const typeDefs = gql`
#define pokemon type
	
type pokemon {
	name: string!
	id: Int
	types: [pokemon_types]
}

type pokemon_find_result {
	success: Boolean
	message: String
	docs: [pokemon]
}

input pokemon_find_filter {
	name: String
	id: Int
}

input allPokemon_filter {
	page: Int
	orderid: Int
	typeid: Int
}
type Query {
	getPokemon: [Pokemon]
	getAllPokemon: [Pokemon]
}
`;

const resolvers = {
	
}