import { BigNumber } from "ethers";
import { DecimalBalance } from "@rsksmart/rif-rollup-nuxt-core/types";
import { ZkSyncTransaction } from "zksync-checkout/build/types";
import { TokenSymbol, Address } from "@rsksmart/rif-rollup-js-sdk/build/types";

export type PaymentItem = {
  address: Address;
  token: TokenSymbol;
  amount: DecimalBalance;
};
export type TransactionData = {
  transactions: Array<ZkSyncTransaction>;
  fromAddress: Address;
  feeToken: TokenSymbol;
  domains: Map<Address, string>;
};
export type TransactionFee = {
  key: string;
  amount: BigNumber;
  realAmount: BigNumber;
  token: TokenSymbol;
  to?: Address;
};
export type TotalByToken = {
  [token: string]: BigNumber;
};

export type ZkSingleToken = {
  address: string;
  id: number;
  symbol: string;
  decimals: number;
};
// Tokens are indexed by their symbol (e.g. "ETH")
export type ZkTokens = Iterator<string, ZkSingleToken>;

export type ZKISingleRampConfig = {
  url?: string;
  hostApiKey: string;
};
export type ZKIRampConfig = {
  goerli: ZKISingleRampConfig;
  mainnet: ZKISingleRampConfig;
};
