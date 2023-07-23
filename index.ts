//get data from
const pokeapi = 'https://beta.pokeapi.co/graphql/v1beta';
//main variable
const LANG_ID = 9;

interface Pokemon {
	name: string;
	id: number;
	types: string[];
  specy: any;
}


//filter variables
interface Sorting {
	sortby: 'id' | 'name';
	sortdir: 'asc' | 'dsc'
}
interface Typefilter {
	type: 'number' | 'string';
}

// interface Typenames {
//   name: string;
// }

interface pokTypes {
  type: {
    typenames: {
      name: string;
    }[];
  }
}

interface Eachpokfilter {
	id: number;
	name?: string;
  languageid: number;
}

interface Allpokfilters {
	pagelimit: number;
	pagenum: number;
	languageid: number;
	type: string;
	sorting: Sorting;
}

//functions
async function getAllPokemon(filters: Allpokfilters): Promise<Pokemon[]> {
  // qry to get data from api, 
  const query: string = `
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
  let where: any = {
    language_id: {_eq: filters.languageid},
    pokemon_v2_pokemonspecy: {
      pokemon_v2_pokemons: {
        is_default: {_eq: true}
      }
    }
  };

  // add type if any to where variable
  // if (typeof filters.type === 'number' && filters.type > 0) {
  //   where.pokemon_v2_pokemonspecy.pokemon_v2_pokemons.pokemon_v2_pokemontypes = {pokemon_v2_type: {name: {_eq: filters.type}}}
  // } 

  if (typeof filters.type === 'string') {
  	where.pokemon_v2_pokemonspecy.pokemon_v2_pokemons.pokemon_v2_pokemontypes = {pokemon_v2_type: {name: {_eq: filters.type}}}
  }
  
  // if (filters.sorting.sortby !== undefined && filters.sorting.sortdir !== undefined) {
  // 	orderby = {[filters.sorting.sortby]: filters.sorting.sortdir};
  // }
  let variables = {
    limit: filters.pagelimit,
    offset: filters.pagelimit * (filters.pagenum - 1),
    orderBy: {[filters.sorting.sortby]: filters.sorting.sortdir},
    where: where
  };
  
  //fetch all pokemons
  let data: Response = await fetch(pokeapi, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  })

  let allpokes = await data.json();
  // console.log(data)
  // flatten the "types" array out a bit.
  allpokes.data.getAllPokemon.forEach((pokemon: Pokemon) => {
    pokemon.types = pokemon.specy.allpokes[0].types.map((val: pokTypes) => val.type.typenames[0].name);
    delete pokemon.specy;
  });
  //return allpokes.data.getAllPokemon;
  return allpokes.data.getAllPokemon
}

//now get a single pokemon for details
async function getPokemon(filters: Eachpokfilter): Promise<Pokemon[]> {
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
      language_id: {_eq: filters.languageid},
      pokemon_species_id: {_eq: filters.id}
    }
  };

//fetch pokemon details
  let data: Response = await fetch(pokeapi, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  })


  let pokemon = await data.json();
  pokemon = pokemon.data.getPokemon[0];
  // console.log(data)
  // get types
  pokemon.types = pokemon.specy.pokemon[0].types.map((val: pokTypes) => val.type.typenames[0].name);
  delete pokemon.specy;

  return pokemon
}

//call the functions
let allpokfilters: Allpokfilters = {
  pagelimit: 20,
  pagenum: 1,
  languageid: 9,
  type: 'psychic',
  sorting: {sortby: 'id', sortdir: 'asc'}
}
// call getAllPokemon with the filters provided
getAllPokemon(allpokfilters).then(allpokes => console.log(allpokes))

//details
let eachpokfilter: Eachpokfilter = {
  id: 71,
  languageid: 9
}
// call getAllPokemon with the filters provided
//getPokemon(eachpokfilter).then(pokemon => console.log(pokemon))