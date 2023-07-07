import React from 'react';
import {MOCK_GAMES} from './MockGames';
import { Game } from './Game';
import "./game.css";
import { uniqueNamesGenerator, adjectives, animals, Config } from 'unique-names-generator';
import { withRouter } from '../WithRouter';

const characterConfig: Config = {
    dictionaries: [adjectives, adjectives, animals],
      length: 3,
      separator: '',
      style: 'capital'
    };

class GamesPage extends React.Component<{navigate: any}>
{
  constructor(props: any) {
    super(props);
    this.createGame=this.createGame.bind(this);
    this.GameList=this.GameList.bind(this);
  }

  readonly state: any = {
    playerName: this.getPlayerName(),
    error: ''
  };

  getPlayerName() {
    var currentName = localStorage.getItem("playerName");
    if(!currentName) {
      currentName = uniqueNamesGenerator(characterConfig);
    }

    return currentName;
  }

  setPlayerName(name: string) {
    localStorage.setItem("playerName", name);
    this.setState({playerName: name});
  }

  joinGame(game: Game) {
    this.props.navigate("/game");
  }

  GameList({ games }: any) {
    const gameListItems = games.map((game: Game) => (
      <>
        <div className="row">
          <div className="col-sm-12">
            <div className="card fluid" onClick={() => this.joinGame(game)}>
              <h2 className="doc">{game.name}</h2>
              <p className="doc">Players: {game.playerCount}/{game.capacity}</p>
            </div>
          </div>
        </div>
      </>
    ), this);
    return gameListItems;
  }

  createGame() {
    if(!this.state.playerName) {
      this.setState({error: "Please enter a Player Name."});
      return;
    }

    this.props.navigate("/create");
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

        <div className="row">
                <div className="error col-sm-12">{this.state.error}</div>
            </div>
        <div className="flex-container">
          <button className="primary" style={{width: "183px"}} onClick={this.createGame}>Create Game</button>
        </div>
      </>
    );
  }

}

export default withRouter(GamesPage);