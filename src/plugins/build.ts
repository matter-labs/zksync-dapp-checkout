import { Network } from "zksync/build/types.d";
import { version as zkSyncVersion } from "zksync/package.json";
import { NuxtOptionsBuild } from "@nuxt/types/config/build";
import { version } from "../../package.json";
import { ZKIRampConfig } from "~/types";

export const GIT_REVISION: string = process.env.APP_GIT_REVISION ? process.env.APP_GIT_REVISION.toString() : "";
export const GIT_REVISION_SHORT: string = GIT_REVISION.length > 8 ? GIT_REVISION.slice(-7) : GIT_REVISION;
export const VERSION: string = version;
export const ETHER_NETWORK_NAME: Network = process.env.APP_CURRENT_NETWORK as Network;
export const ETHER_PRODUCTION: boolean = ETHER_NETWORK_NAME === "mainnet";

const env = process.env.APP_ENV ?? "dev";
export const isProduction: boolean = ETHER_PRODUCTION && env === "prod";
export const isDebugEnabled: boolean = env === "dev";

const nuxtBuildOptionsDefault: NuxtOptionsBuild = {
  corejs: 3,
  ssr: false,
};
const nuxtBuildProdOptions: NuxtOptionsBuild = {
  ...nuxtBuildOptionsDefault,
  babel: {
    compact: true,
  },
  extractCSS: {
    ignoreOrder: true,
  },
  optimization: {
    removeAvailableModules: true,
    flagIncludedChunks: true,
    mergeDuplicateChunks: true,
    splitChunks: {
      chunks: "all",
      name: isProduction ? undefined : "chunk",
      maxSize: 900 * 1024,
    },
    nodeEnv: isProduction ? "14" : false,
    minimize: isProduction,
  },
  hardSource: isProduction,
};

export const nuxtBuildConfig = isProduction ? nuxtBuildProdOptions : nuxtBuildOptionsDefault;

export const ZK_LIB_VERSION = zkSyncVersion ?? "latest";
export const ETHER_NETWORK_CAPITALIZED = `${ETHER_NETWORK_NAME.charAt(0).toUpperCase()}${ETHER_NETWORK_NAME?.slice(1)}`;
export const CURRENT_APP_NAME = "zkSync Checkout";

export const CURRENT_APP_TITLE = process.env.SITE_TITLE || CURRENT_APP_NAME;

export const ZK_NETWORK: string = process.env.ZK_NETWORK ? process.env.ZK_NETWORK : ETHER_NETWORK_NAME;

/**
 * zkLink
 */
export const TWEET_URL = "https://twitter.com/intent/tweet?url=";
export const FACEBOOK_URL = "https://www.facebook.com/sharer/sharer.php?u=";

export const rampConfig: ZKIRampConfig = {
  mainnet: {
    url: undefined, // default
    hostApiKey: process.env.RAMP_MAINNET_HOST_API_KEY as string,
  },
  goerli: {
    url: "https://ri-widget-staging.firebaseapp.com/",
    hostApiKey: process.env.RAMP_GOERLI_HOST_API_KEY as string,
  },
};
