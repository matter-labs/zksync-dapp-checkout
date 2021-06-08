import { Wallet } from "zksync";
import { Provider, AccountState } from "@/plugins/types";

interface WalletData {
  [key: string]: object | undefined;
  syncProvider?: Provider;
  syncWallet?: Wallet;
  accountState?: AccountState;
  zkSync?: object;
}

const internalWalletData: WalletData = {
  syncProvider: undefined,
  syncWallet: undefined,
  accountState: undefined,
  zkSync: undefined,
};

/**
 * Wrapper for the major Providers
 * @type {{accountState: null, syncProvider: null, syncWallet: null, zkSync: any|null}}
 */
export const walletData = {
  /**
   * @return {Promise<null|*>}
   */
  zkSync: async (): Promise<any> => {
    if (!process.client) {
      return null;
    }
    if (!internalWalletData.zkSync) {
      [internalWalletData.zkSync] = await Promise.all([import("zksync")]);
    }
    return internalWalletData.zkSync;
  },
  get: (): WalletData => {
    return internalWalletData;
  },
  set: (val: object): void => {
    for (const [key, value] of Object.entries(val)) {
      internalWalletData[key] = value;
    }
  },
};
