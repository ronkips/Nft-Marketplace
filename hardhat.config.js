require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-ethers')
const fs = require('fs')
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli: {
      url:
        'https://eth-goerli.g.alchemy.com/v2/Twl0w6LQEldnvgCORVCSGiEOlKpobpPv',
      accounts:
        '68e3dbe146cd0bf9ee6f61b3858be1ba496480f78f1f891c65b665cbd0e38ccd',
    },
  },
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}
