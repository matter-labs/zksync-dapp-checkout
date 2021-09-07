import { GweiBalance, ZkInNFT } from "@/types/lib";
import { walletData } from "@/plugins/walletData";
import { accessorType } from "@/store";
import { Transaction } from "zksync/build/wallet";
import { Address, SignedTransaction, TokenSymbol, TxEthSignature } from "zksync/build/types";
import { addCPKToBatch } from "@/plugins/walletActions/cpk";
import { closestPackableTransactionFee, Provider } from "zksync";
import { ZkSyncTransaction } from "zksync-checkout/build/types";
import { BigNumber } from "ethers";

export const submitSignedTransactionsBatch = async (provider: Provider, signedTxs: SignedTransaction[], ethSignatures?: TxEthSignature[]): Promise<Transaction[]> => {
  const transactionHashes = await provider.submitTxsBatch(
    signedTxs.map((tx) => {
      return { tx: tx.tx, signature: tx.ethereumSignature };
    }),
    // @ts-ignore
    ethSignatures,
  );
  return transactionHashes.map((txHash, idx) => new Transaction(signedTxs[idx], txHash, provider));
};

/**
 * Transaction processing action
 *
 * @param transactions
 * @param {TokenSymbol} feeToken
 * @param fee
 * @param nonce
 * @param changePubKey
 * @param store
 * @returns {Promise<Transaction | Transaction[]>}
 */
export const transactionBatch = async (
  transactions: Array<ZkSyncTransaction>,
  feeToken: TokenSymbol,
  fee: BigNumber | string,
  nonce: number,
  changePubKey: boolean,
  store: typeof accessorType,
): Promise<Transaction[]> => {
  const syncWallet = walletData.get().syncWallet!;

  const batchBuilder = syncWallet.batchBuilder(nonce);
  if (changePubKey) {
    await addCPKToBatch(syncWallet, fee, feeToken, batchBuilder, store);
  }
  for (const tx of transactions) {
    batchBuilder.addTransfer({
      fee: 0,
      amount: tx.amount,
      to: tx.to as Address,
      token: tx.token as string,
    });
  }
  batchBuilder.addTransfer({
    fee: closestPackableTransactionFee(store.wallet.isAccountLocked ? BigNumber.from(fee!.toString()).add(BigNumber.from(store.checkout.getAccountUnlockFee!)) : fee),
    amount: 0,
    to: syncWallet!.address(),
    token: feeToken,
  });
  const batchTransactionData = await batchBuilder.build();
  return await submitSignedTransactionsBatch(walletData.get().syncProvider!, batchTransactionData.txs, [batchTransactionData.signature]);
};

/**
 * Make zkSync transaction
 *
 * @param {Address} address
 * @param {TokenSymbol} token
 * @param {TokenSymbol} feeToken
 * @param {GweiBalance} amountBigValue
 * @param {GweiBalance} feeBigValue
 * @param store
 * @param accountActivationFee
 * @returns {Promise<Transaction[]>}
 */
export const transaction = async (
  address: Address,
  token: TokenSymbol,
  feeToken: TokenSymbol,
  amountBigValue: GweiBalance,
  feeBigValue: GweiBalance,
  store: typeof accessorType,
  accountActivationFee?: GweiBalance,
) => {
  const syncWallet = walletData.get().syncWallet!;
  const nonce = await syncWallet.getNonce("committed");
  const batchBuilder = syncWallet.batchBuilder(nonce);

  if (store.wallet.isAccountLocked) {
    if (!accountActivationFee) {
      throw new Error("No account activation fee found");
    }
    await addCPKToBatch(syncWallet, accountActivationFee, feeToken, batchBuilder, store);
  }
  if (token === feeToken) {
    batchBuilder.addTransfer({
      to: address,
      token,
      amount: amountBigValue,
      fee: feeBigValue,
    });
  } else {
    batchBuilder.addTransfer({
      fee: "0",
      amount: amountBigValue,
      to: address,
      token,
    });
    batchBuilder.addTransfer({
      fee: feeBigValue,
      amount: "0",
      to: syncWallet.address(),
      token: feeToken,
    });
  }
  const batchTransactionData = await batchBuilder.build();
  const transactions = await submitSignedTransactionsBatch(walletData.get().syncProvider!, batchTransactionData.txs, [batchTransactionData.signature]);
  for (const tx of transactions) {
    store.transaction.watchTransaction({ transactionHash: tx.txHash });
  }
  return labelTransactions(transactions);
};

interface WithdrawParams {
  address: Address;
  token: TokenSymbol;
  feeToken: TokenSymbol;
  amount: GweiBalance;
  fastWithdraw: boolean;
  fee: GweiBalance;
  accountActivationFee?: GweiBalance;
  store: typeof accessorType;
}

export const withdraw = async ({ address, token, feeToken, amount, fastWithdraw, fee, accountActivationFee, store }: WithdrawParams) => {
  const syncWallet = walletData.get().syncWallet!;
  const nonce = await syncWallet.getNonce("committed");
  const batchBuilder = syncWallet.batchBuilder(nonce);

  if (store.wallet.isAccountLocked) {
    if (!accountActivationFee) {
      throw new Error("No account activation fee found");
    }
    await addCPKToBatch(syncWallet, accountActivationFee, feeToken, batchBuilder, store);
  }
  if (token === feeToken) {
    batchBuilder.addWithdraw({
      ethAddress: address,
      token,
      amount,
      fee,
    });
  } else {
    batchBuilder.addWithdraw({
      fee: "0",
      amount,
      ethAddress: address,
      token,
    });
    batchBuilder.addTransfer({
      fee,
      amount: "0",
      to: syncWallet.address(),
      token: feeToken,
    });
  }
  const batchTransactionData = await batchBuilder.build();
  const transactions = await submitSignedTransactionsBatch(walletData.get().syncProvider!, batchTransactionData.txs, [batchTransactionData.signature]);
  for (const tx of transactions) {
    store.transaction.watchTransaction({ transactionHash: tx.txHash });
  }
  return labelTransactions(transactions);
};

interface WithdrawNFTParams {
  address: Address;
  token: ZkInNFT;
  feeToken: TokenSymbol;
  fastWithdraw: boolean;
  fee: GweiBalance;
  accountActivationFee?: GweiBalance;
  store: typeof accessorType;
}

/**
 * Generic method for batch transaction creation
 *
 * @param address
 * @param token
 * @param feeToken
 * @param amount
 * @param fastWithdraw
 * @param fee
 * @param accountActivationFee
 * @param store
 * @return {Promise<{txData: *, txHash: *}[]>}
 */
export const withdrawNFT = async ({ address, token, feeToken, fastWithdraw, fee, accountActivationFee, store }: WithdrawNFTParams) => {
  const syncWallet = walletData.get().syncWallet!;
  const nonce = await syncWallet.getNonce("committed");
  const batchBuilder = syncWallet.batchBuilder(nonce);

  if (store.wallet.isAccountLocked) {
    if (!accountActivationFee) {
      throw new Error("No account activation fee found");
    }
    await addCPKToBatch(syncWallet, accountActivationFee, feeToken, batchBuilder, store);
  }
  batchBuilder.addWithdrawNFT({
    to: address,
    token: token.id,
    feeToken,
    fee,
  });
  const batchTransactionData = await batchBuilder.build();
  const transactions = await submitSignedTransactionsBatch(walletData.get().syncProvider!, batchTransactionData.txs, [batchTransactionData.signature]);
  for (const tx of transactions) {
    store.transaction.watchTransaction({ transactionHash: tx.txHash });
  }
  return labelTransactions(transactions);
};

export const transferNFT = async (
  address: Address,
  token: ZkInNFT,
  feeToken: TokenSymbol,
  feeBigValue: GweiBalance,
  store: typeof accessorType,
  accountActivationFee?: GweiBalance,
) => {
  const syncWallet = walletData.get().syncWallet!;
  const nonce = await syncWallet.getNonce("committed");
  const batchBuilder = syncWallet.batchBuilder(nonce);

  if (store.wallet.isAccountLocked) {
    if (!accountActivationFee) {
      throw new Error("No account activation fee found");
    }
    await addCPKToBatch(syncWallet, accountActivationFee, feeToken, batchBuilder, store);
  }
  batchBuilder.addTransfer({
    fee: "0",
    amount: 1,
    to: address,
    token: token.id,
  });
  batchBuilder.addTransfer({
    fee: feeBigValue,
    amount: "0",
    to: syncWallet.address(),
    token: feeToken,
  });
  const batchTransactionData = await batchBuilder.build();
  const transactions = await submitSignedTransactionsBatch(walletData.get().syncProvider!, batchTransactionData.txs, [batchTransactionData.signature]);
  for (const tx of transactions) {
    store.transaction.watchTransaction({ transactionHash: tx.txHash });
  }
  return labelTransactions(transactions);
};

export const mintNFT = async (address: Address, hash: string, feeToken: TokenSymbol, feeBigValue: GweiBalance, store: typeof accessorType, accountActivationFee?: GweiBalance) => {
  const syncWallet = walletData.get().syncWallet!;
  const nonce = await syncWallet.getNonce("committed");
  const batchBuilder = syncWallet.batchBuilder(nonce);

  if (store.wallet.isAccountLocked) {
    if (!accountActivationFee) {
      throw new Error("No account activation fee found");
    }
    await addCPKToBatch(syncWallet, accountActivationFee, feeToken, batchBuilder, store);
  }
  batchBuilder.addMintNFT({
    fee: feeBigValue,
    recipient: address,
    contentHash: hash,
    feeToken,
  });
  const batchTransactionData = await batchBuilder.build();
  const transactions = await submitSignedTransactionsBatch(walletData.get().syncProvider!, batchTransactionData.txs, [batchTransactionData.signature]);
  for (const tx of transactions) {
    store.transaction.watchTransaction({ transactionHash: tx.txHash });
  }
  return labelTransactions(transactions);
};

export const labelTransactions = (transactions: Transaction[]) => {
  let transaction: Transaction | null = null;
  let feeTransaction: Transaction | null = null;
  let cpkTransaction: Transaction | null = null;
  for (const tx of transactions) {
    if (tx.txData.tx.type === "ChangePubKey") {
      cpkTransaction = tx;
      continue;
    }
    if (tx.txData.tx.fee === "0") {
      transaction = tx;
    } else if (tx.txData.tx.amount === "0") {
      feeTransaction = tx;
    }
  }
  if (!transaction) {
    for (const tx of transactions) {
      if (tx.txData.tx.type !== "ChangePubKey") {
        transaction = tx;
      }
    }
  }
  if (!feeTransaction) {
    feeTransaction = transaction;
  }
  return {
    transaction,
    feeTransaction,
    cpkTransaction,
  };
};

/**
 * Deposit action method
 *
 * @param {TokenSymbol} token
 * @param {GweiBalance} amount
 * @param store
 * @returns {Promise<any>}
 */
export const deposit = async (token: TokenSymbol, amount: GweiBalance, store: typeof accessorType) => {
  const syncWallet = walletData.get().syncWallet!;
  const ethTxOptions =
    token?.toLowerCase() === "eth"
      ? {}
      : {
          gasLimit: "160000",
        };
  const depositResponse = await syncWallet.depositToSyncFromEthereum({
    depositTo: syncWallet.address(),
    token,
    amount,
    ethTxOptions,
  });
  store.transaction.watchDeposit({ depositTx: depositResponse, tokenSymbol: token, amount });
  return depositResponse;
};

/**
 * Unlock token action method
 *
 * @param {Address} address
 * @returns {Promise<any>}
 */
export const unlockToken = async (address: Address) => {
  const wallet = walletData.get().syncWallet;
  return await wallet!.approveERC20TokenDeposits(address as string);
};