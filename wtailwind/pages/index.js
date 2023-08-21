import Layout from "../components/Layout";
import {useState} from "react";
import Pokemon from "../components/Pokemon";

export default function Home({initialPokemon}) {
    //console.log(initialPokemon)
    const [pokemon, setPokemon] = useState(initialPokemon)
    const [offset, setOffset] = useState(0)

    const fetchPokemon = async (url, next) => {
        const response = await fetch(url)
        const nextPokemon = await response.json()

        setOffset(next ? offset + 20: offset - 20)
        setPokemon(nextPokemon)
    }

    return (
        <Layout title={"Pokédex"}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {pokemon.results.map((monster, index) => (
                <Pokemon key={index} pokemon={monster} index={index + offset}/>
                ))}
            </div>

            <div className="mt-10 flex justify-center gap-10">
                <button disabled={!pokemon.previous} className="disabled:bg-gray-500 px-3 py-1" onClick={() => fetchPokemon(pokemon.previous, false)}>Prev</button>
                <button disabled={!pokemon.next} className="disable:bg-gray-500 px-3 py-1" onClick={() => fetchPokemon(pokemon.next, true)}>Next</button>
            </div>
        </Layout>
    )
}

export async function getStaticProps(context) {
    const response = await fetch ("https://pokeapi.co/api/v2/pokemon")
    const initialPokemon = await response.json()

    return {
        props: {
            initialPokemon
        }
    }
}