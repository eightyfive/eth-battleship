import { init } from "@rematch/core";
import createPersistPlugin from "@rematch/persist";
//
import models from "./models";

const persistPlugin = createPersistPlugin({
  whitelist: ["ships"],
  version: 1
});

const store = init({
  models,
  plugins: [persistPlugin]
});

export default store;
