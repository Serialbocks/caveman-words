import React from 'react';
import './create-game-page.css';
import { uniqueNamesGenerator, adjectives, animals, Config } from 'unique-names-generator';

const characterConfig: Config = {
    dictionaries: [adjectives, adjectives, animals],
      length: 3,
      separator: '',
      style: 'capital'
    };

class CreateGamePage extends React.Component
{
    public CreateGamePage() {
    }
  
    readonly state: any = {
        name: uniqueNamesGenerator(characterConfig),
        maxPlayers: '16',
        password: '',
        turnTime: '90',
        useBaseGame: true,
        useExpansion: true,
        useNSFW: false,
        useAIGeneratedWords: false,
        error: ''
    };

    createGame() {
        if(!this.state.name) {
            this.setState({error: "Name is required."});
            return;
        }

        if(!this.state.maxPlayers) {
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
        
        console.log(this.state);
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
                    <label htmlFor="maxPlayers">Max Players</label>
                </div>
                <div className="col-sm-6">
                    <input value={this.state.maxPlayers} type="number" step="1" min="2" max="32" id="maxPlayers" onChange={(e)=>{this.setState({maxPlayers: e.target.value})}} />
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
                    <a style={{width: "100%"}} href={`/`}><button style={{width: "100%"}}>Cancel</button></a>
                </div>
            </div>
          </>
        );
      }
}

export default CreateGamePage;