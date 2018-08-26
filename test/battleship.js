const _isEqual = require("lodash/isEqual");
const _shuffle = require("lodash/shuffle");

var Battleship = artifacts.require("./Battleship.sol");

contract("Battleship", async accounts => {
  const playerA = accounts[0];
  const playerB = accounts[1];

  const ships = [2, 2, 0, 0, 0, 0, 0, 0, 0];

  let secret;
  let salt1, salt2;

  // "Game" struct attributes
  let status, gridSize, targetIndex, owner, challenger, turn, winner;

  let gameId = -1;

  // Simple test for Player A  to create a game
  it("...should create game", async () => {
    const sc = await Battleship.deployed();

    gameId++;

    [secret, salt1] = _getSecrets(web3, ships);
    await sc.createGame(3, secret, { from: playerA });

    [status, gridSize, , owner, , turn] = await sc.games.call(gameId);

    assert.equal(status.toNumber(), 0, "Status not OPEN");
    assert.equal(gridSize.toNumber(), 3, "Wrong grid size");
    assert.equal(owner, playerA, "Owner address not saved");
    assert.equal(turn, owner, "Wrong turn");
  });

  // Simple test to make sure Player A cannot join its own game
  it("...should not join (own) game", async () => {
    const sc = await Battleship.deployed();

    try {
      await sc.joinGame(gameId, "SHIPS", { from: playerA });
      assert(false, "Exception was not thrown");
    } catch (err) {
      assert(true, "Exception was thrown");
    }
  });

  // Simple test to make sure Player B can join Player A open game
  it("...should join game", async () => {
    const sc = await Battleship.deployed();

    [secret, salt2] = _getSecrets(web3, ships);

    await sc.joinGame(gameId, secret, { from: playerB });

    [status, , , , challenger] = await sc.games.call(gameId);

    assert.equal(challenger, playerB, "Challenger address not saved");
    assert.equal(status.toNumber(), 1, "Status not READY");
  });

  // Simple test to make sure Player A can perform the intial attack of the game
  it("...should attack", async () => {
    const sc = await Battleship.deployed();

    await sc.attack(gameId, 0, { from: playerA });

    [status, , targetIndex, , , turn] = await sc.games.call(gameId);

    assert.equal(targetIndex.toNumber(), 0, "Wrong attack index");
    assert.equal(status.toNumber(), 2, "Status not STARTED");
    assert.equal(turn, playerB, "Wrong turn");
  });

  // Simple test to make sure Player A cannot play (not its turn)
  it("...should not be player turn", async () => {
    const sc = await Battleship.deployed();

    try {
      await sc.counterAttack(gameId, 1, false, { from: playerA });

      assert(false, "Exception was thrown");
    } catch (err) {
      assert(true, "Exception was not thrown");
    }
  });

  // This test performs a "normal" game, with nobody cheating
  it("...should finish game", async () => {
    const sc = await Battleship.deployed();

    await sc.counterAttack(gameId, 0, true, { from: playerB });
    await sc.counterAttack(gameId, 1, true, { from: playerA });
    await sc.counterAttack(gameId, 1, true, { from: playerB });

    [status, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(status.toNumber(), 3, "Status not FINISHED");
    assert.equal(winner, playerA, "Wrong winner");
  });

  // This test reveals both players ships positions
  // - Player A remains the winner – because no cheating (yet)
  it("...should be winning", async () => {
    const sc = await Battleship.deployed();

    await sc.reveal(gameId, ships.join(""), salt1, {
      from: playerA
    });

    await sc.reveal(gameId, ships.join(""), salt2, {
      from: playerB
    });

    [status, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(status.toNumber(), 4, "Status not DONE");
    assert.equal(winner, playerA, "Wrong winner");
  });

  // This test performs a "cheated" game, where only Player B is cheating
  // In order to make sure winner is switched to Player A
  it("...should be cheating", async () => {
    const sc = await Battleship.deployed();

    gameId++;

    [secret, salt1] = _getSecrets(web3, ships);
    await sc.createGame(3, secret, { from: playerA });

    [secret, salt2] = _getSecrets(web3, ships);
    await sc.joinGame(gameId, secret, { from: playerB });

    // Player B (winning first, but cheating)
    await sc.attack(gameId, 0, { from: playerA });
    await sc.counterAttack(gameId, 0, false, { from: playerB });
    await sc.counterAttack(gameId, 1, true, { from: playerA });
    await sc.counterAttack(gameId, 1, false, { from: playerB });
    await sc.counterAttack(gameId, 2, true, { from: playerA });

    [, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(winner, playerB, "Wrong winner");

    await sc.reveal(gameId, ships.join(""), salt1, {
      from: playerA
    });

    await sc.reveal(gameId, ships.join(""), salt2, {
      from: playerB
    });

    [, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(winner, playerA, "Wrong winner");
  });

  // This test performs a "cheated" game, where both Players are cheating
  // In order to make sure nobody wins
  it("...should be BOTH cheating", async () => {
    const sc = await Battleship.deployed();

    gameId++;

    [secret, salt1] = _getSecrets(web3, ships);

    await sc.createGame(3, secret, { from: playerA });

    [secret, salt2] = _getSecrets(web3, ships);

    await sc.joinGame(gameId, secret, { from: playerB });

    // Player B (winning, but cheating)
    await sc.attack(gameId, 0, { from: playerA });
    await sc.counterAttack(gameId, 0, false, { from: playerB });
    await sc.counterAttack(gameId, 1, false, { from: playerA });
    await sc.counterAttack(gameId, 1, false, { from: playerB });
    await sc.counterAttack(gameId, 2, false, { from: playerA });
    await sc.counterAttack(gameId, 2, false, { from: playerB });
    await sc.counterAttack(gameId, 3, false, { from: playerA });
    await sc.counterAttack(gameId, 3, false, { from: playerB });
    await sc.counterAttack(gameId, 4, false, { from: playerA });
    await sc.counterAttack(gameId, 4, false, { from: playerB });
    await sc.counterAttack(gameId, 5, false, { from: playerA });
    await sc.counterAttack(gameId, 5, false, { from: playerB });
    await sc.counterAttack(gameId, 6, false, { from: playerA });
    await sc.counterAttack(gameId, 6, false, { from: playerB });
    await sc.counterAttack(gameId, 7, false, { from: playerA });
    await sc.counterAttack(gameId, 7, false, { from: playerB });

    [status, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(status.toNumber(), 3, "Not FINISHED");
    assert.equal(winner, playerA, "Wrong winner");

    await sc.reveal(gameId, ships.join(""), salt1, {
      from: playerA
    });

    await sc.reveal(gameId, ships.join(""), salt2, {
      from: playerB
    });

    [, , , , , , winner] = await sc.games.call(gameId);

    assert.equal(
      winner,
      "0x0000000000000000000000000000000000000000",
      "Wrong winner"
    );
  });

  it("...should +10 overflow (SafeMath)", async () => {
    const sc = await Battleship.deployed();

    const overflow = 255 + 10;

    const val1 = await sc.safeMath.call(0, overflow);
    assert.equal(val1.toNumber(), 0, "Value not `0`");

    const val2 = await sc.notSafeMath.call(0, overflow);
    assert.equal(val2.toNumber(), 9, "Value not `9`");
  });
});

function _getSecrets(web3, ships) {
  // const salt = web3.eth.sign(account, _shuffle(ships).join(""));
  const salt = web3.sha3(_shuffle(ships).join(""));
  const secret = web3.sha3(ships.join("") + salt);

  return [secret, salt];
}
