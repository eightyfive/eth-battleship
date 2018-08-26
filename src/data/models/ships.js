const initialState = {
  salts: {},
  byGameId: {}
};

const reducers = {
  setShips(state, { gameId, ships, salt }) {
    return {
      ...state,
      salts: {
        ...state.salts,
        [gameId]: salt
      },
      byGameId: {
        ...state.byGameId,
        [gameId]: ships
      }
    };
  }
};

// const effects = dispatch => ({});

export default {
  state: initialState,
  reducers
};
