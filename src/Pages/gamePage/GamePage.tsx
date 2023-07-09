import React from "react";
import { withRouter } from "../WithRouter";
import { socket } from "../../socket";
import './game-page.css';

class GamePage extends React.Component<{navigate: any, gameState: any}>
{
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

    if(!this.props.gameState) {
      return (
        <>
          <h4>Joining game...</h4>
        </>
      );
    }

    return (
      <>
        <div className="row top-row">
          <div className="col-sm-4">
            <div className="card">
              <h5>Team Mad</h5>
              <hr />
            </div>
          </div>
          <div className="col-sm-4">
            {this.props.gameState.currentTurn ? timerUI() : takeTurnUI()}
          </div>
          <div className="col-sm-4">
            <div className="card">
              <h5>Team Glad</h5>
              <hr />
            </div>
          </div>
        </div>

        {this.state.card ? wordCardUI() : ''}
      </>
    );
  }
}

export default withRouter(GamePage);