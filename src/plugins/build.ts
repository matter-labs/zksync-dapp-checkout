import { Network } from "zksync/build/types.d";
import { version as zkSyncVersion } from "zksync/package.json";
import { version } from "../../package.json";

export const GIT_REVISION: string = process.env.APP_GIT_REVISION ? process.env.APP_GIT_REVISION.toString() : "";
export const GIT_REVISION_SHORT: string = GIT_REVISION.length > 8 ? GIT_REVISION.slice(-7) : GIT_REVISION;
export const VERSION: string = version;
export const ETHER_NETWORK_NAME: Network = process.env.APP_CURRENT_NETWORK as Network;

export const ZK_LIB_VERSION = zkSyncVersion ?? "latest";
export const ETHER_NETWORK_CAPITALIZED = `${ETHER_NETWORK_NAME.charAt(0).toUpperCase()}${ETHER_NETWORK_NAME?.slice(1)}`;
export const CURRENT_APP_NAME = "zkSync Checkout";
export const CURRENT_APP_TITLE = process.env.SITE_TITLE || CURRENT_APP_NAME;

export const ETHER_PRODUCTION: boolean = ETHER_NETWORK_NAME === "mainnet";

export const ZK_NETWORK: string = process.env.ZK_NETWORK ? process.env.ZK_NETWORK : ETHER_NETWORK_NAME;

/**
 * zkLink
 */
export const TWEET_URL = 'https://twitter.com/intent/tweet?url=';
export const FACEBOOK_URL = 'https://www.facebook.com/sharer/sharer.php?u=';
