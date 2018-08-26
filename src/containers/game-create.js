import React, { Component } from "react";
import { connect } from "react-redux";
//
import Layout from "containers/layout";
import GameForm from "components/game-form";
// import * as sel from "data/selectors";

class GameCreate extends Component {
  _createGame = data => {
    const { history } = this.props;

    this.props.createGame({ ...data, history });
  };

  render() {
    const { history } = this.props;

    return (
      <Layout history={history}>
        <GameForm onSubmit={this._createGame} />
      </Layout>
    );
  }
}

// @connect
// const state = state => ({});

const actions = ({ games }) => ({
  createGame: games.createGame
});

export default connect(
  null,
  actions
)(GameCreate);
