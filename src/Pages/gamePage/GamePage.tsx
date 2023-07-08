import React from "react";
import { withRouter } from "../WithRouter";

class GamePage extends React.Component<{navigate: any, gameState: any}>
{
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
          </>
        );
    }
}

export default withRouter(GamePage);