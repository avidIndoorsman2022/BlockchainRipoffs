// https://eth-rinkeby.alchemyapi.io/v2/xiGirscHWfk1XwIHmLSIJuIvymaF-0PC

//const { tasks, ethers } = require("hardhat");

require("@nomiclabs/hardhat-waffle");

// Add arbitrary tasks here...
task(
  "accounts",
  "Prints the list of accounts and balances",
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    const provider = waffle.provider;

    for (const account of accounts) {
      let balance = await provider.getBalance(account.address);
      console.log(
        "Account: " +
          account.address +
          " Balance: " +
          ethers.utils.formatEther(balance) +
          " ETH"
      );
    }
  }
);

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/xiGirscHWfk1XwIHmLSIJuIvymaF-0PC",
      accounts: [
        "3b81c4a27e3b401a221549f91bd1b9f959e647ff90379b940c91568c2d3d637d",
      ],
    },
  },
};
