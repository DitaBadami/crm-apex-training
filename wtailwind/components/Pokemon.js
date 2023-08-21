import React from 'react';
import Image from "next/image";
import Link from "next/link";

const Pokemon = ({pokemon, index}) => {
	const pokeIndex = ('000' + (index + 1)).slice(-3)

	return (
		<Link href={`/pokemon/${pokemon.name}`}>
			<a>
				<div className="bg-slate-200 rounded p-5 text-black flex-col justify-center items-center relative">
					<span className="capitalize absolute top-2 left-3 font-bold">{pokemon.name}</span>
					<Image 
						alt={pokemon.name}
						width={100}
						height={110}
						src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeIndex}.png`}
					/>
					<span className="absolute text-slate-500 bottom-2 left-3">#{pokeIndex}</span>
		            
		        </div>
	        </a>
        </Link>
	);
};


export default Pokemon;