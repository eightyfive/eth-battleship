import React, { Component } from "react";
import { connect } from "react-redux";
//
import * as Bs from "utils/battleship";
import * as sel from "data/selectors";
import Layout from "containers/layout";
import Grid from "components/grid";
import Alert from "components/alert";

class GameShow extends Component {
  state = {
    ships: []
  };

  componentDidMount() {
    const { game, match } = this.props;

    if (!game) {
      this.props.getGame(parseInt(match.params.game, 10));
    }
  }

  _joinGame = ev => {
    const { game } = this.props;
    const { ships } = this.state;

    this.props.joinGame({ gameId: game.id, ships });
  };

  _randomize = ev => {
    const { game } = this.props;

    this.setState({
      ships: Bs.createGrid(game.gridSize)
    });
  };

  getShips() {
    if (this.state.ships.length) {
      return this.state.ships;
    }

    return this.props.ships || [];
  }

  render() {
    const { history, account, game, target, ocean, attack } = this.props;

    if (!game) {
      return this.renderLoading();
    }

    const ships = this.getShips();
    const status = Bs.getStatus(game.status);

    const open = game.status === 0;
    const finished = game.status === 3;
    const playable = game.status > 0;
    const owned = game.owner === account;
    const myTurn = game.turn === account;

    const joinable = !owned && open;

    let help = null;

    if (playable && !finished) {
      if (myTurn) {
        help = <Alert success>Your turn!</Alert>;
      } else {
        help = <Alert info>Not your turn</Alert>;
      }
    } else if (owned && open) {
      help = <Alert info>Nobody joined your game yet</Alert>;
    } else if (finished) {
      help = <Alert info>TODO: Reveal</Alert>;
    }

    return (
      <Layout history={history}>
        <h1>
          Game #{game.id}
          <span className={`label label--${status}`}>{status}</span>
        </h1>
        <pre className="u-mb">{owned ? game.challenger : game.owner}</pre>
        {playable && (
          <Grid
            className="u-mb-small"
            size={game.gridSize}
            mod="target"
            positions={target}
            onAttack={attack}
            disabled={!myTurn || finished}
          />
        )}
        <Grid
          className="u-mb"
          size={game.gridSize}
          mod="ocean"
          positions={ocean}
          ships={ships}
        />
        {joinable && (
          <div className="u-mb">
            <p>
              <a onClick={this._randomize} className="u-link">
                Randomize ships ↺
              </a>
            </p>
            <button onClick={this._joinGame} disabled={!ships.length}>
              Join game
            </button>
          </div>
        )}
        {help !== null && help}
      </Layout>
    );
  }

  renderLoading() {
    return (
      <Layout history={history}>
        <p>Loading game...</p>
      </Layout>
    );
  }
}

//@connect
const state = state => ({
  account: state.eth.account,
  game: sel.getGame(state),
  ships: sel.getGameShips(state),
  target: sel.getGameTarget(state),
  ocean: sel.getGameOcean(state)
});

const actions = ({ games }) => ({
  attack: games.attack,
  getGame: games.getGame,
  joinGame: games.joinGame
});

export default connect(
  state,
  actions
)(GameShow);
