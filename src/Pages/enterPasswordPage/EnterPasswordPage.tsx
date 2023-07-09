import React from "react";
import { withRouter } from "../WithRouter";
import { socket } from "../../socket";

class EnterPasswordPage extends React.Component<{navigate: any, gameName: string}>
{
    readonly state: any = {
        password: '',
        error: ''
    };

    componentDidMount() {
        socket.on('wrong-password', () => this.onWrongPassword(this));
        socket.on('sync-game-state', () => this.onSyncGameState(this));
    }

    componentWillUnmount() {
        socket.off('wrong-password', () => this.onWrongPassword(this));
        socket.off('sync-game-state', () => this.onSyncGameState(this));
    }

    onSyncGameState(self: any) {
        self.props.navigate('/game');
    }

    onWrongPassword(self: any) {
        self.setState({ error: 'Wrong password' });
    }

    submit() {
        socket.emit('join-game', this.props.gameName, this.state.password);
    }

    back() {
        this.props.navigate('/');
    }

    handleKeyPress(event: any) {
        if(event.key === 'Enter'){
            this.submit();
        }
    }

    render() {
        return (
          <>
            <div className="row">
              <div className="col-sm-4 align-center">
                  <label htmlFor="playerName">Password</label>
              </div>
              <div className="col-sm-8">
                  <input value={this.state.password} type="password" id="playerName"
                    onChange={(e) => this.setState({password: e.target.value, error: ''})}
                    onKeyDown={(e) => this.handleKeyPress(e)} />
              </div>
            </div>

            <div className="row">
                <div className="error col-sm-12">{this.state.error}</div>
            </div>

            <div className="row">
                <div className="col-sm-6">
                    <button onClick={() => this.submit()} className="primary" style={{width: "100%"}}>Submit</button>
                </div>
                <div className="col-sm-6">
                    <button onClick={() => this.back()} style={{width: "100%"}}>Cancel</button>
                </div>
            </div>
          </>
        );
    }
}

export default withRouter(EnterPasswordPage);