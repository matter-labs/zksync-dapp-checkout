import { BigNumber, BigNumberish, ContractTransaction } from "ethers";
import { Route } from "vue-router/types";
import { Provider } from "zksync";
import {
  AccountState,
  Address,
  ChangePubKeyCREATE2,
  ChangePubKeyECDSA,
  ChangePubKeyOnchain,
  ChangePubkeyTypes,
  LegacyChangePubKeyFee,
  NFT,
  Order,
  PubKeyHash,
  SignedTransaction,
  TokenSymbol,
  TransactionReceipt,
} from "zksync/build/types";
import { ETHOperation, Transaction, Wallet, ZKSyncTxError } from "zksync/build/wallet";
import { ZkSyncTransaction } from "zksync-checkout/build/types";

export interface ZkInFeesInterface {
  [symbol: string]: {
    [feeSymbol: string]: {
      [type: string]: {
        [address: string]: {
          lastUpdated: number;
          value: ZkInFeesObj;
        };
      };
    };
  };
}

export declare interface ZKInBatchFee {
  name: string;
  key: string;
  amount: BigNumber | BigNumberish | GweiBalance;
  realAmount: BigNumber | BigNumberish | GweiBalance;
  token: TokenSymbol;
}

export type TransactionData = {
  transactions: ZkSyncTransaction[];
  fromAddress: Address;
  feeToken?: TokenSymbol;
};
export type TransactionFee = {
  name: string;
  key: string;
  amount: BigNumber;
  token: TokenSymbol;
  to?: Address;
};
export type TotalByToken = {
  [token: string]: BigNumber;
};

export type PaymentItem = {
  address: Address;
  token: TokenSymbol;
  amount: GweiBalance;
};

export declare type ZKTypeOperations =
  | "Deposit"
  | "Withdraw"
  | "Transfer"
  | "FastWithdraw"
  | "MintNFT"
  | "WithdrawNFT"
  | "FastWithdrawNFT"
  | "ChangePubKey"
  | ChangePubkeyTypes
  | LegacyChangePubKeyFee
  | "Swap";
export declare type ZKTypeTransactionType = "withdraw" | "transfer" | "deposit" | "nft-transfer" | "nft-withdraw";
export declare type ZKTypeDisplayToken = {
  symbol: TokenSymbol;
  rawBalance?: BigNumber;
  status?: string;
  pendingBalance?: BigNumber;
};

export declare type ZKDisplayToken = {
  symbol: string;
  rawBalance?: BigNumber;
  status?: string;
};

export declare type VueRefs = Vue & { validate: () => boolean };

export declare type ZKTypeDisplayBalances = {
  [symbol: string]: ZKTypeDisplayToken;
};

export declare type GweiBalance = string | BigNumberish;
export declare type DecimalBalance = string | GweiBalance;
export declare type Hash = string;

export declare interface ZkInFeeChange {
  headline: string;
  symbol: TokenSymbol;
  amount: GweiBalance;
}

export declare interface ZkInTokenPrices {
  [token: string]: {
    lastUpdated: number;
    price: number;
  };
}

export interface BalanceToReturn {
  address: string;
  balance: string;
  symbol: string;
  id: number;
}

export interface ZkInBalance {
  id: number;
  symbol: TokenSymbol;
  status: "Pending" | "Verified";
  balance: DecimalBalance;
  rawBalance: BigNumber;
  verifiedBalance: DecimalBalance;
  tokenPrice?: number;
  restricted: boolean;
  unlocked?: boolean | BigNumber;
  address?: string;
}

export interface Balance {
  id?: number;
  symbol: TokenSymbol;
  status: "Pending" | "Verified";
  balance: DecimalBalance;
  rawBalance: BigNumber;
  verifiedBalance: DecimalBalance;
  tokenPrice: string;
  restricted: boolean;
  unlocked?: BigNumber;
  address?: Address;
}

export interface ZkInNFT extends NFT {
  status: "Pending" | "Verified";
}

export declare interface ZkInTransactionInfo {
  continueBtnFunction: boolean;
  amount?: {
    amount: BigNumberish;
    token: false | ZkInBalance;
  };
  fee?: {
    amount: BigNumberish;
    token: false | ZkInBalance;
  };
  recipient?: {
    address: Address;
    name: string;
  };
  success: boolean;
  continueBtnText?: string;
  type: string;
  hash: string;
  explorerLink: string;
}

export interface ZkInTx extends ETHOperation {
  tx_id: string; // Unique identifier of a transaction, designated to be used in relative tx history queries.
  hash: string; // Hash of a transaction.
  eth_block?: number; // Number of Ethereum block in which priority operation was added. `null` for transactions.
  pq_id?: number; // Identifier of a priority operation. `null` for transactions.
  success?: boolean; // Flag for successful transaction execution. `null` for priority operations.
  fail_reason?: string; // Reason of the transaction failure. May be `null`.
  commited: boolean; // Flag for inclusion of transaction into some block.
  verified: boolean; // Flag of having the block with transaction verified.
  created_at: string; // Timestamp of the transaction execution.
  confirmCount: number;
  tx: {
    orders?: [Order, Order];
    // Transaction / Priority operation contents. Structure depends on the type of operation.
    fast: boolean;
    amount: string;
    fee: string;
    from: string;
    nonce: number;
    priority_op?: {
      amount: string;
      from: string;
      to: string;
      token: string;
    };
    signature: {
      pubKey: string;
      signature: string;
    };
    to?: string;
    token?: string;
    feeToken?: number;
    type: ZKTypeOperations;
    creatorId?: number;
    creatorAddress?: Address;
    recipient?: Address;
    contentHash?: string;
  };
}

export interface TokenInfo {
  address: string;
  id: number;
  symbol: string;
  decimals: number;
}

export interface ZkInToken {
  id: number;
  symbol: TokenSymbol;
  balance: GweiBalance;
  rawBalance: BigNumber;
  verifiedBalance: GweiBalance;
  restricted: boolean;
  unlocked?: boolean;
  address?: string;
}

export interface ZkInContact {
  address: Address;
  name: string;
  deleted?: boolean;
  notInContacts?: boolean;
}

export interface ZkInFeesObj {
  normal?: GweiBalance | BigNumber;
  fast?: GweiBalance | BigNumber;
}

export interface ZkInContractAddress {
  mainContract: string;
  govContract: string;
}

export interface ZkInTokenItem {
  address: string;
  id: number;
  symbol: string;
  decimals: number;
}

export interface TokenPrices {
  [token: string]: {
    lastUpdated: number;
    price: number;
  };
}

export declare class ZkClTransaction extends ETHOperation {
  txData: SignedTransaction;
  txHash: string;
  sidechainProvider: Provider;
  state: "Sent" | "Committed" | "Verified" | "Failed";
  error?: ZKSyncTxError;

  constructor(txData: ContractTransaction, txHash: string, sidechainProvider: Provider);

  awaitReceipt(): Promise<TransactionReceipt>;
}

export declare interface singleIcon {
  name: string;
  img: string;
  url: string;
  hideIn?: string;
}

export interface iWalletData {
  syncProvider?: Provider;
  syncWallet?: Wallet;
  accountState?: AccountState;
}

export declare interface iWalletWrapper {
  set: (val: iWalletData) => void;
  get: () => iWalletData;
  clear: () => void;
  syncProvider: {
    load: () => void;
    get: () => Promise<Provider>;
  };
}

export declare interface ZKInDepositTx extends ETHOperation {
  hash: string;
  amount: BigNumber | string;
  status: string;
  confirmations: number;
}

export declare interface ZkInDeposits {
  [tokenSymbol: string]: ZKInDepositTx[];
}

export interface Token {
  address: Address;
  balance: string | BigNumber;
  rawBalance: BigNumber;
  symbol: TokenSymbol;
  id: number;
  formattedBalance?: string;
  unlocked: boolean;
  unlockedAmount: BigNumber;
}

export declare interface networkEthId {
  name: string;
  id: number;
}

export declare interface ZkInWithdrawParams {
  address: Address;
  token: TokenSymbol;
  feeToken: TokenSymbol;
  amount: GweiBalance;
  fastWithdraw: boolean;
  fees: GweiBalance;
}

export declare interface ZkInSyncTransfer {
  to: Address;
  token: TokenSymbol;
  amount: GweiBalance;
  fee: GweiBalance;
}

export declare interface ZkInWatchArgs {
  depositResponse: ETHOperation;
  token: TokenSymbol;
  amount: GweiBalance;
}

export interface DepositsInterface {
  [tokenSymbol: string]: {
    hash: string;
    amount: string;
    status: string;
    confirmations: number;
  }[];
}

/**
 * Redeclared since we use TokenInfo which is a part of this interface
 */
export interface Tokens {
  // Tokens are indexed by their symbol (e.g. "ETH")
  [token: string]: TokenInfo;
}

export interface CPKLocal {
  accountId: number;
  account: Address;
  newPkHash: PubKeyHash;
  nonce: number;
  ethAuthData?: ChangePubKeyOnchain | ChangePubKeyECDSA | ChangePubKeyCREATE2;
  ethSignature?: string;
  validFrom: number;
  validUntil: number;
}

export interface ReceivedTransactions {
  transaction: Transaction | null;
  feeTransaction: Transaction | null;
  cpkTransaction: null | Transaction;
}

export declare interface ZkInWithdrawalTime {
  normal: number;
  fast: number;
}

export declare interface ZkIContracts {
  contactsList: ZkInContact[];
  storageKey?: string;
}

export declare interface ZkIAccount {
  loggedIn: boolean;
  selectedWallet?: string;
  loadingHint?: string;
  address?: Address;
  name?: string;
  errorsSpotted: boolean;
}

export interface ZkIFeesInterface {
  [symbol: string]: {
    [feeSymbol: string]: {
      [type: string]: {
        [address: string]: {
          lastUpdated: number;
          value: ZkInFeesObj;
        };
      };
    };
  };
}

export interface ZKIRootState {
  accountModalOpened?: string;
  previousRoute?: Route;
  /**
   * Used to handle modals and simplify the code
   */
  currentModal?: string;
  step: string;
  darkMode: boolean;
  lastScroll?: number;
}

export type ZkInBalancesList = {
  [token: string]: BigNumber;
};

export interface ZKITransactionsStore {
  watchedTransactions: {
    [txHash: string]: {
      [prop: string]: string;
      status: string;
    };
  };
  deposits: ZkInDeposits;
  forceUpdateTick: number;
  withdrawalTxToEthTx: Map<string, string>;
}

export interface ZKIDepositStatus {
  tokenSymbol: TokenSymbol;
  hash: string;
  amount: GweiBalance;
  status: string;
  confirmations: number;
}

export interface ZKStoreRequestBalancesParams {
  force?: boolean;
  offset?: number;
}

export declare interface feesInterface {
  [symbol: string]: {
    [feeSymbol: string]: {
      [type: string]: {
        [address: string]: {
          lastUpdated: number;
          value: ZkInFeesObj;
        };
      };
    };
  };
}

export declare interface iWallet {
  isAccountLocked: boolean;
  zkTokens: { lastUpdated: number; list: ZkInBalance[] };
  initialTokens: { lastUpdated: number; list: ZkInBalance[] };
  transactionsHistory: { lastUpdated: number; list: ZkInTx[] };
  withdrawalProcessingTime: false | { normal: number; fast: number };
  fees: ZkInFeesInterface;
}

export interface zkTokensParam {
  lastUpdated: number;
  list: ZkInBalance[];
}

export declare interface UpdatedFee {
  type: "batch" | "cpk";
  previous?: GweiBalance | BigNumber;
  new?: GweiBalance | BigNumber;
}

export declare type ZkTErrorModal =
  | {
      headline: string | undefined;
      text: string | undefined;
    }
  | undefined;