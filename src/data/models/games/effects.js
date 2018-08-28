import { _unshift } from "utils/immutable";
import * as Bs from "utils/battleship";
import * as sel from "data/selectors";

export default dispatch => ({
  //
  // Create game
  async createGame({ gridSize, ships, history }, state) {
    const { account, contract, web3 } = state.eth;

    const [secret, salt] = await Bs.obfuscate(web3, ships);

    const tx = await contract.createGame(gridSize, secret, {
      from: account,
      gas: 1000000
    });

    // "GameCreated" event
    const gameId = tx.logs[0].args.gameId.toNumber();

    dispatch.ships.setShips({ gameId, ships, salt });

    history.push(`/games/${gameId}`);
  },

  //
  // Join game
  async joinGame({ gameId, ships }, state) {
    const { account, contract, web3 } = state.eth;

    const [secret, salt] = await Bs.obfuscate(web3, ships);

    contract.joinGame(gameId, secret, {
      from: account,
      gas: 1000000
    });

    dispatch.ships.setShips({ gameId, ships, salt });
  },

  //
  // Get game
  async getGame(gameId, state) {
    const { account, contract } = state.eth;
    const { byId: gamesById, targets } = state.games;

    const game = gamesById[gameId];

    let gridSize;

    if (!game) {
      // Game
      const result = await contract.games.call(gameId);

      dispatch.games.updateGame(_unshift(result, gameId));

      gridSize = result[1];
    } else {
      gridSize = game.gridSize;
    }

    if (!targets[gameId]) {
      let [target, ocean] = await Promise.all([
        contract.getGameTarget.call(gameId, account),
        contract.getGameOcean.call(gameId, account)
      ]);

      // Target grid
      if (target.length) {
        target = target.map(bigNum => bigNum.toNumber());
      } else {
        target = Bs.createGrid(gridSize, true);
      }

      dispatch.games.setTarget({ gameId, grid: target });

      // Ocean grid
      if (ocean.length) {
        ocean = ocean.map(bigNum => bigNum.toNumber());
      } else {
        ocean = Bs.createGrid(gridSize, true);
      }

      dispatch.games.setOcean({ gameId, grid: ocean });
    }
  },

  defend({ gameId, index }, state) {
    const ships = state.ships.byGameId[gameId];

    if (ships) {
      dispatch.games.setDefense({ gameId, index, hit: ships[index] > 1 });
    }
  },

  //
  // Attack
  attack(index, state) {
    dispatch.games.attacking(index);

    const game = sel.getGame(state);
    const { account, contract } = state.eth;

    if (game.status > 1) {
      const defense = state.games.defenses[game.id];
      const position = Bs.getPositionName(game.gridSize, defense.index);

      let hit = defense.hit;

      // Cheat?
      if (hit) {
        const message = `
          You were HIT on ${position}
          (Press OK to accept, Cancel to cheat)
        `;

        if (!confirm(message)) {
          // Do cheat...
          hit = !hit;

          dispatch.games.setDefense({
            gameId: game.id,
            index: game.targetIndex,
            hit
          });
        }
      }

      contract.counterAttack(game.id, index, hit, { from: account });
    } else {
      contract.attack(game.id, index, { from: account });
    }
  }
});
