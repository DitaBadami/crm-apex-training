// const express = require('express');
// const { ApolloServer } = require('apollo-server-express');
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

//for pokemon api
const client = new ApolloClient({
  //uri: 'https://pokeapi-graphiql.herokuapp.com/',
  uri: 'https://beta.pokeapi.co/graphql/v1beta',
  cache: new InMemoryCache()
});

type Pokemon {
	id: ID!
	name: string!
	height: Int
	weight: Int
}

type Pokemon_filter {
	id: ID
	name: string
	height: Int
	weight: Int
}

type Query {
	getPokemon(filter: Pokemon_filter): [Pokemon!]!
	getAllPokemon(page: Int): [Pokemon!]!
}

schema {
	query: Query
}
