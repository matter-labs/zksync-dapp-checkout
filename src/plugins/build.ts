import moment from "moment";
import { Network } from "zksync/build/types.d";
import { version as zkSyncVersion } from "zksync/package.json";
import { version } from "../../package.json";


type networkIDS = {
  [key: string]: number;
};

export const _ETHER_NETWORK_ID_DICTIONARY: networkIDS = {
  rinkeby: 4,
  ropsten: 3,
  mainnet: 1,
};

export const GIT_REVISION_DATE = process.env.APP_GIT_UPDATED_AT ?? moment().format("d.m.Y");

export const GIT_REVISION: string = process.env.APP_GIT_REVISION ? process.env.APP_GIT_REVISION.toString() : "";
export const GIT_REVISION_SHORT: string = GIT_REVISION.length > 8 ? GIT_REVISION.slice(-7) : GIT_REVISION;
export const VERSION: string = version;
export const ETHER_NETWORK_NAME: Network = process.env.APP_CURRENT_NETWORK as Network;

export const ZK_LIB_VERSION = zkSyncVersion ?? "latest";
export const ZK_IS_BETA: boolean = zkSyncVersion.search("beta") !== -1 || process.env.ZK_NETWORK !== undefined || ETHER_NETWORK_NAME === "ropsten";
export const ETHER_NETWORK_CAPITALIZED = `${ETHER_NETWORK_NAME.charAt(0).toUpperCase()}${ETHER_NETWORK_NAME?.slice(1)}`;
export const CURRENT_APP_NAME = "zkSync Checkout";

export const ETHER_PRODUCTION: boolean = ETHER_NETWORK_NAME === "mainnet";

export const ETHER_PREFIX: string = ETHER_PRODUCTION ? "":ETHER_NETWORK_NAME;

export const ETHER_PREFIX_DOT: string = ETHER_PREFIX + (ETHER_PRODUCTION ? "":".");
export const ETHER_PREFIX_MINUS: string = ETHER_PREFIX + (ETHER_PRODUCTION ? "":"-");

export const ZK_NETWORK: string = process.env.ZK_NETWORK ? process.env.ZK_NETWORK : ETHER_NETWORK_NAME;
export const APP_ZK_SCAN: string = process.env.ZK_SPECIAL_SCAN ? process.env.ZK_SPECIAL_SCAN : `https://${ETHER_PREFIX_DOT}zkscan.io`;
export const APP_ZK_LINK: string = `https://link.zksync.io`;
export const APP_ZKSYNC_BLOCK_EXPLORER = `${APP_ZK_SCAN}/explorer`;
export const APP_ETH_BLOCK_EXPLORER = `https://${ETHER_PREFIX_DOT}etherscan.io`;

/**
 * zkLink
 */
export const TWEET_URL = 'https://twitter.com/intent/tweet?url=';
export const FACEBOOK_URL = 'https://www.facebook.com/sharer/sharer.php?u=';


export const rampConfig = {
    mainnet: {
        url: undefined, // default
        hostApiKey: process.env.RAMP_MAINNET_HOST_API_KEY,
    },
    rinkeby: {
        url: "https://ri-widget-staging.firebaseapp.com/",
        hostApiKey: process.env.RAMP_RINKEBY_HOST_API_KEY,
    },
    // ropsten: {
    //   url: "https://ri-widget-staging-ropsten.firebaseapp.com/",
    //   hostApiKey: process.env.RAMP_ROPSTEN_HOST_API_KEY,
    // },
};