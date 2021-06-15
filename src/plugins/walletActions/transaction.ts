import { addCPKToBatch } from "@/plugins/walletActions/cpk";
import { walletData } from "@/plugins/walletData";
import { BigNumber, BigNumberish } from "ethers";
import { Address, TokenSymbol } from "types";
import { ZkSyncTransaction } from "zksync-checkout/src/types";
import { closestPackableTransactionFee, Provider } from "zksync";
import { ETHOperation } from "zksync/build/wallet";
import { SignedTransaction, TransactionReceipt, TxEthSignature } from "zksync/src/types";

class Transaction {
  state: "Sent" | "Committed" | "Verified" | "Failed";
  error?: string;

  // @ts-ignore
  constructor(public txData, public txHash: string, public sidechainProvider: Provider) {
    this.state = "Sent";
  }

  async awaitReceipt(): Promise<TransactionReceipt> {
    this.throwErrorIfFailedState();

    // @ts-ignore
    if (this.state !== "Sent") return;

    const receipt = await this.sidechainProvider.notifyTransaction(this.txHash, "COMMIT");

    if (!receipt.success) {
      this.setErrorState(`zkSync transaction failed: ${receipt.failReason}` /* , receipt */);
      this.throwErrorIfFailedState();
    }

    this.state = "Committed";
    return receipt;
  }

  async awaitVerifyReceipt(): Promise<TransactionReceipt> {
    await this.awaitReceipt();
    const receipt = await this.sidechainProvider.notifyTransaction(this.txHash, "VERIFY");

    this.state = "Verified";
    return receipt;
  }

  private setErrorState(error: string) {
    this.state = "Failed";
    this.error = error;
  }

  private throwErrorIfFailedState() {
    if (this.state === "Failed") throw this.error;
  }
}

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
 * @param changePubKey
 * @param store
 * @returns {Promise<Transaction | Transaction[]>}
 */
export const transactionBatch = async (transactions: Array<ZkSyncTransaction>, feeToken: TokenSymbol, fee: BigNumber, changePubKey: boolean, store: any) => {
  const syncWallet = walletData.get().syncWallet!;

  await store.dispatch("wallet/restoreProviderConnection");
  const nonce = await syncWallet.getNonce("committed");
  const batchBuilder = syncWallet.batchBuilder(nonce);
  if (changePubKey) {
    await addCPKToBatch(syncWallet, feeToken, batchBuilder, store);
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
    fee: closestPackableTransactionFee(store.getters["wallet/isAccountLocked"] ? fee.add(store.getters["checkout/getAccountUnlockFee"]) : fee),
    amount: 0,
    to: syncWallet!.address(),
    token: feeToken,
  });
  const batchTransactionData = await batchBuilder.build();
  return await submitSignedTransactionsBatch(syncWallet.provider, batchTransactionData.txs, [batchTransactionData.signature]);
};

/**
 * Deposit action method
 *
 * @param {TokenSymbol} token
 * @param {string} amount
 * @returns {Promise<ETHOperation>}
 */
export const deposit = async (token: TokenSymbol, amount: string | BigNumber): Promise<ETHOperation | undefined> => {
  const wallet = walletData.get().syncWallet;
  // console.log(token)
  const ethTxOptions =
    token?.toLowerCase() === "eth"
      ? {}
      : {
          gasLimit: "160000",
        };
  const depositResponse = await wallet?.depositToSyncFromEthereum({
    depositTo: wallet.address(),
    token,
    amount,
    ethTxOptions,
  });
  // store.dispatch("transaction/watchDeposit", { depositTx: depositResponse, tokenSymbol: token, amount });
  return depositResponse;
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
