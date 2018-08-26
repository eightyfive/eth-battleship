import reducers from "./reducers";
import effects from "./effects";

const initialState = {
  active: null,
  all: [],
  byId: {},
  targets: {},
  oceans: {},
  attacks: {},
  defenses: {}
};

export default {
  state: initialState,
  reducers,
  effects
};
