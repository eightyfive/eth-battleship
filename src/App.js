import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
//
import GameShow from "containers/game-show";
import GameCreate from "containers/game-create";

export default class App extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <Router>
          <div>
            <Route exact path="/" component={GameCreate} />
            <Route path="/games/:game" component={GameShow} />
          </div>
        </Router>
      </Provider>
    );
  }
}
