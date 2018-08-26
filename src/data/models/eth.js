import { _unshift } from "utils/immutable";

const initialState = {
  ready: false,
  account: null,
  balance: null,
  contract: null,
  web3: null
};

const reducers = {
  setWeb3: (state, web3) => ({ ...state, web3, ready: true }),

  setAccount: (state, { account, balance }) => ({ ...state, account, balance }),

  setContract: (state, contract) => ({ ...state, contract })
};

const effects = dispatch => ({
  async ready(web3, state) {
    dispatch.eth.setWeb3(web3);

    const { contract, account } = state.eth;

    const gameIds = await contract.getPlayerGames.call(account);

    gameIds.map(bigId => {
      const gameId = bigId.toNumber();

      return contract.games
        .call(gameId)
        .then(result => dispatch.games.updateGame(_unshift(result, gameId)));
    });
  }
});

export default {
  state: initialState,
  reducers,
  effects
};
