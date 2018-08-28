# Design pattern decisions

## Commit-reveal

I use the "commit-reveal" design pattern in order to hide the initial ships positions, but guarantee the trust of the game.
I followed as much as possible the recommandations highlighted in this blog post series:
https://blog.colony.io/token-weighted-voting-implementation-part-1-72f836b5423b

### Decisions

- I chose to hash all ships positions client-side (JS), on the contrary of [this example](https://github.com/SCBuergel/ethereum-rps/blob/master/rps-advanced.sol) which submits the user choice encoded and performs the hashing "blockchain-side"
- Even though the communication happens through `https` I found my solution more elegant, because the unencoded ships positions have even less chances to be compromised
- I struggled implementing the same hashing client and blockchain side, but eventually succeeded:

```js
// JS (web3 0.16.x)
secret = web3.sha3(ships + salt);
```

```solidity
// Solidity
keccak256(abi.encodePacked(ships, salt));
```

These two implementations give the same `secret` result.

### `salt`

The `salt` must:

- Not be sensitive
- Be unique for every game
- Not chosen by the user
- Not have to be remembered by the user

#### Signing or not signing?

Initially I chose to sign the (randomized) ships positions with the user private key (I found elegant that one can prove ownership the `salt`), but given that Metamask display a HUGE warning
when using `web3.eth.sign`, I chose to simply hash (`web3.sha3`) instead:

```js
const salt = web3.sha3(_.shuffle(ships).join(""));
```

### `secret` ships positions

The `secret` ships positions is what is submitted to the blockchain when creating/joining a game.

```js
const secret = web3.sha3(ships.join("") + salt);
```

### Reveal

At reveal phase, user need to submit to the blockchain the ships positions unencoded, as well as the initial `salt` associated with that game.

Once contract has made sure that `secret`s are matching:

```solidity
require(secret == games[gameId].secrets[msg.sender]);
```

Contract can now check the validity of every "defense" move (hit or miss or cheating) reported by current `msg.sender` during the game:

```solidity
    bytes memory positions = bytes(ships);
    bool cheated = false;

    // Check if ships are all HITs
    for (uint i = 0; i < positions.length; i++) {
      // Position on ocean is empty (ignore)
      if (positions[i] == "0") {
        continue;
      }

      // Position on target is empty (ignore)
      if (games[gameId].targets[opponent][i] == 0) {
        continue;
      }

      // Position is a ship
      // Check if HIT
      cheated = games[gameId].targets[opponent][i] != HIT;

      if (cheated) {
        break;
      }
    }
```

__Note__: Ships are submitted as `string`, not `array`, so I needed a way to loop through every character of the `ships` string.

Contract finally figures out who cheated, won, etc.

## Withdraw pattern

I have implemented the "withdraw" pattern to `transfer` game funds to the winner address.

_Notes_:
- The funds are "lost" for both players if the two players have cheated (nobody can withdraw)
- I could have implemented another contract method so the owner **of the contract** (me, in that case) can withdraw all the "lost" funds of all games :-P


