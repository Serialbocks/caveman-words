import React from 'react';
import './create-game-page.css';

class CreateGamePage extends React.Component
{
    public CreateGamePage() {
    }
  
    readonly state: any = {
        name: '',
        maxPlayers: 16,
        password: '',
        useBaseGame: true,
        useExpansion: true,
        useNSFW: false,
        useAIGeneratedWords: false,
    };

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
                    <label htmlFor="useBaseWords">Base Game</label>
                </div>
                <div className="col-sm-6">
                    <input checked={this.state.useBaseGame} type="checkbox" id="useBaseWords" onChange={(e)=>{this.setState({useBaseGame: e.target.value})}} />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-6 align-center">
                    <label htmlFor="useExpansion">Expansion</label>
                </div>
                <div className="col-sm-6">
                    <input checked={this.state.useExpansion} type="checkbox" id="useExpansion" onChange={(e)=>{this.setState({useExpansion: e.target.value})}} />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-6 align-center">
                    <label htmlFor="useNSFW">NSFW</label>
                </div>
                <div className="col-sm-6">
                    <input checked={this.state.useNSFW} type="checkbox" id="useNSFW" onChange={(e)=>{this.setState({useNSFW: e.target.value})}} />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-6 align-center">
                    <label htmlFor="useAIGeneratedWords">AI Cards</label>
                </div>
                <div className="col-sm-6">
                    <input checked={this.state.useAIGeneratedWords} type="checkbox" id="useAIGeneratedWords" onChange={(e)=>{this.setState({useAIGeneratedWords: e.target.value})}} />
                </div>
            </div>

            <div className="row">
                <div className="col-sm-6">
                    <button className="primary" style={{width: "100%"}}>Create</button>
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