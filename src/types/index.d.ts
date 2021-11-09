import { BigNumber } from "ethers";
import { DecimalBalance } from "matter-dapp-module/types";
import { ZkSyncTransaction } from "zksync-checkout/src/types";
import { TokenSymbol, Address } from "zksync/build/types";

export type PaymentItem = {
  address: Address;
  token: TokenSymbol;
  amount: DecimalBalance;
};
export type TransactionData = {
  transactions: Array<ZkSyncTransaction>;
  fromAddress: Address;
  feeToken: TokenSymbol;
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