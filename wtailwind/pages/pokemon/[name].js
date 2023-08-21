import React from 'react';
import Layout from '../../components/Layout';
import Image from "next/image";

const Pokemon = ({pokemon}) => {
	const pokeIndex = ('000' + (pokemon.id)).slice(-3)
	const pokeName = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
	const renderTypes = () => (
		pokemon.types.map(type => (
			<li key={type.slot} className="px-2 py-2 bg-slate-200 rounded">
				<span className="capitalize">{type.type.name}</span>
			</li>
			)
		)

	)

	const renderStats = () => (
		pokemon.stats.map((stat, index) => (
			<div key={index} className="bg-white my-1 rounded p-1">
				{stat.base_stat}
			</div>
			)

		)
	)

	return (
		<Layout title={pokeName}>
			<div className="flex flex-col justify-center items-center">
				<Image 
					alt={pokemon.name}
					width={400}
					height={410}
					src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeIndex}.png`}
				/>
				<span>#{pokeIndex}</span>
			</div>

			<div className="rounded p-5">
				<ul>
					{renderTypes()}
				</ul>

				<div className="bg-slate-100">
					{renderStats()}
				</div>
			</div>

		</Layout>
	);

};

export default Pokemon;

export async function getServerSideProps(context) {
    const response = await fetch (`https://pokeapi.co/api/v2/pokemon/${context.query.name}`)
    const pokemon = await response.json()

    return {
        props: {
            pokemon
        }
    }
}