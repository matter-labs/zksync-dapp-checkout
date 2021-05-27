# [zkCheckout dApp](https://link.zksync.io) &middot; [zkSync.io](https://zksync.io/)  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT) [![GitHub license](https://img.shields.io/badge/license-Apache%202-blue)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT)

# zkCheckout — trustable permissionless DeFi payment gateway 

zkCheckout helps anyone permission-less adopt checkout backed by zkSync, receive payments automatically and benefit from all the advantage of zkSync Rollup: speed of the transaction, times lower cost of a single transaction, simplicity of withdrawal fund to the onchain-wallet.

**[Learn more →](https://zksync.io/api/sdk/checkout/)**

## CHANGELOG.md

### v.2.0.3

---
* Reconfigured firebase & GitHub Actions deployment flow
* feat(UX): Non-closable popup shown if no checkout data provided
* 


### v.2.0.2

---
* first-fix of the issue reported by the Gitlab
* re-designed way of hash-reporting for the batch (more stable and solid way to filter fee-transfer and report same list of the transfers as requested)

### v.2.0.1

---
* improved deposit reporting (showing the user left number of confirmations)

### v.2.0.0

---
This is like complete new version of the checkout:
* added batch-transaction manager support
* restyled UI
* redesigned UX
* batchManager support added
* the latest version of the wallet is connected
* the bunch of smaller improvements released

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
# install dependencies && populate .env file as of ROPSTEN connection (clear install)
$ yarn prepare_ci

# serve with hot reload at localhost:3000
$ yarn dev

# build for dev
$ build:stage
# afterward you'll have prepared distributive in /public folder

# build for production (only if you have firebase:auth) 
$ cli-deploy-production.sh  
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

---

## Solutions used

* [Nuxt.js](https://nuxtjs.org)
* [TS Lang](https://www.typescriptlang.org)
* [Vue.js](https://vuejs.org)
* [Vuex](https://vuex.vuejs.org)

### Libraries used  

* [zkCheckout lib](https://www.npmjs.com/package/zksync-checkout): our open sourced NPM-package
* [zkSync.js lib](https://www.npmjs.com/package/zksync-checkout): our open sourced NPM-package
* [zkLink service](https://link.zksync.io/?MHhhMDcyRTYxNDMyODY2NWJlN0UyRjIxNjZCRTFBN2JBMTk1RjhiZTQ0fERBSXwxMDA): bit.ly for payment links on zkSync
* [ethers.js lib](https://docs.ethers.io/v5/): a simple to use Web3 Provider Bridge as a single JavaScript file