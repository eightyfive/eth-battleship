import React from "react";
import { render } from "react-dom";
//
import store from "data/store";
import createWeb3 from "utils/web3";
import Application from "./application";
import App from "./App";

window.addEventListener("load", async ev => {
  let provider;

  // Metamask ?
  if (typeof window.web3 !== "undefined") {
    provider = window.web3.currentProvider;
  }

  const web3 = (window.web3 = createWeb3(provider));
  const app = new Application(web3, store);

  await app.init();

  render(<App store={store} />, document.getElementById("root"));
});
