import Contract from "truffle-contract";
//
import { _unshift } from "utils/immutable";
import BattleshipContract from "../build/contracts/Battleship.json";

export default class Application {
  constructor(web3, store, accountIndex) {
    this.web3 = web3;
    this.dispatch = store.dispatch;
    this.account = null;
    this.accountIndex = accountIndex;
  }

  async init() {
    await this.initAccount();
    await this.initContract();

    this.dispatch.eth.ready(this.web3);
  }

  async initContract() {
    const contract = Contract(BattleshipContract);
    contract.setProvider(this.web3.currentProvider);

    this.contract = await contract.deployed();
    this.dispatch.eth.setContract(this.contract);

    this.registerEvents();
  }

  registerEvents(contract) {
    this.registerEvent("GameCreated");
    this.registerEvent("GameJoined");
    this.registerEvent("Attack");
    this.registerEvent("AttackResult");
    this.registerEvent("GameFinished");
  }

  registerEvent(eventName, filter = {}) {
    this.contract[eventName](filter).watch((err, result) => {
      if (err) {
        console.error(err);
      } else {
        this[`on${eventName}`](result.args);
      }
    });
  }

  async initAccount() {
    this.account = await this.getAccount();
    const balance = await this.getBalance(this.account);

    this.dispatch.eth.setAccount({ account: this.account, balance });
  }

  getAccount() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts(async (err, accounts) => {
        if (err) {
          reject(err);
        }

        if (!accounts.length) {
          alert(`
            No ETH account detected !

            - Is Metamask installed ?
            - Is Metamask configured to work with Ganache ?
          `);

          throw new Error("No accounts detected");
        }

        resolve(accounts[this.accountIndex]);
      });
    });
  }

  getBalance(account) {
    return new Promise((resolve, reject) => {
      this.web3.eth.getBalance(account, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // event GameCreated(uint gameId, address indexed owner, uint8 gridSize);
  onGameCreated(result) {
    this.onEvent(result);
  }

  // event GameJoined(uint gameId, address indexed owner, address indexed challenger);
  onGameJoined(result) {
    // Only IF owner of the game
    if (this.account === result.owner || this.account === result.challenger) {
      this.onEvent(result);
    }
  }

  // event Attack(uint gameId, address indexed attacker, address indexed opponent, uint index);
  onAttack(result) {
    // Only IF was NOT attacker
    if (this.account === result.defender) {
      this.dispatch.games.defend({
        gameId: result.gameId.toNumber(),
        index: result.index.toNumber()
      });
    }

    this.onEvent(result);
  }

  // event AttackResult(uint gameId, address indexed attacker, address indexed opponent, uint index, bool hit);
  onAttackResult(result) {
    // Only IF was attacker
    if (this.account === result.attacker) {
      this.dispatch.games.setAttack({
        gameId: result.gameId.toNumber(),
        index: result.index.toNumber(),
        hit: result.hit
      });
    }

    this.onEvent(result);
  }

  // event GameFinished(uint gameId, address indexed owner, address indexed challenger);
  onGameFinished(result) {
    if (this.account === result.owner || this.account === result.challenger) {
      this.onEvent(result);
    }
  }

  async onEvent(result) {
    const gameId = result.gameId.toNumber();
    const game = await this.contract.games.call(gameId);

    this.dispatch.games.updateGame(_unshift(game, gameId));
  }
}
