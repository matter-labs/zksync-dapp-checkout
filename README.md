# [zkSync Checkout dApp](https://checkout.zksync.io) &middot; [zkSync.io](https://zksync.io/)  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT) [![GitHub license](https://img.shields.io/badge/license-Apache%202-blue)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT)

# zkSync Checkout — trustable permissionless DeFi payment gateway 

zkSync Checkout helps anyone permission-less adopt checkout backed by zkSync, receive payments automatically and benefit from all the advantage of zkSync Rollup: speed of the transaction, times lower cost of a single transaction, simplicity of withdrawal fund to the onchain-wallet.

* **[SDK documentation](https://zksync.io/api/sdk/checkout/)** | [**Changelog**](CHANGELOG.md)

## Deployment

zkSync uses firebase hosting for all it's dApps.
Resource targets for the zkCheckout are:

### Available Hosts

* [```prod-mainnet```](https://checkout.zksync.io)
* [```prod-rinkeby```](https://checkout-rinkeby.zksync.io)
* [```prod-ropsten```](https://checkout-ropsten.zksync.io)
* [```beta-ropsten```](https://ropsten-beta-checkout-zksync.web.app)
* [```beta-rinkeby```](https://rinkeby-beta-checkout-zksync.web.app)

## Initial Setup / Static version generation

``` bash
# install dependencies
$ sh cli-dev.sh ci

# Populate .env file as of ropsten-beta connection && serve with hot reload at localhost:3000
$ yarn dev

# static version generation
$ yarn ci:build:rinkeby
# afterward you'll have prepared distributive in /public folder

# generate static for the mainnet release
$ sh cli-dev.sh ci
$ yarn ci:build:mainnet
# afterward you'll have prepared distributive in /public folder

```

## Dev toolset

### cli-dev.sh

This helper-script is used to simplify regular tasks when developing or using the package:

```bash
# removes all generated directories & run package installation with the yarn2.* based on stored yarn.lock with the modifier --check-cache
$ sh cli-dev.sh ci

# drops node_modules, .yarn/cache .yarn/build-state.yml .yarn/install-state.gz & trigger cache flushing (yarn cache clean --all)
$ sh cli-dev.sh clean yarn

# drops .nuxt and clear public directory
$ sh cli-dev.sh clean nuxt
```

### Linting & checking

```bash
# Run stylelint with --fix modifier
$ yarn run lint-style:fix

# Run eslint with --fix modifier
$ yarn run lint-ts:fix

# Formats all of the code w/t stored style rules by running prettier
$ yarn format:prettier

# Check spelling in src files
$ yarn spell-chack
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

---

## Solutions used

* [Nuxt.js](https://nuxtjs.org)
* [TS Lang](https://www.typescriptlang.org)
* [Vue.js](https://vuejs.org)
* [Vuex](https://vuex.vuejs.org)
* [nuxt/Tailwind](https://tailwindcss.nuxtjs.org/)
* [nuxt-build-optimisations](https://github.com/harlan-zw/nuxt-build-optimisations)
* [Nuxt TypeScript](https://typescript.nuxtjs.org/)
   * inc. [@nuxt/typescript-build](https://typescript.nuxtjs.org/guide/setup)
   * inc. [@nuxt/typescript-runtime](https://typescript.nuxtjs.org/guide/runtime)
   * w/t built-in linting [typescript-runtime-linting](https://typescript.nuxtjs.org/guide/lint)
   * store is build on top of [Vanilla Vuex](https://typescript.nuxtjs.org/cookbook/store#vanilla)
* [Axios Nuxtjs](https://axios.nuxtjs.org/) 
* [Nuxt social meta](https://github.com/AlekseyPleshkov/nuxt-social-meta) 
* [Sentry](https://sentry.nuxtjs.org/) 
* [Nuxt Webfontloader](https://github.com/Developmint/nuxt-webfontloader)

  ...and others.

### Libraries used  

* [zkSync Checkout lib](https://www.npmjs.com/package/zksync-checkout): our open sourced NPM-package
* [zkSync.js lib](https://www.npmjs.com/package/zksync-checkout): our open sourced NPM-package
* [zkCheckout link builder](https://checkout.zksync.io/link): UI to create unique permissionless payment link and get paid in tokens
* [SDK description](https://zksync.io/api/sdk/checkout/): details on how to use zkCheckout SDK
* [ethers.js lib](https://docs.ethers.io/v5/): a simple to use Web3 Provider Bridge as a single JavaScript file
