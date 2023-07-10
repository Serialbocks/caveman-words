import React from "react";
import { withRouter } from "../WithRouter";
import { socket } from "../../socket";
import './game-page.css';
import moment from 'moment';

class GamePage extends React.Component<{navigate: any, gameState: any}>
{
  private username: string | null;
  private timer: any = null;

  constructor(props: any) {
    super(props);
    this.username = localStorage.getItem('playerName');
  }

  readonly state: any = {
    card: null,
    timeRemainingString: null
  };

  componentDidMount() {
    socket.on('draw-card', (card) => this.onDrawCard(card, this));
  }

  componentWillUnmount() {
    socket.off('draw-card', (card) => this.onDrawCard(card, this));
  }

  componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    if(this.props.gameState?.currentTurn && !this.timer) {
      this.startTimer();
    } else if(!this.props.gameState?.currentTurn && this.timer) {
      clearInterval(this.timer);
    }
  }

  msToHMS( ms: number ) {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = Math.ceil(seconds % 60);

    let secondsStr = seconds.toString();
    if(seconds < 10) {
      secondsStr = '0' + seconds;
    }
    return `${minutes}:${secondsStr}`
  }

  startTimer() {
    let currentTurn = this.props.gameState?.currentTurn;
    if(!currentTurn) return;

    let roundTimeMs = this.props.gameState.turnTime * 1000;
    let startTime = moment().valueOf() - currentTurn.elapsed;

    this.timer = setInterval(() => {
      currentTurn = this.props.gameState?.currentTurn;
      if(!currentTurn) return;

      let timeElapsed = moment().valueOf() - startTime;

      let timeRemaining = roundTimeMs - timeElapsed;

      this.setState({ timeRemainingString: this.msToHMS(timeRemaining) });

      if(timeRemaining <= 0) {
        this.setState({ timeRemainingString: null, card: null });
        clearInterval(this.timer);
        this.props.gameState.currentTurn = null;
        socket.emit('get-game-state');
      }
    }, 100);
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
      return <div>{this.state.timeRemainingString}</div>;
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
            <div className="col-sm-4 center-container">
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