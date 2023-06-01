import { isAddress } from "@ethersproject/address";
import { Address, TokenSymbol } from "zksync/build/types";
import { parseDecimal } from "@rsksmart/rif-rollup-nuxt-core/utils";
import { RestProvider } from "zksync";
import { BigNumber } from "ethers";
import { UNSResolver } from "./uns";
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
  domain: string | null;
};

export const decrypt = async (hash: string, syncProvider: RestProvider, tokens: ZkTokens): Promise<DecryptedPaymentItem[]> => {
  const decoded = window.atob(decodeURI(hash));
  const transactionHashes: string[] = decoded.split("#");
  const transactions: DecryptedPaymentItem[] = [];
  const domainResolver = new UNSResolver();
  for (const item of transactionHashes) {
    const [address, token, amount] = item.split("|");
    const domainAddress = await domainResolver.lookupDomain(address, token);
    if ((!isAddress(address) && !domainAddress) || !Object.prototype.hasOwnProperty.call(tokens, token)) {
      continue;
    }
    try {
      transactions.push({
        address: domainAddress || address,
        token,
        amount: parseDecimal(syncProvider, token, amount),
        domain: domainAddress ? address : null,
      });
    } catch (error) {
      console.warn(`Failed to parse amount of ${amount} for token ${token}`);
      continue;
    }
  }
  return transactions;
};
