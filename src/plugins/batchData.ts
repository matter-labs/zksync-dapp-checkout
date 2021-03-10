import { walletData } from '@/plugins/walletData';

let batchBuilder = undefined as any;

export const batchData = {
  get: (): any => {
    return batchBuilder;
  },
  create: async (): Promise<void> => {
    const syncWallet = walletData.get().syncWallet;
    /* const nonce = await syncWallet!.getNonce("committed"); */
    batchBuilder = syncWallet!.batchBuilder(/* nonce */);
  },
};
