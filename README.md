# Battleship game on Ethereum

Simple battleship game implemented on the ethereum blockchain (solidity).

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

### Note

This demo app does not work well with Metamask. I did not have the time to optimize the UX when using Metamask, resulting in poor
UX, notably rather long times between game `state` update.

It works flawlessly with a local Ganache blockchain, hence the demp is setup to use Ganache (forced), and ignores MetaMask provider.

I will optimize the app for Metamask eventually.

### Requirements

In order to run this project locally, you will need:

- [Ganache](https://truffleframework.com/ganache)
- Mac OS (**Not** tested on MS Windows)

### Install

```
$ git clone https://github.com/eightyfive/eth-battleship.git
$ cd eth-battleship
$ npm install
```

### Run

```
// Launch Ganache (Mac OS)

$ npm run start

// Open URL: http://localhot:3000
```
