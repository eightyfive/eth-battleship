# Battleship game on Ethereum

Simple battleship game implemented on the ethereum blockchain (solidity).

![Battleship game screenshot](https://raw.githubusercontent.com/eightyfive/eth-battleship/master/screenshot.png)

## What does it do?

- Player A can create a Battleship game (+ submit `secret` of Player A ships positions)
- Player B can join an open Battleship game (+ submit `secret` of Player B ships positions)
- Player A attacks Player B at position "C1" (example)
- Player B provides feedback on attack (can cheat)
- Player B attacks Player A at position "E1"...
- ... And so on.
- Player A wins the game / sinks entire fleet of Player B
- Player A "reveals" its initial ships positions
- Player A has cheated, it appears he misreported some of Player B attacks
- Player B is the new winner of the game

## Setup

### Requirements

In order to run this project locally, you will need:

- [Truffle](https://truffleframework.com/truffle)
- [Ganache](https://truffleframework.com/ganache)
- Mac OS (**not** tested on MS Windows)
- Modern browser with [Metamask](https://metamask.io) installed

### Install

```
$ git clone https://github.com/eightyfive/eth-battleship.git
$ cd eth-battleship
$ npm install
$ truffle compile
$ truffle migrate --network ganache

// NOTE: All compile warnings come from external libraries/contracts

# Optionally
$ truffle test
```
### `.env` file

Opposite to common practice, I *did commit* an `.env` file to the repository. This is for convenience for the testers, and most importantly because it is needed in order for babel/node to compile the JS app properly.

This makes sure we can use `import` paths relative to the project root. And avoid node [relative paths hell](https://www.coreycleary.me/escaping-relative-path-hell/).

### Run

```
// Assuming Ganache (Mac OS) is launched...

$ npm run start

// Head to http://localhost:3000
```

## `SafeMath` Library

Since my project did not require the use of a library, I created a dedicated unit test demonstrating `uint` overflows and how the `SafeMath` Zeppelin library can help.

- `Battleship.sol -> safeMath()`
- `Battleship.sol -> notSafeMath()`
- `test/battleship.js -> "...should +10 overflow (SafeMath)"`


## TODO

Unfortunately I did not have time to do the following:

- Implement the **UI** of the reveal phase (but "reveal" works in Tests !!)
- Implement the "betting" part fo the challenge


