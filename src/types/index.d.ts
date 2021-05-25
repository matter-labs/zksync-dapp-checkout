/**
 * zkSync Types
 */
import { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers/lib/web3-provider";

// All interfaces, mappings and specific types
import "~/types/lib";
import { Store } from "vuex";

declare module "vue/types/vue" {
  interface Vue {
    inactive: boolean;
    $accessor: typeof Store;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $accessor: typeof Store;
  }
}

/**
 * @author Serge B. | Matter Labs
 * Shims-declaration of the [window.ethereum] (possibly undefined)
 */
declare global {
  interface Window {
    ethereum?: ExternalProvider | JsonRpcFetchFunc;
  }
}