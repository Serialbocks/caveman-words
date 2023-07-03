import React from 'react';
import {MOCK_GAMES} from './MockGames';
import { Game } from './Game';
import "./game.css";

import { uniqueNamesGenerator, adjectives, animals, Config } from 'unique-names-generator';

const characterConfig: Config = {
    dictionaries: [adjectives, adjectives, animals],
      length: 3,
      separator: '',
      style: 'capital'
    };

class GamesPage extends React.Component
{
  public GamesPage() {
  }

  readonly state: any = {
    playerName: this.getPlayerName()
  };

  getPlayerName() {
    var currentName = localStorage.getItem("playerName");
    if(!currentName) {
      currentName = uniqueNamesGenerator(characterConfig);
      localStorage.setItem("playerName", currentName);
    }

    return currentName;
  }

  setPlayerName(name: string) {
    localStorage.setItem("playerName", name);
    this.setState({playerName: name});
  }

  GameList({ games }: any) {
    const gameListItems = games.map((game: Game) => (
      <>
        <div className="row">
          <div className="col-sm-12">
            <div className = "card fluid">
              <h2 className="doc">{game.name}</h2>
              <p className="doc">Players: {game.playerCount}/{game.capacity}</p>
            </div>
          </div>
        </div>
      </>
    ), this);
    return gameListItems;
  }

  render() {
    return (
      <>
        <div className="row">
          <div className="col-sm-4 align-center">
              <label htmlFor="playerName">Player Name</label>
          </div>
          <div className="col-sm-8">
              <input value={this.state.playerName} type="text" id="playerName" onChange={(e)=>{this.setPlayerName(e.target.value)}} />
          </div>
        </div>

        <h1>Games</h1>
        <this.GameList games={MOCK_GAMES} />
        <div className="flex-container">
          <a href={`/create`}><button className="primary" style={{width: "183px"}}>Create Game</button></a>
        </div>
      </>
    );
  }

}

export default GamesPage;