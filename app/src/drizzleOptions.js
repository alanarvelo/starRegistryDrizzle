import Web3 from "web3";
import StarNotary from "./contracts/StarNotary.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:8545"),
  },
  contracts: [StarNotary],
  events: {
    StarNotary: ["Transfer"],
  },
  // polls: {
  //   accounts: 10000,
  //   blocks: 6000
  // },
};

export default options;