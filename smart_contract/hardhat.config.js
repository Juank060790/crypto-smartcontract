// https://eth-ropsten.alchemyapi.io/v2/80DZhPfjCxBqZ7kN6S_J8X0DzWKqogri

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/80DZhPfjCxBqZ7kN6S_J8X0DzWKqogri",
      accounts: [
        "4946e37c77be847fa5bdd944dec25749e54141e94d2c02a98854ca98883dc15b",
      ],
    },
  },
};
