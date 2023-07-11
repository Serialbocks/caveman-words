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
      this.timer = null;
      this.setState({ card: null });
    }
  }

  msToHMS( ms: number ) {
    ms = ms + 1000;
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = Math.floor(seconds % 60);

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

  endTurn() {
    socket.emit('end-turn');
  }

  render() {
    let wordCardUI = (card: any) => {
      return (
        <>
          <h3>{this.props.gameState?.currentTurn?.player ? `${this.props.gameState.currentTurn.player}'s turn` : ''}</h3>
          <div className="center-container">
            <div className="card game-card">
              <h2 className="word">{card.word1}</h2>
              <hr />
              <h2 className="word">{card.word2}</h2>
            </div>
          </div>
        </>
      );
    };

    let myTurnUI = (card: any) => {
      return (
        <>
          {wordCardUI(card)}
          <div className="center-container">
            <button onClick={() => this.drawCard(3)}>+3</button>
            <button onClick={() => this.drawCard(1)}>+1</button>
            <button onClick={() => this.drawCard(-1)}>-1</button>
            <button onClick={() => this.drawCard(0)}>Skip</button>
            <button onClick={() => this.endTurn()}>End Turn</button>
          </div>
        </>
      );
    }

    let takeTurnUI = () => {
      return <button onClick={() => this.takeTurn()}>Take Turn</button>;
    };

    let timerUI = () => {
      return <div>{this.state.timeRemainingString}</div>;
    }

    let teamListUI = (players: any[]) => {
      const playerListItems = players.map((player: any, i) => (
        <React.Fragment key={player}>
          <div style={{margin: '5px'}} key={i}>
            {player}
          </div>
        </React.Fragment>
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

    let cardUI = () => {
      if(this.state.card) {
        return myTurnUI(this.state.card);
      }

      if(this.props.gameState?.currentCard) {
        return wordCardUI(this.props.gameState?.currentCard);
      }
    };

    let teamName = (internalName: string) => {
      if(internalName == 'teamMad') return 'Team Mad';
      if(internalName == 'teamGlad') return 'Team Glad';
      return '';
    };

    let turnPoints = (turn: any) => {
      return (3 * turn.three.length) + (turn.one.length) + (-1 * turn.minusOne.length);
    };

    let teamPoints = (team: string) => {
      let points = 0;
      if(!this.props.gameState?.pastTurns) return points;

      for(let i = 0; i < this.props.gameState.pastTurns.length; i++) {
        let turn = this.props.gameState.pastTurns[i];
        if(turn.team == team) {
          points += turnPoints(turn);
        }
      }

      return points;
    }

    let cardList = (cards: any[]) => {
      return cards.map(card => (
          <React.Fragment key={card.word1+card.word2}>
            <div>{`${card.word1}/${card.word2}`}</div>
          </React.Fragment>
        ));
    }

    let turnUI = (turn: any, roundNumber: number, isCurrent = false) => {
      return (
        <>
          <div style={{maxWidth: 'none'}} className="card">
            <div className="row">
              <div className="col-sm-8">
                <h4>Round {roundNumber} {isCurrent ? '(current)' : ''} - {turn.player} - {teamName(turn.team)}</h4>
              </div>
              <div className="col-sm-4 right-container">
                <h5>Points: {turnPoints(turn)}</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3 card no-margin">
                <h5>+3</h5>
                {turn.three.length ? <hr /> : ''}
                {cardList(turn.three)}
              </div>
              <div className="col-sm-3 card no-margin">
                <h5>+1</h5>
                {turn.one.length ? <hr /> : ''}
                {cardList(turn.one)}
              </div>
              <div className="col-sm-3 card no-margin">
                <h5>-1</h5>
                {turn.minusOne.length ? <hr /> : ''}
                {cardList(turn.minusOne)}
              </div>
              <div className="col-sm-3 card no-margin">
                <h5>skipped</h5>
                {turn.skipped.length ? <hr /> : ''}
                {cardList(turn.skipped)}
              </div>
            </div>
          </div>
        </>
      );
    };

    let currentTurnUI = () => {
      if(this.props.gameState?.currentTurn) {
        let roundNumber = this.props.gameState.pastTurns.length + 1;
        return turnUI(this.props.gameState?.currentTurn, roundNumber, true);
      }
      return '';
    }

    let roundHistoryUI = () => {
      let pastTurns: any[] = this.props.gameState.pastTurns;
      return pastTurns.map((turn: any, i) => (
        <React.Fragment key={`Round-${i}`}>
          {turnUI(turn, pastTurns.length - i)}
        </React.Fragment>
      ));
    }

    let mainUI = () => {
      return (
        <>
          <div className="row top-row">
            <div className="col-sm-4">
              <div className="card">
                <h5>Team Mad</h5>
                <div style={{marginLeft: '8px'}}>Points: {teamPoints('teamMad')}</div>
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
                <div style={{marginLeft: '8px'}}>Points: {teamPoints('teamGlad')}</div>
                <hr />
                {teamListUI(this.props.gameState.teamGlad)}
              </div>
            </div>
          </div>

          {cardUI()}
          {currentTurnUI()}
          {this.props.gameState?.pastTurns?.length ? <h4>Round History</h4> : ''}
          {roundHistoryUI()}
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