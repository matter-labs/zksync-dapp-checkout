export default async (context: any) => {
  context.store.commit("checkout/setTransactionData", {
    transactions: [
      {
        to: "0x2D9835a1C1662559975B00AEA00e326D1F9f13d0",
        token: "DAI",
        amount: "3000000000000000",
        description: "For apples",
      },
      {
        to: "0x2D9835a1C1662559975B00AEA00e326D1F9f13d0",
        token: "ETH",
        amount: "8000000000000",
        description: "For bananananas",
      },
      {
        to: "0x2D9835a1C1662559975B00AEA00e326D1F9f13d0",
        token: "USDT",
        amount: "1000",
        description: "GME Stocks",
      },
    ],
    fromAddress: "",
    feeToken: "ETH",
  });
  await context.store.dispatch("wallet/getProviders");
  await context.store.dispatch("checkout/getTransactionBatchFee");
  await context.store.dispatch("tokens/loadAllTokens");
};
