import moment from "moment";
import { Network } from "zksync/build/types";
import { version, dependencies } from "../../package.json";

type networkIDS = {
  [key: string]: number;
};

export const _ETHER_NETWORK_ID_DICTIONARY: networkIDS = {
  rinkeby: 4,
  ropsten: 3,
  mainnet: 1,
};

export const GIT_REVISION_DATE = process.env.APP_GIT_UPDATED_AT ?? moment().format("d.m.Y");
/**
 * @deprecated
 */
console.log(`This is ${version}, last commit was done at ${GIT_REVISION_DATE}`);

export const GIT_REVISION: string = process.env.APP_GIT_REVISION ? process.env.APP_GIT_REVISION.toString() : "";
export const GIT_REVISION_SHORT: string = GIT_REVISION ? GIT_REVISION.slice(-7) : "";
export const VERSION: string = version;
export const ETHER_NETWORK_NAME: Network = process.env.APP_CURRENT_NETWORK as Network;

export const ZK_LIB_VERSION = dependencies?.zksync ?? "latest";
export const ZK_IS_BETA: boolean = dependencies?.zksync.search("beta") !== -1 || process.env.ZK_NETWORK !== undefined || ETHER_NETWORK_NAME === "ropsten";
export const ETHER_NETWORK_CAPITALIZED = `${ETHER_NETWORK_NAME.charAt(0).toUpperCase()}${ETHER_NETWORK_NAME?.slice(1)}`;
export const CURRENT_APP_NAME = `zkSync Wallet${ZK_IS_BETA ? ":beta" : ""}`;

export const ETHER_PRODUCTION: boolean = ETHER_NETWORK_NAME === "mainnet";

export const ETHER_PREFIX: string = ETHER_PRODUCTION ? "" : ETHER_NETWORK_NAME;

export const ETHER_PREFIX_DOT: string = ETHER_PREFIX + (ETHER_PRODUCTION ? "" : ".");
export const ETHER_PREFIX_MINUS: string = ETHER_PREFIX + (ETHER_PRODUCTION ? "" : "-");

export const ETHER_NETWORK_ID: number | undefined = _ETHER_NETWORK_ID_DICTIONARY[ETHER_NETWORK_NAME as string];

export const ZK_API_BASE: string = process.env.ZK_SPECIAL_API ? process.env.ZK_SPECIAL_API : `${ETHER_PREFIX_MINUS}api.zksync.io`;
export const ZK_NETWORK: string = process.env.ZK_NETWORK ? process.env.ZK_NETWORK : ETHER_NETWORK_NAME;
export const APP_ZK_SCAN: string = process.env.ZK_SPECIAL_SCAN ? process.env.ZK_SPECIAL_SCAN : `https://${ETHER_PREFIX_DOT}zkscan.io`;
export const APP_ZKSYNC_BLOCK_EXPLORER = `${APP_ZK_SCAN}/explorer`;
export const APP_ETH_BLOCK_EXPLORER = `https://${ETHER_PREFIX_DOT}etherscan.io`;

/**
 * Onboard-only params
 */
export const ONBOARD_FORCED_EXIT_LINK: string | undefined = `https://withdraw${ETHER_PREFIX_MINUS}${ETHER_PRODUCTION ? ".zksync.io" : "-" + ETHER_NETWORK_NAME + ".zksync.dev"}`;
export const ONBOARD_FORTMATIC_KEY: string | undefined = process.env.APP_FORTMATIC;
export const ONBOARD_PORTIS_KEY: string | undefined = process.env.APP_PORTIS;
export const ONBOARD_INFURA_KEY: string | undefined = process.env.APP_WALLET_CONNECT;
export const ONBOARD_RPC_URL: string | undefined = `https://${ETHER_NETWORK_NAME}.infura.io/v3/${process.env.APP_WS_API_ETHERSCAN_TOKEN}`;
