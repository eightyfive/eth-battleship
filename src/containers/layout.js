import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
//
import Game from "components/game";
import * as sel from "data/selectors";

class Layout extends Component {
  _showGame = gameId => {
    this.props.getGame(gameId);
    this.props.history.push(`/games/${gameId}`);
  };

  render() {
    const { children, myGames, openGames } = this.props;

    return (
      <div className="container u-cf">
        <div className="u-fl" style={{ width: 501 }}>
          {children}
        </div>
        <div style={{ marginLeft: 525 }}>
          <div className="u-mb">
            <h3>My games</h3>
            <p>
              <Link to="/">Create new game</Link>
            </p>
            {myGames.length === 0 && <p>No games</p>}
            {myGames.map(game => (
              <Game key={game.id} {...game} onClick={this._showGame} />
            ))}
          </div>

          <div className="u-mb">
            <h3>Open games</h3>
            {openGames.length === 0 && <p>No open games</p>}
            {openGames.map(game => (
              <Game key={game.id} {...game} onClick={this._showGame} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

// @connect
const state = state => ({
  myGames: sel.getMyGames(state),
  openGames: sel.getOpenGames(state)
});

const actions = ({ games }) => ({
  getGame: games.getGame,
  joinGame: games.joinGame
});

export default connect(
  state,
  actions
)(Layout);
