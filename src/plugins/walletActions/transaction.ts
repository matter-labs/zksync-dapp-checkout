import { BigNumber } from "ethers";
import { Wallet } from "zksync";
import { ZkSyncTransaction } from "zksync-checkout/build/types";
import { submitSignedTransactionsBatch } from "zksync/build/wallet";
import { TokenSymbol, Address } from "zksync/build/types";
import { screenAddress } from "@matterlabs/zksync-nuxt-core/utils/screening";
/**
 * Transaction processing action
 *
 * @param transactions
 * @param {TokenSymbol} feeToken
 * @param fee
 * @param nonce
 * @param store
 * @param statusFunction
 * @returns {Promise<Transaction | Transaction[]>}
 */
export const transactionBatch = async (
  transactions: Array<ZkSyncTransaction>,
  feeToken: TokenSymbol,
  fee: BigNumber,
  nonce: number,
  store: any,
  statusFunction: Function
) => {
  const syncWallet: Wallet = store.getters["zk-wallet/syncWallet"];
  const batchBuilder = syncWallet.batchBuilder(nonce);
  await store.dispatch("zk-transaction/addCPKToBatch", batchBuilder);
  for (const tx of transactions) {
    batchBuilder.addTransfer({
      fee: 0,
      amount: tx.amount,
      to: tx.to as Address,
      token: tx.token as string,
    });
  }
  batchBuilder.addTransfer({
    fee,
    amount: 0,
    to: syncWallet.address(),
    token: feeToken,
  });

  if (process.env.SCREENING_API_URL) {
    await Promise.all([
      ...transactions.map((e) => screenAddress(e.to, process.env.SCREENING_API_URL!)),
      store.dispatch("zk-account/screenAccountAddress", null, { root: true }),
    ]);
  }
  statusFunction("waitingUserConfirmation");
  const batchTransactionData = await batchBuilder.build();
  statusFunction("processing");
  return await submitSignedTransactionsBatch(
    syncWallet.provider,
    batchTransactionData.txs,
    batchTransactionData.signature ? [batchTransactionData.signature] : undefined
  );
};
