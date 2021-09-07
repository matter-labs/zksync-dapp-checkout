import {addCPKToBatch} from "@/plugins/walletActions/cpk";
import {walletData} from "@/plugins/walletData";
import {BigNumber} from "ethers";
import {Address, TokenSymbol} from "~/types/index.d";
import {closestPackableTransactionFee} from "zksync";
import {ZkSyncTransaction} from "zksync-checkout/src/types";
import {ETHOperation, submitSignedTransactionsBatch} from "zksync/build/wallet";

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
export const transactionBatch = async (transactions: Array<ZkSyncTransaction>, feeToken: TokenSymbol, fee: BigNumber, nonce: number, changePubKey: boolean, store: any) => {
  const syncWallet = walletData.get().syncWallet!;

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
  // store.dispatch("transaction/watchDeposit", { depositTx: depositResponse, tokenSymbol: token, amount });
  return wallet?.depositToSyncFromEthereum({
    depositTo: wallet.address(),
    token,
    amount,
    ethTxOptions,
  });
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
