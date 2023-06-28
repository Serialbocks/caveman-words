import React from 'react';
import {MOCK_GAMES} from './MockGames';
import { createRoot } from 'react-dom/client';
import { Game } from './Game';

class GamesPage extends React.Component
{
  readonly state: any = {
    count: 0
  };

  GameList({ games }: any) {
    const gameListItems = games.map((game: Game) => (
      <li key={game.id}>{game.name} {game.playerCount}/{game.capacity}</li>
    ));
    return <ul>{gameListItems}</ul>;
  }

  render() {
    return (
      <>
        <h1>Games</h1>
        <pre>{JSON.stringify(MOCK_GAMES, null, ' ')}</pre>
        <this.GameList games={MOCK_GAMES} />

        <h2>Counter state: {this.state.count}</h2>
        <span id="inc-count" 
          title="Increment Count"
          onClick={() => this.incrementCounter()}>Click to increment</span>
      </>
    );
  }

  incrementCounter() {
    this.state.count++;
    this.setState(this.state);
  }
}


/*
class Greeter extends React.Component<{ name?: string }> {
  render() {
    return <h1>Hello {this.props.name}</h1>;
  }
}

createRoot(document.getElementById('root')!).render(<Greeter name="John" />);
*/

export default GamesPage;