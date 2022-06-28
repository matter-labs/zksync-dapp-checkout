import { isAddress } from "@ethersproject/address";
import { Address, TokenSymbol } from "zksync/build/types";
import { parseDecimal } from "@matterlabs/zksync-nuxt-core/utils";
import { RestProvider } from "zksync";
import { BigNumber } from "ethers";
import { PaymentItem, ZkTokens } from "@/types";

export const encrypt = (transactions: PaymentItem[]): string => {
  const hashedTransactions: string[] = [];
  for (const { address, token, amount } of transactions) {
    hashedTransactions.push([address, token, amount].join("|"));
  }
  return encodeURI(window.btoa(hashedTransactions.join("#")).replace(/=/g, ""));
};

type DecryptedPaymentItem = {
  address: Address;
  token: TokenSymbol;
  amount: BigNumber;
};

export const decrypt = (hash: string, syncProvider: RestProvider, tokens: ZkTokens): DecryptedPaymentItem[] => {
  const decoded = window.atob(decodeURI(hash));
  const transactionHashes: string[] = decoded.split("#");
  const transactions: DecryptedPaymentItem[] = [];
  for (const item of transactionHashes) {
    const [address, token, amount] = item.split("|");
    if (!isAddress(address) || !Object.prototype.hasOwnProperty.call(tokens, token)) {
      continue;
    }
    try {
      transactions.push({
        address,
        token,
        amount: parseDecimal(syncProvider, token, amount),
      });
    } catch (error) {
      console.warn(`Failed to parse amount of ${amount} for token ${token}`);
      continue;
    }
  }
  return transactions;
};
