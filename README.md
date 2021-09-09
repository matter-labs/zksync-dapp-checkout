# [zkSync Checkout dApp](https://checkout.zksync.io) &middot; [zkSync.io](https://zksync.io/)  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT) [![GitHub license](https://img.shields.io/badge/license-Apache%202-blue)](https://github.com/matter-labs/zksync-wallet/blob/master/LICENSE-MIT)

## Actual Release v.2.6.1 [`changelog`](https://github.com:matter-labs/zksync-wallet-vue/CHANGELOG.MD)

Complete new version of zkWallet, built with nuxt+vuejs.
Better architecture based on moder open source tech. Tight roadmap with many awesome features will guide developers into the amazing world of dApps and introduce true reactive 
interaction, dialog-based UX.
 
It's working perfectly on [**mainnet**](https://wallet.zksync.io) | [rinkeby](https://rinkeby.zksync.io) and [ropsten](https://ropsten.zksync.io), published and ready for mass adoption.

zkWallet was created to unleash the power of zkSync L2 operations and give everyone the access to L2 zkSync features on mainnet. [Learn more](https://zksync.io/)

## Firebase hosting configuration

zkSync uses firebase hosting for all it's dApps.

> Resource targets for zksync-vue:

### Hosting

  * [```prod-mainnet```](https://checkout.zksync.io)
  * [```prod-rinkeby```](https://checkout-rinkeby.zksync.io)
  * [```prod-ropsten```](https://checkout-ropsten.zksync.io)
  * [```beta-ropsten```](https://ropsten-beta-checkout-zksync.web.app)
  * [```beta-rinkeby```](https://rinkeby-beta-checkout-zksync.web.app)

  1) Production-ready, deployed for the clients, users or developers:
     * **mainnet** → [zksync-vue-mainnet](https://wallet.zksync.io)
     * **prod-rinkeby** → [zksync-vue-rinkeby-2](https://rinkeby.zksync.io)
  2) Beta version (w/t partial NFT-support & upcoming NFT+Swap support)
     * **rinkeby-beta** → [beta-rinkeby-zksync-vue](https://rinkeby-beta-wallet.zksync.dev/)
     * **prod-ropsten** → [zksync-vue-ropsten](https://ropsten.zksync.io)
  3) Dev-only hosts: 
     * **stage-mainnet** → [zksync-vue](https://stage.zksync.io)
     * **dev-rinkeby** → [rinkeby-wallet-zksync](https://rinkeby-wallet-zksync.web.app/)


## Build Setup

``` bash
# install dependencies && populate .env file as of RINKEBY connection (clear install)
$ yarn ci:clear

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

- [Nuxt.js](https://nuxtjs.org)
- [TS Lang](https://www.typescriptlang.org)
- [Rollup zkSync.io](https://zksync.io)
- [prettier.js](https://prettier.io)
- [eslint.js](https://eslint.org/)
- [Vue.js](https://vuejs.org)
- [Vuex](https://vuex.vuejs.org)
- [nuxt/Tailwind](https://tailwindcss.nuxtjs.org/)
- [nuxt-build-optimisations](https://github.com/harlan-zw/nuxt-build-optimisations)
- [Sentry.io](https://sentry.io)
- [Onboarding.js](https://github.com/matter-labs-forks/onboard)
- [Typed Vuex](https://typed-vuex.roe.dev/)
- [Remix Icon](https://remixicon.com/)
- [Oh, Vue Icons!](https://oh-vue-icons.netlify.app)
- [Nuxt TypeScript](https://typescript.nuxtjs.org/)
- [Axios Nuxtjs](https://axios.nuxtjs.org/)
- [zksync.js](https://zksync.io/api/sdk/js/tutorial.html)
- [EthersJs](https://docs.ethers.io/v5/): a simple to use Web3 Provider Bridge as a single JavaScript file

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

---

# zkSync Ecosystem

- [Integration Docs](https://zksync.io/dev)
- [Available API & protocols](https://zksync.io/api/)
- [zkWallet](https://wallet.zksync.io/)
- [zkMint](https://mint.zksync.dev/)
- [Alternative Withdrawal](https://withdraw.zksync.io/)
- [zkScan](https://zkscan.io/)
- [’out-of-gas’ issue solver ](https://withdraw.zksync.io/)
- [zkSync Checkout lib](https://www.npmjs.com/package/zksync-checkout): our open sourced NPM-package
- [zkSync.js lib](https://www.npmjs.com/package/zksync-checkout): our open sourced NPM-package
- [zkCheckout link builder](https://checkout.zksync.io/link): UI to create unique permissionless payment link and get paid in tokens
- [SDK description](https://zksync.io/api/sdk/checkout/): details on how to use zkCheckout SDK

  ...and others.

---

- [Matter Labs: creators of the zkSync](https://matter-labs.io)
- [zkSync Homepage](https://zksync.io)

---
> BTW, we're hiring: [See open positions](https://matter-labs.io/#jobs)

## License

zkWallet is distributed under the terms of both the MIT license, and the Apache License (v.2.0).

See [LICENSE-APACHE](LICENSE-APACHE), [LICENSE-MIT](LICENSE-MIT) for details.