import React, { useEffect } from 'react';
import './create-game-page.css';
import { uniqueNamesGenerator, adjectives, animals, Config } from 'unique-names-generator';
import { withRouter } from '../WithRouter';
import { socket } from '../../socket';

const characterConfig: Config = {
    dictionaries: [adjectives, adjectives, animals],
      length: 3,
      separator: '',
      style: 'capital'
    };

class CreateGamePage extends React.Component<{navigate: any}>
{
    public CreateGamePage() {
        this.back=this.back.bind(this);
    }
  
    readonly state: any = {
        name: uniqueNamesGenerator(characterConfig),
        capacity: '16',
        password: '',
        turnTime: '90',
        useBaseGame: true,
        useExpansion: true,
        useNSFW: false,
        useAIGeneratedWords: false,
        error: ''
    };

    componentDidMount() {
        socket.on('game-created', (game) => this.onGameCreated(game, this));
    }

    componentWillUnmount() {
        socket.off('game-created', (game) => this.onGameCreated(game, this));
    }

    createGame() {
        if(!this.state.name) {
            this.setState({error: "Name is required."});
            return;
        }

        if(!this.state.capacity) {
            this.setState({error: "Max players is required."});
            return;
        }

        if(!this.state.useBaseGame &&
            !this.state.useExpansion &&
            !this.state.useNSFW &&
            !this.state.useAIGeneratedWords) {
                this.setState({error: "Select at least one card set."});
                return;
            }

        this.state.maxPlayers = parseInt(this.state.maxPlayers);

        if(this.state.maxPlayers < 2) {
            this.setState({error: "Max players must be at least 2."});
            return;
        }

        if(!this.state.turnTime) {
            this.setState({error: "Turn Time is required."});
            return;
        }

        this.state.turnTime = parseInt(this.state.turnTime);

        this.setState({error: ''});
        
        socket.emit('create-game', this.state);
    }

    back() {
        this.props.navigate('/');
    }

    onGameCreated(game: any, self: any) {
        socket.emit('join-game', self.state.name, self.state.password );
        self.props.navigate('/game');
    }

    render() {
        return (
          <>
            <h1>Create Game</h1>

            <div className="row">
                <div className="col-sm-6 align-center">
                    <label htmlFor="gameName">Game Name</label>
                </div>
                <div className="col-sm-6">
                    <input value={this.state.name} type="text" id="gameName" onChange={(e)=>{this.setState({name: e.target.value})}} />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-6 align-center">
                    <label htmlFor="capacity">Max Players</label>
                </div>
                <div className="col-sm-6">
                    <input value={this.state.capacity} type="number" step="1" min="2" max="32" id="capacity" onChange={(e)=>{this.setState({capacity: e.target.value})}} />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-6 align-center">
                    <label htmlFor="password">Password</label>
                </div>
                <div className="col-sm-6">
                    <input value={this.state.password} type="password" id="password" placeholder="(optional)" onChange={(e)=>{this.setState({password: e.target.value})}} />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-6 align-center">
                    <label htmlFor="turnTime">Turn Time (s)</label>
                </div>
                <div className="col-sm-6">
                    <input value={this.state.turnTime} type="number" id="turnTime" min="30" onChange={(e)=>{this.setState({turnTime: e.target.value})}} />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-6 align-center">
                    <label htmlFor="useBaseWords">Base Game</label>
                </div>
                <div className="col-sm-6">
                    <input checked={this.state.useBaseGame} type="checkbox" id="useBaseWords" onChange={(e)=>{this.setState({useBaseGame: !this.state.useBaseGame})}} />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-6 align-center">
                    <label htmlFor="useExpansion">Expansion</label>
                </div>
                <div className="col-sm-6">
                    <input checked={this.state.useExpansion} type="checkbox" id="useExpansion" onChange={(e)=>{this.setState({useExpansion: !this.state.useExpansion})}} />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-6 align-center">
                    <label htmlFor="useNSFW">NSFW</label>
                </div>
                <div className="col-sm-6">
                    <input checked={this.state.useNSFW} type="checkbox" id="useNSFW" onChange={(e)=>{this.setState({useNSFW: !this.state.useNSFW})}} />
                </div>
            </div>

            {/*<div className="row">
                <div className="col-sm-6 align-center">
                    <label htmlFor="useAIGeneratedWords">A.I. Cards</label>
                </div>
                <div className="col-sm-6">
                    <input checked={this.state.useAIGeneratedWords} type="checkbox" id="useAIGeneratedWords" onChange={(e)=>{this.setState({useAIGeneratedWords: !this.state.useAIGeneratedWords})}} />
                </div>
            </div>*/}

            <div className="row">
                <div className="error col-sm-12">{this.state.error}</div>
            </div>

            <div className="row">
                <div className="col-sm-6">
                    <button onClick={() => this.createGame()} className="primary" style={{width: "100%"}}>Create</button>
                </div>
                <div className="col-sm-6">
                    <button onClick={() => this.back()} style={{width: "100%"}}>Cancel</button>
                </div>
            </div>
          </>
        );
    }
}

export default withRouter(CreateGamePage);