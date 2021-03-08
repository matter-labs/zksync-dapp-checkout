import { walletData } from "@/plugins/walletData";
import { Address, ETHOperation, GweiBalance, TokenSymbol, Tx, ZkSyncTransaction, Nonce } from "@/plugins/types";
import { BigNumber, BigNumberish } from "ethers";

/**
 * Transaction processing action
 *
 * @param {Address} address
 * @param {TokenSymbol} token
 * @param {TokenSymbol} feeToken
 * @param {GweiBalance} amountBigValue
 * @param {GweiBalance} feeBigValue
 * @param store
 * @returns {Promise<Transaction | Transaction[]>}
 */
export const transactionBatch = async (transactions: Array<ZkSyncTransaction>, feeToken: TokenSymbol, fee: BigNumberish, store: any) => {
  const syncWallet = walletData.get().syncWallet;
  let nonce = await syncWallet!.getNonce("committed");
  let transactionsaArray = [] as Array<{
    fee: BigNumberish;
    nonce: Nonce;
    amount: BigNumberish;
    to: Address;
    token: TokenSymbol;
  }>;

  for(const tx of transactions) {
    transactionsaArray.push({
      fee: 0,
      nonce,
      amount: tx.amount,
      to: (tx.to as Address),
      token: tx.token,
    });
    nonce+=1;
  }
  const feeTx = {
    fee: fee,
    nonce,
    amount: 0,
    to: syncWallet!.address(),
    token: feeToken,
  };
  const transferTransaction = await syncWallet!.syncMultiTransfer([...transactionsaArray, feeTx]);
  return transferTransaction;
};

/**
 * Generic method for batch transaction creation
 *
 * @param address
 * @param token
 * @param feeToken
 * @param amount
 * @param fastWithdraw
 * @param fees
 * @param store
 * @return {Promise<{txData: *, txHash: *}[]>}
 */
export const withdraw = async (address: Address, token: TokenSymbol, feeToken: TokenSymbol, amount: GweiBalance, fastWithdraw: boolean, fees: GweiBalance, store: any) => {
  const syncWallet = walletData.get().syncWallet;
  const amountBigValue = amount;
  const feeBigValue = fees;
  if (token === feeToken) {
    const transaction = await syncWallet!.withdrawFromSyncToEthereum({
      ethAddress: address,
      token,
      amount: amountBigValue,
      fee: feeBigValue,
      fastProcessing: fastWithdraw,
    });
    store.dispatch("transaction/watchTransaction", { transactionHash: transaction.txHash, tokenSymbol: token, type: "transfer" });
    return transaction;
  } else {
    const withdrawals = [
      {
        ethAddress: address,
        amount: amountBigValue,
        fee: "0",
        token,
      },
    ];
    const transfers = [
      {
        to: syncWallet!.address(),
        token: feeToken,
        amount: "0",
        fee: feeBigValue,
      },
    ];
    if (!syncWallet!.signer) {
      throw new Error("zkSync signer is required for sending zksync transactions.");
    } else if (transfers.length === 0) {
      throw new Error("No transfers in queue");
    }

    const signedTransactions = [] as Array<Tx>;
    let signWithdrawTransaction = null;

    let nextNonce = await syncWallet!.getNonce();

    for (let i = 0; i < withdrawals.length; i++) {
      const withdrawal = withdrawals[i];
      const nonce = nextNonce;
      nextNonce += 1;

      signWithdrawTransaction = await syncWallet!
        .signWithdrawFromSyncToEthereum({
          ...withdrawal,
          nonce,
        })
        .catch((error) => {
          throw new Error("Error while performing signWithdrawFromSyncToEthereum: " + error.message);
        });

      // @ts-ignore: Unreachable code error
      signedTransactions.push({ tx: signWithdrawTransaction.tx, signature: signWithdrawTransaction.ethereumSignature });
    }

    for (let i = 0; i < transfers.length; i++) {
      const transfer = transfers[i];
      const nonce = nextNonce;
      nextNonce += 1;

      const signTransaction = await syncWallet!
        .signSyncTransfer({
          ...transfer,
          nonce,
        })
        .catch((error) => {
          throw new Error("Error while performing signSyncTransfer: " + error.message);
        });

      // @ts-ignore: Unreachable code error
      signedTransactions.push({ tx: signTransaction.tx, signature: signTransaction.ethereumSignature });
    }

    const transactionHashes = await syncWallet!.provider.submitTxsBatch(signedTransactions).catch((error) => {
      throw new Error("Error while performing submitTxsBatch: " + error.message);
    });
    for (let a = 0; a < transactionHashes.length; a++) {
      store.dispatch("transaction/watchTransaction", { transactionHash: transactionHashes[a], tokenSymbol: a === 0 ? token : feeToken, type: "transfer" });
    }
    return transactionHashes.map((txHash, index) => ({
      txData: signedTransactions[index],
      txHash,
    }));
  }
};

/**
 * Deposit action method
 *
 * @param {TokenSymbol} token
 * @param {GweiBalance} amount
 * @param store
 * @returns {Promise<ETHOperation>}
 */
export const deposit = async (token: TokenSymbol, amount: GweiBalance, store: any): Promise<ETHOperation> => {
  const wallet = walletData.get().syncWallet;
  const depositResponse = await wallet?.depositToSyncFromEthereum({
    depositTo: wallet.address(),
    token,
    amount,
  });
  //store.dispatch("transaction/watchDeposit", { depositTx: depositResponse, tokenSymbol: token, amount });
  return depositResponse as ETHOperation;
};

/**
 * Unlock token action method
 *
 * @param {Address} address
 * @param store
 * @returns {Promise<ContractTransaction>}
 */
export const unlockToken = async (address: Address, store: any) => {
  const wallet = walletData.get().syncWallet;
  await store.dispatch("wallet/restoreProviderConnection");
  return await wallet!.approveERC20TokenDeposits(address as string);
};

/**
 * Change pub key method
 *
 * @param {TokenSymbol} feeToken
 * @param store
 * @returns {Promise<void>}
 */
export const changePubKey = async (feeToken: TokenSymbol, fee: BigNumber, store: any) => {
  const syncWallet = walletData.get().syncWallet;
  await store.dispatch("wallet/restoreProviderConnection");
  if (syncWallet?.ethSignerType?.verificationMethod === "ERC-1271") {
    const isOnchainAuthSigningKeySet = await syncWallet!.isOnchainAuthSigningKeySet();
    if (!isOnchainAuthSigningKeySet) {
      const onchainAuthTransaction = await syncWallet!.onchainAuthSigningKey();
      await onchainAuthTransaction?.wait();
    }

    const isSigningKeySet = await syncWallet!.isSigningKeySet();
    if (!isSigningKeySet) {
      const changePubkey = await syncWallet?.setSigningKey({
        feeToken,
        fee,
        nonce: "committed",
        ethAuthType: "Onchain",
      });
      await changePubkey?.awaitReceipt();
    }
  } else {
    const isSigningKeySet = await syncWallet!.isSigningKeySet();
    if (!isSigningKeySet) {
      const changePubkey = await syncWallet!.setSigningKey({
        feeToken,
        fee,
        ethAuthType: "ECDSA",
      });
      await changePubkey.awaitReceipt();
    }
  }
  const isSigningKeySet = await syncWallet?.isSigningKeySet();
  store.commit("wallet/setAccountLockedState", isSigningKeySet === false);

  const newAccountState = await syncWallet?.getAccountState();
  walletData.set({ accountState: newAccountState });
};
