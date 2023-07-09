import React from "react";
import { withRouter } from "../WithRouter";
import { socket } from "../../socket";
import './game-page.css';

class GamePage extends React.Component<{navigate: any, gameState: any}>
{
  private username: string | null;

  constructor(props: any) {
    super(props);
    this.username = localStorage.getItem('playerName');
  }

  readonly state: any = {
    card: null
  };

  componentDidMount() {
    socket.on('draw-card', (card) => this.onDrawCard(card, this));
  }

  componentWillUnmount() {
    socket.off('draw-card', (card) => this.onDrawCard(card, this));
  }

  onDrawCard(card: any, self: any) {
    self.setState({ card: card });
  }

  drawCard(points: number) {
    socket.emit('draw-card', points);
  }

  takeTurn() {
    socket.emit('take-turn');
  }

  isOnTeam() {
    if(!this.props.gameState) return false;
    if(this.props.gameState.spectating.indexOf(this.username) >= 0) {
      return false;
    }

    return true;
  }

  joinTeam(teamName: string) {
    socket.emit('join-team', teamName);
  }

  render() {
    let wordCardUI = () => {
      return (
        <>
          <div className="center-container">
            <div className="card game-card">
              <h2 className="word">{this.state.card.word1}</h2>
              <hr />
              <h2 className="word">{this.state.card.word2}</h2>
            </div>
          </div>
          <div className="center-container">
            <button onClick={() => this.drawCard(3)}>+3</button>
            <button onClick={() => this.drawCard(1)}>+1</button>
            <button onClick={() => this.drawCard(-1)}>-1</button>
            <button onClick={() => this.drawCard(0)}>Skip</button>
          </div>
        </>
      );
    };

    let takeTurnUI = () => {
      return <button onClick={() => this.takeTurn()}>Take Turn</button>;
    };

    let timerUI = () => {
      return '';
    }

    let teamListUI = (players: any[]) => {
      const playerListItems = players.map((player: any) => (
        <>
          <div style={{margin: '5px'}} key={player}>
            {player}
          </div>
        </>
      ), this);
      return playerListItems;
    }

    let chooseTeamUI = () => {
      return (
        <>
          <div className="center-container">
            <h3>Choose a team</h3>
          </div>

          <div className="row">
            <div style={{flexDirection: 'column'}} className="col-sm-4">
              <button onClick={() => this.joinTeam('teamMad')}>Join Team Mad</button>
              {teamListUI(this.props.gameState.teamMad)}
            </div>
            <div className="col-sm-4"></div>
            <div style={{justifyContent: 'flex-end', flexDirection: 'column'}} className="col-sm-4">
              <button onClick={() => this.joinTeam('teamGlad')}>Join Team Glad</button>
              {teamListUI(this.props.gameState.teamGlad)}
            </div>
          </div>
        </>
      );
    }

    let mainUI = () => {
      return (
        <>
          <div className="row top-row">
            <div className="col-sm-4">
              <div className="card">
                <h5>Team Mad</h5>
                <hr />
                {teamListUI(this.props.gameState.teamMad)}
              </div>
            </div>
            <div className="col-sm-4">
              {this.props.gameState.currentTurn ? timerUI() : takeTurnUI()}
            </div>
            <div className="col-sm-4">
              <div className="card">
                <h5>Team Glad</h5>
                <hr />
                {teamListUI(this.props.gameState.teamGlad)}
              </div>
            </div>
          </div>

          {this.state.card ? wordCardUI() : ''}
        </>
      );
    }

    if(!this.props.gameState) {
      return (
        <>
          <h4>Joining game...</h4>
        </>
      );
    }

    return (
      <>
        {this.isOnTeam() ? mainUI() : chooseTeamUI()}
      </>
    );
  }
}

export default withRouter(GamePage);