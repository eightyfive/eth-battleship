import { createSelector } from "reselect";
import _orderBy from "lodash/orderBy";
//
import * as Bs from "utils/battleship";
import { _replaceAt } from "utils/immutable";

const gamesById = state => state.games.byId;
const gamesAll = state => state.games.all;
const gamesActive = state => state.games.active;
const gamesTargets = state => state.games.targets;
const gamesOceans = state => state.games.oceans;
const gamesAttacks = state => state.games.attacks;
//
const ethAccount = state => state.eth.account;
//
const shipsByGameId = state => state.ships.byGameId;

export const getGame = createSelector(
  [gamesById, gamesActive],
  (games, gameId) => games[gameId]
);

export const getGameShips = createSelector(
  [shipsByGameId, gamesActive],
  (ships, gameId) => ships[gameId]
);

export const getGameTarget = createSelector(
  [gamesTargets, getGame, gamesAttacks, ethAccount],
  (targets, game, attacks, account) => {
    if (!game) {
      return undefined;
    }

    let target = targets[game.id];

    if (!target) {
      return undefined;
    }

    if (game.turn !== account && game.status > 1) {
      target = _replaceAt(target, game.targetIndex, "?");
    }

    for (let attack of attacks[game.id] || []) {
      target = _replaceAt(target, attack.index, attack.result);
    }

    return target;
  }
);

export const getGameOcean = createSelector(
  [gamesOceans, gamesActive],
  (oceans, gameId) => oceans[gameId]
);

export const getGames = createSelector([gamesById, gamesAll], (games, all) =>
  all.map(id => games[id])
);

export const getMyGames = createSelector(
  [getGames, ethAccount],
  (games, account) =>
    _orderBy(
      games.filter(
        game => game.owner === account || game.challenger === account
      ),
      ["id"],
      ["desc"]
    )
);

export const getOpenGames = createSelector(
  [getGames, ethAccount],
  (games, account) =>
    _orderBy(
      games.filter(game => game.owner !== account && game.status === 0),
      ["id"],
      ["desc"]
    )
);

//
//
// -
const size = state => state.games.gridSize;
const ships = state => state.games.ships;
const target = state => state.games.target;
const ocean = state => state.games.ocean;
const targetIndex = state => state.games.targetIndex;
const oceanIndex = state => state.games.oceanIndex;

export const isStarted = createSelector([target], grid =>
  grid.some(val => val !== 0)
);

export const isPending = createSelector(
  [isStarted, targetIndex],
  (started, index) => started && index !== null
);

export const isTargetHit = createSelector(
  [target, targetIndex],
  (grid, index) => Bs.isHit(grid[index])
);

export const isTargetMiss = createSelector(
  [target, targetIndex],
  (grid, index) => Bs.isMiss(grid[index])
);

export const getTargetPosition = createSelector(
  [size, targetIndex],
  (size, index) => (index !== null ? Bs.getPositionName(size, index) : null)
);

export const getOceanPosition = createSelector(
  [size, oceanIndex],
  (size, index) => (index !== null ? Bs.getPositionName(size, index) : null)
);

export const isOceanHit = createSelector([ships, oceanIndex], (grid, index) =>
  Bs.isShip(grid[index])
);

const targetHits = createSelector([target], grid => Bs.countHits(grid));

const oceanHits = createSelector([ocean], grid => Bs.countHits(grid));

export const isTargetWin = createSelector([size, targetHits], (size, hits) =>
  Bs.isWin(size, hits)
);

export const isOceanWin = createSelector([size, oceanHits], (size, hits) =>
  Bs.isWin(size, hits)
);
