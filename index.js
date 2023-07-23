"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//get data from
const pokeapi = 'https://beta.pokeapi.co/graphql/v1beta';
//main variable
const LANG_ID = 9;
//functions
function getAllPokemon(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        // qry to get data from api, 
        const query = `
  query getAllPokemon($limit: Int, $offset: Int, $where: pokemon_v2_pokemonspeciesname_bool_exp,   $orderBy: [pokemon_v2_pokemonspeciesname_order_by!]) {
    getAllPokemon: pokemon_v2_pokemonspeciesname(limit: $limit, offset: $offset, where: $where, order_by: $orderBy) {
      name
      id: pokemon_species_id
      specy: pokemon_v2_pokemonspecy {
        allpokes: pokemon_v2_pokemons(where: {is_default: {_eq: true}}) {
          types: pokemon_v2_pokemontypes {
            type: pokemon_v2_type {
              typenames: pokemon_v2_typenames(where: {language_id: {_eq: 9}}) {
                name
              }
            }
          }
        }
      }
    }
  }`;
        let orderby = '';
        let where = {
            language_id: { _eq: filters.languageid },
            pokemon_v2_pokemonspecy: {
                pokemon_v2_pokemons: {
                    is_default: { _eq: true }
                }
            }
        };
        // add type if any to where variable
        // if (typeof filters.type === 'number' && filters.type > 0) {
        //   where.pokemon_v2_pokemonspecy.pokemon_v2_pokemons.pokemon_v2_pokemontypes = {pokemon_v2_type: {name: {_eq: filters.type}}}
        // } 
        if (typeof filters.type === 'string') {
            where.pokemon_v2_pokemonspecy.pokemon_v2_pokemons.pokemon_v2_pokemontypes = { pokemon_v2_type: { name: { _eq: filters.type } } };
        }
        // if (filters.sorting.sortby !== undefined && filters.sorting.sortdir !== undefined) {
        // 	orderby = {[filters.sorting.sortby]: filters.sorting.sortdir};
        // }
        let variables = {
            limit: filters.pagelimit,
            offset: filters.pagelimit * (filters.pagenum - 1),
            orderBy: { [filters.sorting.sortby]: filters.sorting.sortdir },
            where: where
        };
        //fetch all pokemons
        let data = yield fetch(pokeapi, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });
        let allpokes = yield data.json();
        // console.log(data)
        // flatten the "types" array out a bit.
        allpokes.data.getAllPokemon.forEach((pokemon) => {
            pokemon.types = pokemon.specy.allpokes[0].types.map((val) => val.type.typenames[0].name);
            delete pokemon.specy;
        });
        //return allpokes.data.getAllPokemon;
        return allpokes.data.getAllPokemon;
    });
}
//now get a single pokemon for details
function getPokemon(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `query getPokemon($where: pokemon_v2_pokemonspeciesname_bool_exp) {
    getPokemon: pokemon_v2_pokemonspeciesname(limit: 1, where: $where) {
      name
      id: pokemon_species_id
      specy: pokemon_v2_pokemonspecy {
        pokemon: pokemon_v2_pokemons(where: {is_default: {_eq: true}}) {
          height
          weight
          stats: pokemon_v2_pokemonstats {
            base_stat
            stat: pokemon_v2_stat {
              statnames: pokemon_v2_statnames(where: {language_id: {_eq: ${LANG_ID}}}) {
                statname: name
              }
            }
          }
          types: pokemon_v2_pokemontypes {
            type: pokemon_v2_type {
              typenames: pokemon_v2_typenames(where: {language_id: {_eq: ${LANG_ID}}}) {
                name
              }
            }
          }
        }
      }
    }
  }`;
        const variables = {
            where: {
                language_id: { _eq: filters.languageid },
                pokemon_species_id: { _eq: filters.id }
            }
        };
        //fetch pokemon details
        let data = yield fetch(pokeapi, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });
        let pokemon = yield data.json();
        pokemon = pokemon.data.getPokemon[0];
        // console.log(data)
        // get types
        pokemon.types = pokemon.specy.pokemon[0].types.map((val) => val.type.typenames[0].name);
        delete pokemon.specy;
        return pokemon;
    });
}
//call the functions
let allpokfilters = {
    pagelimit: 20,
    pagenum: 1,
    languageid: 9,
    type: 'psychic',
    sorting: { sortby: 'id', sortdir: 'asc' }
};
// call getAllPokemon with the filters provided
getAllPokemon(allpokfilters).then(allpokes => console.log(allpokes));
//details
let eachpokfilter = {
    id: 71,
    languageid: 9
};
// call getAllPokemon with the filters provided
//getPokemon(eachpokfilter).then(pokemon => console.log(pokemon))
