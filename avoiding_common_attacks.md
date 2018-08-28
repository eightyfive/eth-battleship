# Avoiding common attacks

- I made sure contract fails _early_ when needed
- I made sure to choose wisely the proper `public`, `internal`, etc modifiers
- I made sure that the unencoded ships positions is never leaving players' computer and thus protecting even more the integrity of the game
- I made sure the `secret` ships positions obfuscating procces is secure (unless I missed something)
- I made sure to clear `game.funds` "balance" before `transfer`ing funds to winner address (protection against "re-entrancy attacks")
- I did not use `tx.origin`
- I made sure to avoid most simple attacks by restricting properly my public contract methods with proper modifiers. Most notably given the state of the current game:

```solidity
  modifier onlyPlayer(uint gameId)
  modifier onlyWinner(uint gameId)
  modifier myTurn(uint gameId)
  modifier gameOpen(uint gameId)
  modifier gameReady(uint gameId)
  modifier gameStarted(uint gameId)
  modifier gameFinished(uint gameId)
  modifier notRevealed(uint gameId)
  modifier notEmergency
```

