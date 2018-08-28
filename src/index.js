import React from "react";
import { render } from "react-dom";
import cookie from "fg-cookie";
import qs from "qs";
//
import store from "data/store";
import createWeb3 from "utils/web3";
import Application from "./application";
import App from "./App";

const query = document.location.search.substr(1);
const params = qs.parse(query);

if (params.provider === "ganache") {
  cookie("ganache", true);
} else if (params.provider === "metamask") {
  cookie("ganache", false);
}

const forceGanache = cookie("ganache");

window.addEventListener("load", async ev => {
  let provider;

  // Metamask ?
  if (!forceGanache && typeof window.web3 !== "undefined") {
    provider = window.web3.currentProvider;
  }

  const web3 = (window.web3 = createWeb3(provider));
  const app = new Application(web3, store);

  await app.init();

  render(<App store={store} />, document.getElementById("root"));
});
