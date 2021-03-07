export default async (context: any) => {
  context.store.commit('checkout/setTransactionData', {
    transactions: [
      {
        to: "0x2D9835a1C1662559975B00AEA00e326D1F9f13d0",
        token: "DAI",
        amount: "43000000000000000000",
        description: "For apples",
      },
      {
        to: "0x2D9835a1C1662559975B00AEA00e326D1F9f13d0",
        token: "ETH",
        amount: "92000000000000000",
        description: "For bananananas",
      },
    ],
    fromAddress: "0x2D9835a1C1662559975B00AEA00e326D1F9f13d0",
    feeToken: "ETH"
  });
  await context.store.dispatch('wallet/getProviders');
  await context.store.dispatch('tokens/loadAllTokens');
  await context.store.dispatch('checkout/getTransactionFees');
}
