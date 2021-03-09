import { walletData } from '@/plugins/walletData';
import { Address, ETHOperation, GweiBalance, TokenSymbol, Tx, Wallet, ZkSyncTransaction, Provider } from '@/plugins/types';
import { BigNumber, BigNumberish } from 'ethers';
import { PriorityOperationReceipt, SignedTransaction, TransactionReceipt, TxEthSignature } from 'zksync/src/types';

declare class ZKSyncTxError extends Error {
  value: PriorityOperationReceipt | TransactionReceipt;
  constructor(message: string, value: PriorityOperationReceipt | TransactionReceipt);
}

class Transaction {
  state: 'Sent' | 'Committed' | 'Verified' | 'Failed';
  error?: ZKSyncTxError;

  // @ts-ignore
  constructor(public txData, public txHash: string, public sidechainProvider: Provider) {
    this.state = 'Sent';
  }

  async awaitReceipt(): Promise<TransactionReceipt> {
    this.throwErrorIfFailedState();

    // @ts-ignore
    if (this.state !== 'Sent') return;

    const receipt = await this.sidechainProvider.notifyTransaction(this.txHash, 'COMMIT');

    if (!receipt.success) {
      this.setErrorState(new ZKSyncTxError(`zkSync transaction failed: ${receipt.failReason}`, receipt));
      this.throwErrorIfFailedState();
    }

    this.state = 'Committed';
    return receipt;
  }

  async awaitVerifyReceipt(): Promise<TransactionReceipt> {
    await this.awaitReceipt();
    const receipt = await this.sidechainProvider.notifyTransaction(this.txHash, 'VERIFY');

    this.state = 'Verified';
    return receipt;
  }

  private setErrorState(error: ZKSyncTxError) {
    this.state = 'Failed';
    this.error = error;
  }

  private throwErrorIfFailedState() {
    if (this.state === 'Failed') throw this.error;
  }
}


export const submitSignedTransactionsBatch = async (
  provider: Provider,
  signedTxs: SignedTransaction[],
  ethSignatures?: TxEthSignature[]
): Promise<Transaction[]> => {
  const transactionHashes = await provider.submitTxsBatch(
    signedTxs.map((tx) => {
      return { tx: tx.tx, signature: tx.ethereumSignature };
    }),
    // @ts-ignore
    ethSignatures
  );
  return transactionHashes.map((txHash, idx) => new Transaction(signedTxs[idx], txHash, provider));
}

/**
 * Transaction processing action
 *
 * @param transactions
 * @param {TokenSymbol} feeToken
 * @param fee
 * @param changePubKey
 * @param store
 * @returns {Promise<Transaction | Transaction[]>}
 */
export const transactionBatch = async (transactions: Array<ZkSyncTransaction>, feeToken: TokenSymbol, fee: BigNumberish, changePubKey: Boolean, store: any) => {
  const syncWallet: Wallet|undefined = walletData.get().syncWallet;

  await store.dispatch("wallet/restoreProviderConnection");
  const nonce = await syncWallet!.getNonce("committed");
  let batchBuilder = syncWallet!.batchBuilder(nonce);
  if(changePubKey) {
    if (syncWallet?.ethSignerType?.verificationMethod === "ERC-1271") {
      const isOnchainAuthSigningKeySet = await syncWallet!.isOnchainAuthSigningKeySet();
      if (!isOnchainAuthSigningKeySet) {
        const onchainAuthTransaction = await syncWallet!.onchainAuthSigningKey();
        await onchainAuthTransaction?.wait();
      }
    }
    const ethAuthType = syncWallet?.ethSignerType?.verificationMethod === "ERC-1271" ? "Onchain" : "ECDSA";
    batchBuilder.addChangePubKey({feeToken, ethAuthType, fee: store.getters["checkout/getAccountUnlockFee"]});
  }
  for(const tx of transactions) {
    batchBuilder.addTransfer({
      fee: 0,
      amount: tx.amount,
      to: (tx.to as Address),
      token: (tx.token as string),
    });
  }
  batchBuilder.addTransfer({
    fee: fee,
    nonce,
    amount: 0,
    to: syncWallet!.address(),
    token: feeToken,
  });
  const batchTransactionData = await batchBuilder.build();
  return await submitSignedTransactionsBatch(<Provider>syncWallet!.provider, batchTransactionData.txs, [batchTransactionData.signature]);
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
 * @param {string} amount
 * @param store
 * @returns {Promise<ETHOperation>}
 */
export const deposit = async (token: TokenSymbol, amount: string | BigNumber, store: any): Promise<ETHOperation> => {
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
 * @returns {Promise<any>}
 */
export const unlockToken = async (address: Address, store: any) => {
  const wallet = walletData.get().syncWallet;
  await store.dispatch("wallet/restoreProviderConnection");
  return await wallet!.approveERC20TokenDeposits(address as string);
};
