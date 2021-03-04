import { AccountState, Provider, Wallet } from '@/plugins/types';

interface walletData {
  syncProvider?: Provider;
  syncWallet?: Wallet;
  accountState?: AccountState;
  zkSync?: object;
  [key: string]: object | undefined;
}

const internalWalletData: walletData = {
  syncProvider: undefined,
  syncWallet: undefined,
  accountState: undefined,
  zkSync: undefined,
};

/**
 * Wrapper for the major Providers
 * @type {{accountState: null, syncProvider: null, syncWallet: null, zkSync: any|null}}
 */
export const walletData: { set: (val: object) => void; zkSync: () => Promise<any>; get: () => walletData } = {
  /**
   * @return {Promise<null|*>}
   */
  zkSync: async (): Promise<any> => {
    if (!process.client) {
      return null;
    }
    if (!internalWalletData.zkSync) {
      internalWalletData.zkSync = await import('zksync');
    }
    return internalWalletData.zkSync;
  },
  get: (): walletData => {
    return internalWalletData;
  },
  set: (val: object): void => {
    for (const [key, value] of Object.entries(val)) {
      internalWalletData[key] = value;
    }
  },
};
