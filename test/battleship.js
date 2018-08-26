const _isEqual = require("lodash/isEqual");
const _shuffle = require("lodash/shuffle");

var Battleship = artifacts.require("./Battleship.sol");

contract("Battleship", async accounts => {
  const account1 = accounts[0];
  const account2 = accounts[1];

  const ships = [2, 2, 0, 0, 0, 0, 0, 0, 0];

  let secret;
  let salt1, salt2;

  // "Game" struct attributes
  let status, gridSize, targetIndex, owner, challenger, turn, winner;

  let gameId = -1;

  it("...should create game", async () => {
    const sc = await Battleship.deployed();

    gameId++;

    [secret, salt1] = _getSecrets(web3, account1, ships);
    await sc.createGame(3, secret, { from: account1 });

    [status, gridSize, , owner, , turn] = await sc.games.call(gameId);

    assert.equal(status.toNumber(), 0, "Status not OPEN");
    assert.equal(gridSize.toNumber(), 3, "Wrong grid size");
    assert.equal(owner, account1, "Owner address not saved");
    assert.equal(turn, owner, "Wrong turn");
  });

  it("...should not join (own) game", async () => {
    const sc = await Battleship.deployed();

    try {
      await sc.joinGame(gameId, "SHIPS", { from: account1 });
      assert(false, "Exception was not thrown");
    } catch (err) {
      assert(true, "Exception was thrown");
    }
  });

  it("...should join game", async () => {
    const sc = await Battleship.deployed();

    [secret, salt2] = _getSecrets(web3, account2, ships);

    await sc.joinGame(gameId, secret, { from: account2 });

    [status, , , , challenger] = await sc.games.call(gameId);

    assert.equal(challenger, account2, "Challenger address not saved");
    assert.equal(status.toNumber(), 1, "Status not READY");
  });

  it("...should attack", async () => {
    const sc = await Battleship.deployed();

    await sc.attack(gameId, 0, { from: account1 });

    [status, , targetIndex, , , turn] = await sc.games.call(gameId);

    assert.equal(targetIndex.toNumber(), 0, "Wrong attack index");
    assert.equal(status.toNumber(), 2, "Status not STARTED");
    assert.equal(turn, account2, "Wrong turn");
  });

  it("...should not be player turn", async () => {
    const sc = await Battleship.deployed();

    try {
      await sc.counterAttack(gameId, 1, false, { from: account1 });

      assert(false, "Exception was thrown");
    } catch (err) {
      assert(true, "Exception was not thrown");
    }
  });

  it("...should finish game", async () => {
    const sc = await Battleship.deployed();

    await sc.counterAttack(gameId, 0, true, { from: account2 });
    await sc.counterAttack(gameId, 1, true, { from: account1 });
    await sc.counterAttack(gameId, 1, true, { from: account2 });

    [status, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(status.toNumber(), 3, "Status not FINISHED");
    assert.equal(winner, account1, "Wrong winner");
  });

  it("...should be winning", async () => {
    const sc = await Battleship.deployed();

    await sc.reveal(gameId, ships.join(""), salt1, {
      from: account1
    });

    await sc.reveal(gameId, ships.join(""), salt2, {
      from: account2
    });

    [status, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(status.toNumber(), 4, "Status not DONE");
    assert.equal(winner, account1, "Wrong winner");
  });

  it("...should be cheating", async () => {
    const sc = await Battleship.deployed();

    gameId++;

    [secret, salt1] = _getSecrets(web3, account1, ships);
    await sc.createGame(3, secret, { from: account1 });

    [secret, salt2] = _getSecrets(web3, account2, ships);
    await sc.joinGame(gameId, secret, { from: account2 });

    // Account 2 (winning, but cheating)
    await sc.attack(gameId, 0, { from: account1 });
    await sc.counterAttack(gameId, 0, false, { from: account2 });
    await sc.counterAttack(gameId, 1, true, { from: account1 });
    await sc.counterAttack(gameId, 1, false, { from: account2 });
    await sc.counterAttack(gameId, 2, true, { from: account1 });

    [, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(winner, account2, "Wrong winner");

    await sc.reveal(gameId, ships.join(""), salt1, {
      from: account1
    });

    await sc.reveal(gameId, ships.join(""), salt2, {
      from: account2
    });

    [, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(winner, account1, "Wrong winner");
  });

  it("...should be BOTH cheating", async () => {
    const sc = await Battleship.deployed();

    gameId++;

    [secret, salt1] = _getSecrets(web3, account1, ships);

    await sc.createGame(3, secret, { from: account1 });

    [secret, salt2] = _getSecrets(web3, account2, ships);

    await sc.joinGame(gameId, secret, { from: account2 });

    // Account 2 (winning, but cheating)
    await sc.attack(gameId, 0, { from: account1 });
    await sc.counterAttack(gameId, 0, false, { from: account2 });
    await sc.counterAttack(gameId, 1, false, { from: account1 });
    await sc.counterAttack(gameId, 1, false, { from: account2 });
    await sc.counterAttack(gameId, 2, false, { from: account1 });
    await sc.counterAttack(gameId, 2, false, { from: account2 });
    await sc.counterAttack(gameId, 3, false, { from: account1 });
    await sc.counterAttack(gameId, 3, false, { from: account2 });
    await sc.counterAttack(gameId, 4, false, { from: account1 });
    await sc.counterAttack(gameId, 4, false, { from: account2 });
    await sc.counterAttack(gameId, 5, false, { from: account1 });
    await sc.counterAttack(gameId, 5, false, { from: account2 });
    await sc.counterAttack(gameId, 6, false, { from: account1 });
    await sc.counterAttack(gameId, 6, false, { from: account2 });
    await sc.counterAttack(gameId, 7, false, { from: account1 });
    await sc.counterAttack(gameId, 7, false, { from: account2 });

    [status, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(status.toNumber(), 3, "Not FINISHED");
    assert.equal(winner, account1, "Wrong winner");

    await sc.reveal(gameId, ships.join(""), salt1, {
      from: account1
    });

    await sc.reveal(gameId, ships.join(""), salt2, {
      from: account2
    });

    [, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(
      winner,
      "0x0000000000000000000000000000000000000000",
      "Wrong winner"
    );
  });
});

function _getSecrets(web3, account, ships) {
  const salt = web3.eth.sign(account, _shuffle(ships).join(""));
  const secret = web3.sha3(ships.join("") + salt);

  return [secret, salt];
}
