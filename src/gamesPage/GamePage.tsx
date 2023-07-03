import React from 'react';
import {MOCK_GAMES} from './MockGames';
import { Game } from './Game';
import "./game.css";

class GamesPage extends React.Component
{
  public GamesPage() {
  }

  readonly state: any = {};

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
        <h1>Games</h1>
        <this.GameList games={MOCK_GAMES} />
        <div className="flex-container">
          <a href={`/create`}><button style={{width: "183px"}}>Create Game</button></a>
        </div>
      </>
    );
  }

}

export default GamesPage;