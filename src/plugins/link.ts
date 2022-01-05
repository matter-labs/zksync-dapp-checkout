import { PaymentItem } from "@/types";

export const encrypt = (transactions: PaymentItem[]): string => {
  const hashedTransactions: string[] = [];
  for (const { address, token, amount } of transactions) {
    hashedTransactions.push([address, token, amount].join("|"));
  }
  return encodeURI(window.btoa(hashedTransactions.join("#")).replace(/=/g, ""));
};

export const decrypt = (hash: string): PaymentItem[] => {
  const decoded = window.atob(decodeURI(hash));
  const transactionHashes: string[] = decoded.split("#");
  const transactions: PaymentItem[] = [];
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
