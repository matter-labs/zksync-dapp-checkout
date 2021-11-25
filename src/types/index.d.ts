import { BigNumber, BigNumberish } from "ethers";
import { DecimalBalance } from "@matterlabs/zksync-nuxt-core/types";
import { ZkSyncTransaction } from "zksync-checkout/build/types";
import { Address, TokenSymbol } from "zksync/build/types";

export interface ZKIPaymentItem {
  address: Address;
  token: TokenSymbol;
  amount: DecimalBalance;
}

export interface ZKITransactionData {
  transactions: Array<ZkSyncTransaction>;
  fromAddress: Address;
  feeToken: TokenSymbol;
}

export interface ZKITransactionFee {
  key: string;
  amount: BigNumber;
  realAmount: BigNumber;
  token: TokenSymbol;
  to?: Address;
}

export type ZKTotalByToken = {
  [token: string]: BigNumber;
};

export interface ZKISingleToken {
  address: string;
  id: number;
  symbol: string;
  decimals: number;
}

// Tokens are indexed by their symbol (e.g. "ETH")
export type ZkTokens = Iterator<string, ZKISingleToken>;

export interface ZKISingleRampConfig {
  url?: string;
  hostApiKey: string;
}

export interface ZKIRampConfig {
  rinkeby: ZKISingleRampConfig;
  mainnet: ZKISingleRampConfig;
}

export interface ZKIUpdatedFee {
  type: "batch" | "cpk";
  previous: BigNumberish;
  new: BigNumberish;
}