# Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

## [2.6.0-0](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.5.0...2.6.0-0) 
> 10 August 2021

- chore(pre-release): changelog update [`295d50b`](https://github.com/matter-labs/zksync-dapp-checkout/commit/295d50be64ed7f122e643550f9e71cd3c875ee1a)
- Feature/experiments with ci [`#46`](https://github.com/matter-labs/zksync-dapp-checkout/pull/46)
- Keriat zkf 730 ci final configuration and version [`#48`](https://github.com/matter-labs/zksync-dapp-checkout/pull/48)
- Update zkLink branch [`#49`](https://github.com/matter-labs/zksync-dapp-checkout/pull/49)
- v.2.5.0-PR (dev) zkSync Checkout [`#39`](https://github.com/matter-labs/zksync-dapp-checkout/pull/39)
- Pushing version to production [`#33`](https://github.com/matter-labs/zksync-dapp-checkout/pull/33)


## [2.5.0](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.4.0...2.5.0) 
> 16 June 2021

- Last fixes [`#37`](https://github.com/matter-labs/zksync-dapp-checkout/pull/37)
- Hide unlock button when not enough L1 balance [`#36`](https://github.com/matter-labs/zksync-dapp-checkout/pull/36)
- +25% default fee + note [`#35`](https://github.com/matter-labs/zksync-dapp-checkout/pull/35)
- Fee changes and small style edits [`#34`](https://github.com/matter-labs/zksync-dapp-checkout/pull/34)
- Small bug fixes [`#31`](https://github.com/matter-labs/zksync-dapp-checkout/pull/31)


- Last fixes [`#37`](https://github.com/matter-labs/zksync-dapp-checkout/pull/37)
- Hide unlock button when not enough L1 balance [`#36`](https://github.com/matter-labs/zksync-dapp-checkout/pull/36)
- +25% default fee + note [`#35`](https://github.com/matter-labs/zksync-dapp-checkout/pull/35)
- Fee changes and small style edits [`#34`](https://github.com/matter-labs/zksync-dapp-checkout/pull/34)

## [2.4.0](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.4.0-prerelease...2.4.0) | [2.4.0-prerelease](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.3.0...2.4.0-prerelease)

- Small bug fixes [`#31`](https://github.com/matter-labs/zksync-dapp-checkout/pull/31)
- Update firebase-hosting-merge.yml [`#27`](https://github.com/matter-labs/zksync-dapp-checkout/pull/27)
- fix zksync version [`#25`](https://github.com/matter-labs/zksync-dapp-checkout/pull/25)
- Revert "fix(Plugins): Onboard config changed" [`#24`](https://github.com/matter-labs/zksync-dapp-checkout/pull/24)
- fix(Plugins): Onboard config changed [`#23`](https://github.com/matter-labs/zksync-dapp-checkout/pull/23)
- Transaction process fixes and updates [`#15`](https://github.com/matter-labs/zksync-dapp-checkout/pull/15)
- Fixed checkout transaction check loop [`#14`](https://github.com/matter-labs/zksync-dapp-checkout/pull/14)
- changes [`#13`](https://github.com/matter-labs/zksync-dapp-checkout/pull/13)
- Fix for the reported by the gitcoin issue with the wrong transaction list [`#12`](https://github.com/matter-labs/zksync-dapp-checkout/pull/12)
- Feature/checkout logic implementation [`#10`](https://github.com/matter-labs/zksync-dapp-checkout/pull/10)
- gaslimit set to bignumber [`#9`](https://github.com/matter-labs/zksync-dapp-checkout/pull/9)
- update: Ui changes [`#8`](https://github.com/matter-labs/zksync-dapp-checkout/pull/8)
- Feature/checkout logic implementation [`#7`](https://github.com/matter-labs/zksync-dapp-checkout/pull/7)
- inversion fixed [`#6`](https://github.com/matter-labs/zksync-dapp-checkout/pull/6)
- Checking the realisation made [`#1`](https://github.com/matter-labs/zksync-dapp-checkout/pull/1)
- Fix hashes notifications 2 [`#4`](https://github.com/matter-labs/zksync-dapp-checkout/pull/4)

## [2.3.0](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.3.0-prerelease...2.3.0) | [2.3.0-prerelease](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.2.2...2.3.0-prerelease)

```bash
# Conflicts:
#	.env.example
#	README.md
#	nuxt.config.ts
#	package.json
#	src/assets/style/_default.scss
#	src/assets/style/_transitions.scss
#	src/assets/style/_variables.scss
#	src/assets/style/blocks/_infoBlock.scss
#	src/assets/style/blocks/_onboard.scss
#	src/assets/style/components/_closebtn.scss
#	src/assets/style/components/_defbtn.scss
#	src/assets/style/components/_lineBlock.scss
#	src/assets/style/components/_link.scss
#	src/assets/style/components/_loader.scss
#	src/assets/style/components/_modal.scss
#	src/assets/style/components/_valuesBlock.scss
#	src/assets/style/layouts/_default.scss
#	src/blocks/ConnectedWallet.vue
#	src/blocks/InfoBlock.vue
#	src/blocks/lineTableHeader.vue
#	src/blocks/loggingIn.vue
#	src/blocks/modals.vue
#	src/components/Closebtn.vue
#	src/components/Defbtn.vue
#	src/components/LineBlock.vue
#	src/components/Loader.vue
#	src/components/MaxHeight.vue
#	src/components/Modal.vue
#	src/components/Note.vue
#	src/components/SuccessMark.vue
#	src/components/TransactionToken.vue
#	src/components/ValuesBlock.vue
#	src/layouts/clear.vue
#	src/layouts/default.vue
#	src/pages/index.vue
#	src/plugins/main.ts
#	src/plugins/setCheckoutData.ts
#	src/plugins/walletActions/transaction.ts
#	src/plugins/walletData.ts
#	src/static/ilol48zhg7zypovk.html
#	src/store/account.ts
#	src/store/index.ts
#	src/store/scroll/index.ts
#	src/store/transaction.ts
#	src/store/wallet.ts
#	src/types/index.d.ts
#	yarn.lock
```
- Small bug fixes [`#31`](https://github.com/matter-labs/zksync-dapp-checkout/pull/31)
- Update firebase-hosting-merge.yml [`#27`](https://github.com/matter-labs/zksync-dapp-checkout/pull/27)
- fix zksync version [`#25`](https://github.com/matter-labs/zksync-dapp-checkout/pull/25)
- Revert "fix(Plugins): Onboard config changed" [`#24`](https://github.com/matter-labs/zksync-dapp-checkout/pull/24)
- fix(Plugins): Onboard config changed [`#23`](https://github.com/matter-labs/zksync-dapp-checkout/pull/23)

## [2.2.2](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.2.1...2.2.2)

* removed inkline
* added tailwind config
* created uber UI
- Transaction process fixes and updates [`#15`](https://github.com/matter-labs/zksync-dapp-checkout/pull/15)
- Fixed checkout transaction check loop [`#14`](https://github.com/matter-labs/zksync-dapp-checkout/pull/14)
- changes [`#13`](https://github.com/matter-labs/zksync-dapp-checkout/pull/13)
- Fix for the reported by the gitcoin issue with the wrong transaction list [`#12`](https://github.com/matter-labs/zksync-dapp-checkout/pull/12)
- Feature/checkout logic implementation [`#10`](https://github.com/matter-labs/zksync-dapp-checkout/pull/10)
- gaslimit set to bignumber [`#9`](https://github.com/matter-labs/zksync-dapp-checkout/pull/9)
- update: Ui changes [`#8`](https://github.com/matter-labs/zksync-dapp-checkout/pull/8)
- Feature/checkout logic implementation [`#7`](https://github.com/matter-labs/zksync-dapp-checkout/pull/7)
- inversion fixed [`#6`](https://github.com/matter-labs/zksync-dapp-checkout/pull/6)
- Checking the realisation made [`#1`](https://github.com/matter-labs/zksync-dapp-checkout/pull/1)
- Fix hashes notifications 2 [`#4`](https://github.com/matter-labs/zksync-dapp-checkout/pull/4)

## [2.2.1](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.2.0...2.2.1)


- Fix: Main button disabled state, fees store [`e9f0b31`](https://github.com/matter-labs/zksync-dapp-checkout/commit/e9f0b317e2249fc2f42d7bb7b95f145ca04da0ea)
- Updates: UI styling [`5aba6f4`](https://github.com/matter-labs/zksync-dapp-checkout/commit/5aba6f46b817423a2c5a1876979d4780351a2524)

## [2.2.0](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.9...2.2.0)


- update: refactoring of Dany's code [`7c428ea`](https://github.com/matter-labs/zksync-dapp-checkout/commit/7c428eaeedd98a28ffd549efceeeb327a24b5842)
- refactor: types matched [`628dafe`](https://github.com/matter-labs/zksync-dapp-checkout/commit/628dafe4074a948c2bcc9d6cffacb7ac0e86d60a)
- updated version [`14b59c1`](https://github.com/matter-labs/zksync-dapp-checkout/commit/14b59c1a8246ca95eb99eded6097fd72d3272842)

## [2.1.9](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.8...2.1.9)


### Conflicts:
```src/pages/index.vue```

- Fixes around the code [`7386dbe`](https://github.com/matter-labs/zksync-dapp-checkout/commit/7386dbed5b9204ac7fbba204f6f65f8e8be68eb0)
- Update: Transfer [`b59301d`](https://github.com/matter-labs/zksync-dapp-checkout/commit/b59301dc206b11319fedfcb9e86ec3a2f1c725ac)
- Update: code refactoring [`78ea491`](https://github.com/matter-labs/zksync-dapp-checkout/commit/78ea491a15b27d7568a71ea75269b6d8afcff9ef)

## [2.1.8](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.7...2.1.8)


## [2.1.7](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.6...2.1.7)


Update firebase-hosting-merge.yml

- Update firebase-hosting-merge.yml [`#27`](https://github.com/matter-labs/zksync-dapp-checkout/pull/27)

## [2.1.6](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.5...2.1.6)

- fix zksync version [`#25`](https://github.com/matter-labs/zksync-dapp-checkout/pull/25)

## [2.1.5](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.4...2.1.5)


- Revert "fix(Plugins): Onboard config changed" [`#24`](https://github.com/matter-labs/zksync-dapp-checkout/pull/24)

## [2.1.4](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.4-prerelease...2.1.4)


- fix(Plugins): Onboard config changed [`#23`](https://github.com/matter-labs/zksync-dapp-checkout/pull/23)

## [2.1.4-prerelease](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.3...2.1.4-prerelease)

- Push test env [`c8779a6`](https://github.com/matter-labs/zksync-dapp-checkout/commit/c8779a65804a06554723e614aacb3b55bbaa6a06)
- refactor(Dependencies update & WBTC token exclude from the test .html): [`6ce447d`](https://github.com/matter-labs/zksync-dapp-checkout/commit/6ce447d07c00ebad442a240538968ab71ccce225)
- refactor(Upgrade): Huge update which includes features, fixes and refactoring [`4e3c64b`](https://github.com/matter-labs/zksync-dapp-checkout/commit/4e3c64bdcf5369b51ed220b3018e9c7ec183afca)

## [2.1.3](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.2...2.1.3)

- Merge pull request #16 from matter-labs/feature/checkout-logic-implementation [`b239eeb`](https://github.com/matter-labs/zksync-dapp-checkout/commit/b239eebef8f315a0df181926ec7213e5455a43b6)
- Update: update transaction batch fee before transfer [`097170f`](https://github.com/matter-labs/zksync-dapp-checkout/commit/097170f89a0747f6558d2b58b40be4cee1f1f4ed)
- Transaction fee change note [`5b553f9`](https://github.com/matter-labs/zksync-dapp-checkout/commit/5b553f96bae363fb8a1b4f70ac925ae969253f8f)

## [2.1.2](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.1...2.1.2)

- Transaction process fixes and updates [`#15`](https://github.com/matter-labs/zksync-dapp-checkout/pull/15)

## [2.1.1](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.1-prerelease...2.1.1) | [2.1.1-prerelease](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.0...2.1.1-prerelease)


- Update firebase-hosting-merge.yml [`#27`](https://github.com/matter-labs/zksync-dapp-checkout/pull/27)
- fix zksync version [`#25`](https://github.com/matter-labs/zksync-dapp-checkout/pull/25)
- Revert "fix(Plugins): Onboard config changed" [`#24`](https://github.com/matter-labs/zksync-dapp-checkout/pull/24)
- fix(Plugins): Onboard config changed [`#23`](https://github.com/matter-labs/zksync-dapp-checkout/pull/23)
- Transaction process fixes and updates [`#15`](https://github.com/matter-labs/zksync-dapp-checkout/pull/15)
- Fixed checkout transaction check loop [`#14`](https://github.com/matter-labs/zksync-dapp-checkout/pull/14)

## [2.1.0](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.0-prerelease...2.1.0) | [2.1.0-prerelease](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.1.0-beta...2.1.0-prerelease) 


- build(build): Small configs change [`27a3c87`](https://github.com/matter-labs/zksync-dapp-checkout/commit/27a3c878acd2626143abcd538d997ab2b87e00db)
- build(config): Fix critical yarn issue (ending part) [`602651a`](https://github.com/matter-labs/zksync-dapp-checkout/commit/602651aa53a630c859e5c3cd0d550baac622d9d0)
- build(build): NPM-deps updated, lint/nuxt configs changed [`a9ebd7d`](https://github.com/matter-labs/zksync-dapp-checkout/commit/a9ebd7d8bb02f27563866871104b6c3a3e7f4864)

## [2.1.0-beta](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.0.3...2.1.0-beta)

- Update firebase-hosting-merge.yml [`#27`](https://github.com/matter-labs/zksync-dapp-checkout/pull/27)
- fix zksync version [`#25`](https://github.com/matter-labs/zksync-dapp-checkout/pull/25)
- Revert "fix(Plugins): Onboard config changed" [`#24`](https://github.com/matter-labs/zksync-dapp-checkout/pull/24)
- fix(Plugins): Onboard config changed [`#23`](https://github.com/matter-labs/zksync-dapp-checkout/pull/23)
- Transaction process fixes and updates [`#15`](https://github.com/matter-labs/zksync-dapp-checkout/pull/15)
- Fixed checkout transaction check loop [`#14`](https://github.com/matter-labs/zksync-dapp-checkout/pull/14)
- changes [`#13`](https://github.com/matter-labs/zksync-dapp-checkout/pull/13)

## [2.0.3](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.0.3-prerelease...2.0.3)

> 11 June 2021

Fix for the reported by the gitcoin issue with the wrong transaction list

- Fix for the reported by the gitcoin issue with the wrong transaction list [`#12`](https://github.com/matter-labs/zksync-dapp-checkout/pull/12)
- Feature/checkout logic implementation [`#10`](https://github.com/matter-labs/zksync-dapp-checkout/pull/10)
- gaslimit set to bignumber [`#9`](https://github.com/matter-labs/zksync-dapp-checkout/pull/9)
- update: Ui changes [`#8`](https://github.com/matter-labs/zksync-dapp-checkout/pull/8)
- Feature/checkout logic implementation [`#7`](https://github.com/matter-labs/zksync-dapp-checkout/pull/7)
- inversion fixed [`#6`](https://github.com/matter-labs/zksync-dapp-checkout/pull/6)
- Checking the realisation made [`#1`](https://github.com/matter-labs/zksync-dapp-checkout/pull/1)

## [2.0.3-prerelease](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.0.2...2.0.3-prerelease)


## [2.0.2](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.0.2-prerelease...2.0.2)


- Fix: transaction token deposit [`33d63bf`](https://github.com/matter-labs/zksync-dapp-checkout/commit/33d63bfd348220478c9518168f81f0382f2d8b7e)
- gas limit option set for any token except ETH [`4147389`](https://github.com/matter-labs/zksync-dapp-checkout/commit/414738969019f78325c1132cc4905afc08f3461d)
- Update: package update [`c3b11f7`](https://github.com/matter-labs/zksync-dapp-checkout/commit/c3b11f782edb82b1277d3f7fd8ab65e5ba49bafa)

## [2.0.2-prerelease](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.0.1-prerelease...2.0.2-prerelease)

- Fix hashes notifications 2 [`#4`](https://github.com/matter-labs/zksync-dapp-checkout/pull/4)

## [2.0.1-prerelease](https://github.com/matter-labs/zksync-dapp-checkout/compare/2.0.0-prerelease...2.0.1-prerelease)

- ChangePubKey done [`8c91cb8`](https://github.com/matter-labs/zksync-dapp-checkout/commit/8c91cb88726684fe6387e57d07f95d50fd781532)
- Fixed: batch Transaction processing [`2fa34e9`](https://github.com/matter-labs/zksync-dapp-checkout/commit/2fa34e9391240e40e5d59ca661a861cf30335880)
- Merge [`4e2d380`](https://github.com/matter-labs/zksync-dapp-checkout/commit/4e2d38080e9214a0bd9c1c8ff6149013fd9d9ec2)

## [2.0.0-prerelease](https://github.com/matter-labs/zksync-dapp-checkout/compare/1.1.0...2.0.0-prerelease)

## [1.1.0](https://github.com/matter-labs/zksync-dapp-checkout/compare/1.0.0...1.1.0)

- Checking the realisation made [`#1`](https://github.com/matter-labs/zksync-dapp-checkout/pull/1)
- Fix hashes notifications 2 [`#4`](https://github.com/matter-labs/zksync-dapp-checkout/pull/4)

### 1.0.0

- Initial commit [`7c9b25f`](https://github.com/matter-labs/zksync-dapp-checkout/commit/7c9b25f1d6173d8daae563cbfbc70a4083b0a3cf)
- Update: wallet connection, fixes of the UI [`4e5ccbb`](https://github.com/matter-labs/zksync-dapp-checkout/commit/4e5ccbbe139f8d534ee17ddbb3cd9bfb28467e1a)
- Update: built pre-release version [`172d3ef`](https://github.com/matter-labs/zksync-dapp-checkout/commit/172d3ef56662f7d7a56efa912628660b5f4792cd)