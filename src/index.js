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

//
// Testing goodies !
//
if (params.provider) {
  cookie("provider", params.provider);
}

if (typeof params.account !== "undefined") {
  cookie("account", params.account);
}

// Force use of Ganache (ignore Metamask)
const ganache = cookie("provider") === "ganache";

let accountIndex;

if (ganache) {
  accountIndex = cookie("account") || "0";
  accountIndex = parseInt(accountIndex, 10);
} else {
  // Metamask returns only one account
  accountIndex = 0;
}

window.addEventListener("load", async ev => {
  let provider;

  // Use Metamask ?
  if (!ganache && typeof window.web3 !== "undefined") {
    provider = window.web3.currentProvider;
  }

  const web3 = (window.web3 = createWeb3(provider));
  const app = new Application(web3, store, accountIndex);

  await app.init();

  render(<App store={store} />, document.getElementById("root"));
});
