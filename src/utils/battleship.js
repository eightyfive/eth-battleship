import _times from "lodash/times";
import _shuffle from "lodash/shuffle";
//

export const GRID_SIZE_LARGE = 10;
export const GRID_SIZE_SMALL = 5;
export const GRID_SIZE_XSMALL = 3;

const SHIP_CARRIER = 5;
const SHIP_BATTLESHIP = 4;
const SHIP_CRUISER = 3;
const SHIP_SUBMARINE = 3;
const SHIP_DESTROYER = 2;

const LETTER_A = "A".charCodeAt();

export function createGrid(size, empty = false) {
  const grid = createEmptyGrid(size);

  if (empty) {
    return grid;
  }

  const ships = getShips(size);

  for (let ship of ships) {
    const isVertical = Math.round(Math.random()) === 1;

    let point;

    while (!point || !placeShipAt(size, grid, ship, point, isVertical)) {
      point = getShipPosition(size, ship, isVertical);

      if (point[0] > size || point[1] > size) {
        throw new Error("Out of bounds");
      }
    }
  }

  return grid;
}

function createEmptyGrid(size) {
  const grid = [];

  for (let i = 0; i < size ** 2; i++) {
    grid.push(0);
  }

  return grid;
}

function getShips(size) {
  // XS
  const ships = [SHIP_DESTROYER];

  if (size === GRID_SIZE_XSMALL) {
    return ships;
  }

  // S
  ships.unshift(SHIP_CRUISER, SHIP_SUBMARINE);

  if (size === GRID_SIZE_SMALL) {
    return ships;
  }

  // L
  ships.unshift(SHIP_CARRIER, SHIP_BATTLESHIP);

  return ships;
}

function getShipPosition(size, ship, isVertical) {
  const secureLength = size - (ship - 1);

  const width = isVertical ? size : secureLength;
  const height = isVertical ? secureLength : size;

  return getRandomPoint(width, height);
}

function placeShipAt(size, grid, ship, point, isVertical) {
  const [x, y] = point;

  const indexes = _times(ship)
    .map(i => [isVertical ? x : x + i, isVertical ? y + i : y])
    .map(point => pointToIndex(size, point));

  // IF: all positions are available
  if (indexes.every(i => grid[i] === 0)) {
    // Place ship on grid
    indexes.forEach(i => {
      grid[i] = ship;
    });

    return true;
  }

  return false;
}

function getRandomPoint(width, height) {
  return [getRandomInt(width), getRandomInt(height)];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function pointToIndex(size, point) {
  const [x, y] = point;
  return y * size + x;
}

export function getPositionName(size, index) {
  const letter = LETTER_A + (index % size);
  const number = Math.floor(index / size) + 1;

  return `${String.fromCharCode(letter)}${number}`;
}

export function isHit(value) {
  return value === true;
}

export function isMiss(value) {
  return value === false;
}

export function isShip(value) {
  return [2, 3, 4, 5].includes(value);
}

export function countHits(grid) {
  return grid.filter(val => isHit(val)).length;
}

export function isWin(size, hits) {
  return getShips(size).reduce((sum, ship) => sum + ship, 0) === hits;
}

export function getGridSizes() {
  return [GRID_SIZE_LARGE, GRID_SIZE_SMALL, GRID_SIZE_XSMALL];
}

const gridSizeLabels = {
  [GRID_SIZE_LARGE]: "Large (normal)",
  [GRID_SIZE_SMALL]: "Small",
  [GRID_SIZE_XSMALL]: "XSmall (DEV)"
};

export function getGridSizeLabel(size) {
  return gridSizeLabels[size];
}

const statuses = ["open", "ready", "started", "finished"];

export function getStatus(status) {
  return statuses[status];
}

export function obfuscate(web3, ships) {
  const salt = web3.sha3(_shuffle(ships).join(""));
  const secret = web3.sha3(ships.join("") + salt);

  return [secret, salt];

  // Since Metamask is displaying a WARNING message
  // When signin a message, I chose to not use signing anymore...
  //
  // return new Promise((resolve, reject) => {
  //   web3.eth.sign(account, _shuffle(ships).join(""), (err, salt) => {
  //     console.log(err, salt);
  //     if (err) {
  //       reject(err);
  //     } else {
  //       const secret = web3.sha3(ships.join("") + salt);
  //       console.log(secret);
  //       resolve([secret, salt]);
  //     }
  //   });
  // });
}
