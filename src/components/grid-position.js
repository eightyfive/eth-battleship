import React, { PureComponent } from "react";
import cx from "classnames";
//

export default class GridPosition extends PureComponent {
  _onClick = ev => this.props.onClick(this.props.index);

  render() {
    const { value, ship, position } = this.props;
    const hit = value === 1;
    const miss = value === -1;

    let label;

    if (hit || miss) {
      label = "●";
    } else if (ship !== 0) {
      label = ship;
    } else if (value === 0) {
      label = position;
    } else {
      label = value;
    }

    const className = cx("grid__position", {
      "grid__position--empty": value === 0,
      "grid__position--hit": hit,
      "grid__position--miss": miss,
      "grid__position--pending": value === "?",
      "grid__position--ship": ship !== 0,
      [`grid__position--ship-${ship}`]: ship !== 0
    });

    return (
      <div className={className} onClick={this._onClick}>
        {label}
      </div>
    );
  }
}
