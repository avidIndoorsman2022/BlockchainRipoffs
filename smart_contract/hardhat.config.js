// https://eth-rinkeby.alchemyapi.io/v2/xiGirscHWfk1XwIHmLSIJuIvymaF-0PC

require("@nomiclabs/hardhat-waffle");

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
