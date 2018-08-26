import React, { PureComponent } from "react";
import { connect } from "react-redux";
//
import * as sel from "data/selectors";

class Help extends PureComponent {
  getMessage() {
    const { position, hit, miss, won, lost } = this.props;

    if (won) {
      return `You won !`;
    }

    if (lost) {
      return `You lost...`;
    }

    if (hit) {
      return `Hit ! (${position})`;
    }

    if (miss) {
      return `Miss... (${position})`;
    }

    if (position) {
      return `Pending attack (${position})`;
    }

    return "Your turn";
  }

  render() {
    return (
      <div className="u-mb">
        <h3>Help</h3>
        <p>{this.getMessage()}</p>
      </div>
    );
  }
}

// @connect
const state = state => ({
  position: sel.getTargetPosition(state),
  hit: sel.isTargetHit(state),
  miss: sel.isTargetMiss(state),
  won: sel.isTargetWin(state),
  lost: sel.isOceanWin(state)
});

export default connect(
  state,
  null
)(Help);
