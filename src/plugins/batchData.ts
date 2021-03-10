import { walletData } from '@/plugins/walletData';

let batchBuilder = undefined as any;

export const batchData = {
  get: (): any => {
    return batchBuilder;
  },
  create: async (nonce: number): Promise<void> => {
    const syncWallet = walletData.get().syncWallet;
    batchBuilder = syncWallet!.batchBuilder(nonce);
  },
};
