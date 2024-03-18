import React, { useState, useEffect } from 'react';
import './style.css';

const LIMIT = 20;

function PokemonList() {
  const [offset, setOffset] = useState(0);
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${LIMIT}`);
        const data = await response.json();
        setPokemonList(data.results);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [offset]);

  const handleNextPageClick = () => {
    setOffset(prevOffset => prevOffset + LIMIT);
  };

  const handlePrevPageClick = () => {
    setOffset(prevOffset => Math.max(0, prevOffset - LIMIT));
  };

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '40%',

  };

  const cellStyle = {
    border: '1px solid black', 
    textAlign: 'center', 
    padding: '8px', 
  }

  const handleViewDetail = async (pokemonUrl) => {
    try {
      const response = await fetch(pokemonUrl);
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.error("Error fetching pokemon details: ", error);
    }
  };

  return (
    <div className="container">
      <div className="pokemon-list">
      <table style={tableStyle}>
        <h1>Pokemon</h1>
        <ul style={cellStyle} className="pokemon-grid">
          {pokemonList.map(pokemon => (
            <li style={cellStyle} key={pokemon.name}>
              <div><span >{pokemon.name}</span></div>
              <div><img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.url)}.png`} alt={pokemon.name} /></div>
              <button onClick={() => handleViewDetail(pokemon.url)}>View Detail</button>
            </li>
          ))}
          
          <div className="bottonPre">
            <button onClick={handlePrevPageClick} disabled={offset === 0}>Previous Page</button>
          </div>
          <div className="bottonNext">
            <button onClick={handleNextPageClick}>Next Page</button>
            </div>
        </ul>
        </table>
      </div>
      
      <div className={`pokemon-details-container ${selectedPokemon ? 'active' : ''}`}>
      {selectedPokemon && (
        <div className="pokemon-details">
          <h2>{selectedPokemon.name}</h2>
          <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
          <p>Hp: {selectedPokemon.stats.find(stat => stat.stat.name === 'hp').base_stat}</p>
          <p>Attack: {selectedPokemon.stats.find(stat => stat.stat.name === 'attack').base_stat}</p>
          <p>Defense:{selectedPokemon.stats.find(stat => stat.stat.name === 'defense').base_stat}</p>
          <p>Special Attack: {selectedPokemon.stats.find(stat => stat.stat.name === 'special-attack').base_stat}</p>
          <p>Special Defense: {selectedPokemon.stats.find(stat => stat.stat.name === 'special-defense').base_stat}</p>
          <h3>Abilities:</h3>
          <ul>
            {selectedPokemon.abilities.map((ability, index) => (
              <li key={index}>{ability.ability.name}</li>
            ))}
          </ul>
          <button onClick={() => setSelectedPokemon(null)}>Close Details</button>
        </div>
      )}
      </div>
      </div>
  );
  
  function getPokemonId(url) {
    const parts = url.split("/");
    return parts[parts.length - 2];
  }
}

export default PokemonList;
 