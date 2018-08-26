import Web3 from "web3";

const GANACHE = "HTTP://127.0.0.1:7545";

export default function createWeb3(provider) {
  if (!provider) {
    provider = new Web3.providers.HttpProvider(GANACHE);
  }

  return new Web3(provider);
}
