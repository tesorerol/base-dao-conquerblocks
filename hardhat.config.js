require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-web3");
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: "./src/artifacts"
  },
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
      gasPrice: 20000000000,
    },
    testnet: {
      // Testnet Binance Smart Chain
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic: "TU FRASE de Semilla" }
    },
  },
  namedAccounts: {
    executor: {
      default: 0
    },
    proposer: {
      default: 1
    },
    voter1: {
      default: 2
    },
    voter2: {
      default: 3
    },
    voter3: {
      default: 4
    },
    voter4: {
      default: 5
    },
    voter5: {
      default: 6
    },
    voter6: {
      default: 7
    }
  }
};
