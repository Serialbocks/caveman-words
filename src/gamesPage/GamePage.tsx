import React from 'react';
import {MOCK_GAMES} from './MockGames';
import { createRoot } from 'react-dom/client';
import { Game } from './Game';

class GamesPage extends React.Component
{
  public GamesPage() {
  }

  readonly state: any = {
    count: 0
  };

  GameList({ games }: any) {
    const gameListItems = games.map((game: Game) => (
      <li key={game.id}>{game.name} {game.playerCount}/{game.capacity}</li>
    ), this);
    return <ul>{gameListItems}</ul>;
  }

  render() {
    return (
      <>
        <h1>Games</h1>
        <this.GameList games={MOCK_GAMES} />

        <h2>Counter state: {this.state.count}</h2>
        <button onClick={() => this.incrementCounter()}>Increment</button>
      </>
    );
  }

  incrementCounter() {
    this.state.count++;
    this.setState(this.state);
  }
}

export default GamesPage;