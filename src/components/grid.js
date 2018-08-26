import React, { Component } from "react";
import cx from "classnames";
import _get from "lodash/get";
//
import * as Bs from "utils/battleship";
import "components/grid.css";
import GridPosition from "components/grid-position";

export default class Grid extends Component {
  _onAttack = index => {
    const { disabled, onAttack } = this.props;

    if (!disabled && onAttack) {
      onAttack(index);
    }
  };

  getClassName() {
    const { mod, disabled, className, onAttack } = this.props;

    return cx(
      "grid",
      `grid--${mod}`,
      {
        "grid--selectable": !disabled && onAttack,
        "grid--disabled": disabled
      },
      className
    );
  }

  render() {
    const { ships, size } = this.props;

    const positions = this.props.positions || Bs.createGrid(size, true);
    const className = this.getClassName();

    return (
      <div className={className} style={{ width: `${size * 50 + 1}px` }}>
        {positions.map((value, index) => (
          <GridPosition
            key={index}
            index={index}
            value={value}
            onClick={this._onAttack}
            ship={_get(ships, index, 0)}
            position={Bs.getPositionName(size, index)}
          />
        ))}
      </div>
    );
  }
}
