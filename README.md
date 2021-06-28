# [zkSync Checkout dApp](https://checkout.zksync.io) &middot; [zkSync.io](https://zksync.io/)  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT) [![GitHub license](https://img.shields.io/badge/license-Apache%202-blue)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT)

# zkSync Checkout — trustable permissionless DeFi payment gateway 

zkSync Checkout helps anyone permission-less adopt checkout backed by zkSync, receive payments automatically and benefit from all the advantage of zkSync Rollup: speed of the transaction, times lower cost of a single transaction, simplicity of withdrawal fund to the onchain-wallet.

* **[Learn more](https://zksync.io/api/sdk/checkout/)**

* [**Changelog**](CHANGELOG.md)

## Deployment

zkSync uses firebase hosting for all it's dApps.
Resource targets for the zkCheckout are:
```
[ hosting ]
prod-mainnet (mainnet-checkout-zksync,zsync-dapp-checkout)
prod-rinkeby (rinkeby-checkout-zksync)
prod-ropsten (ropsten-checkout-zksync)
```

## Build Setup

``` bash
# install dependencies
$ yarn install --check-cache

# Populate .env file as of RINKEBY connection && serve with hot reload at localhost:3000
$ yarn dev

# build for stage | rinkeby
$ sh cli-dev.sh ci && yarn install --immutable
$ yarn build:rinkeby
# afterward you'll have prepared distributive in /public folder

# build for the mainnet release
$ sh cli-dev.sh ci && yarn install --immutable
$ yarn build:prod
# afterward you'll have prepared distributive in /public folder

```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

---

## Solutions

* [Nuxt.js](https://nuxtjs.org)
* [TS Lang](https://www.typescriptlang.org)
* [Vue.js](https://vuejs.org)
* [Vuex](https://vuex.vuejs.org)

### Libraries used  

* [zkSync Checkout lib](https://www.npmjs.com/package/zksync-checkout): our open sourced NPM-package
* [zkSync.js lib](https://www.npmjs.com/package/zksync-checkout): our open sourced NPM-package
* [zkLink service](https://link.zksync.io/?MHhhMDcyRTYxNDMyODY2NWJlN0UyRjIxNjZCRTFBN2JBMTk1RjhiZTQ0fERBSXwxMDA): bit.ly for payment links on zkSync
* [ethers.js lib](https://docs.ethers.io/v5/): a simple to use Web3 Provider Bridge as a single JavaScript file
