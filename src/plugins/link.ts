import { ZKIPaymentItem } from "@/types";

export const encrypt = (transactions: ZKIPaymentItem[]): string => {
  let hashedTransactions: string[] = [];
  for (const { address, token, amount } of transactions) {
    hashedTransactions.push([address, token, amount].join("|"));
  }
  return encodeURI(window.btoa(hashedTransactions.join("#")).replace(/=/g, ""));
};

export const decrypt = (hash: string): ZKIPaymentItem[] => {
  const decoded = window.atob(decodeURI(hash));
  const transactionHashes: string[] = decoded.split("#");
  let transactions: ZKIPaymentItem[] = [];
  for (const item of transactionHashes) {
    const [address, token, amount] = item.split("|");
    transactions.push({
      address,
      token,
      amount,
    });
  }
  return transactions;
};