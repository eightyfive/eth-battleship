import _uniq from "lodash/uniq";
import _assign from "lodash/assign";
//
import { _replaceAt, _push } from "utils/immutable";

export default {
  attacking(state, index) {
    const gameId = state.active;
    const grid = _replaceAt(state.targets[gameId], index, "?");

    return _setGrid("targets", state, gameId, grid);
  },

  setAttack(state, { gameId, index, hit }) {
    const attacks = state.attacks[gameId] || [];

    return {
      ...state,
      attacks: {
        ...state.attacks,
        [gameId]: _push(attacks, { index, result: hit ? 1 : -1 })
      }
    };
  },

  "games/createGame": (state, gameId) => ({
    ...state,
    active: null
  }),

  "games/getGame": (state, gameId) => ({
    ...state,
    active: gameId
  }),

  updateGame(state, result) {
    const game = Array.isArray(result) ? _arrGame(result) : _mapGame(result);
    const oldGame = state.byId[game.id];
    const all = _push(state.all, game.id);

    return {
      ...state,
      all: _uniq(all),
      byId: {
        ...state.byId,
        [game.id]: _assign({}, oldGame, game)
      }
    };
  },

  setOcean(state, { gameId, grid }) {
    return _setGrid("oceans", state, gameId, grid);
  },

  setTarget(state, { gameId, grid }) {
    return _setGrid("targets", state, gameId, grid);
  },

  setDefense(state, { gameId, index, hit }) {
    const newState = {
      ...state,
      defenses: {
        ...state.defenses,
        [gameId]: { index, hit }
      }
    };

    const ocean = state.oceans[gameId];

    if (ocean) {
      const grid = _replaceAt(ocean, index, hit ? 1 : -1);

      return _setGrid("oceans", newState, gameId, grid);
    }

    return newState;
  }
};

// Local helpers
function _mapGame(result) {
  return {
    id: result.gameId.toNumber ? result.gameId.toNumber() : result.gameId,
    status: result.status.toNumber(),
    gridSize: result.gridSize.toNumber(),
    targetIndex: result.targetIndex.toNumber(),
    owner: result.owner,
    challenger: result.challenger,
    turn: result.turn
  };
}

function _arrGame(result) {
  const [
    gameId,
    status,
    gridSize,
    targetIndex,
    owner,
    challenger,
    turn
  ] = result;

  return _mapGame({
    gameId,
    status,
    gridSize,
    targetIndex,
    owner,
    challenger,
    turn
  });
}

function _setGrid(type, state, gameId, grid) {
  return {
    ...state,
    [type]: { ...state[type], [gameId]: grid }
  };
}
