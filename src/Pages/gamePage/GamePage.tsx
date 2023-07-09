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

  drawCard() {
    socket.emit('draw-card');
  }

  wordCard() {
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
          <button onClick={() => this.drawCard()}>Skip</button>
        </div>
      </>
    );
  }

  render() {
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
            <div className="col-sm-2">
              <button>Take Turn</button>
            </div>
            <div className="col-sm-2">
              Timer
            </div>
            <div className="col-sm-4">
              <div className="card">
                <h5>Team Glad</h5>
                <hr />
              </div>
            </div>
          </div>

          {this.state.card ? this.wordCard() : ''}
        </>
      );
  }
}

export default withRouter(GamePage);