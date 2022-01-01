import {NuxtOptionsEnv} from "@nuxt/types/config/env";
import {ModuleOptions} from "@matterlabs/zksync-nuxt-core/types";
// noinspection ES6PreferShortImport
import {CURRENT_APP_NAME, ETHER_NETWORK_CAPITALIZED, ETHER_PRODUCTION, isDebugEnabled, isProduction, nuxtBuildConfig} from "./src/plugins/build";

const zkTailwindDefault = require("matter-zk-ui/tailwind.config.js");

const srcDir = "./src/";

const env = process.env.APP_ENV ?? "dev";
const pageTitle = `${CURRENT_APP_NAME}`.toString() ?? "zkSync Checkout";
const pageImg = "/cover.jpg";

const pageTitleTemplate = ETHER_PRODUCTION ? CURRENT_APP_NAME : `${ETHER_NETWORK_CAPITALIZED}`;

const pageDescription: string = process.env.SITE_DESCRIPTION ?? "";
const pageKeywords = process.env.SITE_KEYWORDS ?? "";

export default {
  components: ["@/components/", {path: "@/blocks/", prefix: "block"}],
  telemetry: false,

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  srcDir: `${srcDir}`,
  vue: {
    config: {
      productionTip: isProduction,
      devtools: !isProduction,
    },
  },
  env: <NuxtOptionsEnv>{
    ...process.env,
  },

  /**
   * Global page headers: https://go.nuxtjs.dev/config-head
   */
  head: {
    title: pageTitle as string | undefined,
    titleTemplate: `%s | ${pageTitleTemplate}`,
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      {
        property: "cache-control",
        httpEquiv: "cache-control",
        content: "no-cache , no-store, must-revalidate",
      },
      {
        httpEquiv: "pragma",
        content: "no-cache",
        property: "pragma",
      },
      {
        httpEquiv: "cache-control",
        property: "cache-control",
        content: "no-cache , no-store, must-revalidate",
      },
      {
        httpEquiv: "expires",
        content: "0",
        property: "expires",
      },
      {
        hid: "keywords",
        name: "keywords",
        content: pageKeywords,
      },
      {
        hid: "description",
        name: "description",
        content: pageDescription,
      },
      {
        hid: "author",
        name: "author",
        content: "https://matter-labs.io",
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: pageTitle,
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: pageDescription,
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: pageImg,
      },
      {
        hid: "twitter:site",
        name: "twitter:site",
        content: "@zksync",
      },
      {
        hid: "twitter:creator",
        name: "twitter:creator",
        content: "@the_matter_labs",
      },
      {
        hid: "twitter:image:alt",
        name: "twitter:image:alt",
        content: pageTitle,
      },
      {
        hid: "og:title",
        property: "og:title",
        content: pageTitle,
      },
      {
        hid: "og:description",
        property: "og:description",
        content: pageDescription,
      },
      {
        hid: "og:image",
        property: "og:image",
        content: pageImg,
      },
      {
        hid: "og:image:secure_url",
        property: "og:image:secure_url",
        content: pageImg,
      },
      {
        hid: "og:image:alt",
        property: "og:image:alt",
        content: pageTitle,
      },

      {charset: "utf-8"},
      {name: "viewport", content: "width=device-width, initial-scale=1"},
      {
        hid: "msapplication-TileImage",
        name: "msapplication-TileImage",
        content: "/favicon-dark.png",
      },
      {hid: "theme-color", name: "theme-color", content: "#4e529a"},
      {
        hid: "msapplication-TileColor",
        property: "msapplication-TileColor",
        content: "#4e529a",
      },
    ],
    link: [{rel: "icon", type: "image/x-icon", href: "/favicon-dark.png"}],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#8c8dfc",
    continuous: true,
  },

  /**
   *  Global CSS: https://go.nuxtjs.dev/config-css
   */
  css: ["@/assets/style/main.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["@/plugins/main", "@/plugins/setCheckoutData", "@/plugins/restoreSession"],

  router: {
    middleware: ["wallet"],
  },

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/stylelint
    "@nuxtjs/stylelint-module",
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/tailwindcss",
    "@nuxtjs/style-resources",
    ["@nuxtjs/dotenv", {path: __dirname}],
    "matter-zk-ui",
    [
      "@matterlabs/zksync-nuxt-core",
      <ModuleOptions>{
        network: process.env.ZK_NETWORK,
        apiKeys: {
          FORTMATIC_KEY: process.env.APP_FORTMATIC,
          PORTIS_KEY: process.env.APP_PORTIS,
          INFURA_KEY: process.env.APP_INFURA_API_KEY,
        },
        onboardConfig: {
          APP_NAME: pageTitle,
          APP_ID: process.env.APP_ONBOARDING_APP_ID,
        },
        logoutRedirect: "/connect",
      },
    ],
  ],

  /**
   * Modules: https://go.nuxtjs.dev/config-modules
   */
  modules: [
    "nuxt-webfontloader",
    [
      "nuxt-social-meta",
      {
        url: "https://checkout.zksync.io",
        title: pageTitle,
        site_name: pageTitle,
        description: pageDescription,
        img: "cover.jpg",
        img_size: {width: "2560", height: "1280"},
        locale: "en_US",
        twitter: "@zksync",
        twitter_card: "https://checkout.zksync.io/social.jpg",
        themeColor: "#4e529a",
      },
    ],
    "@nuxtjs/google-gtag",
    "@nuxtjs/sentry",
  ],
  i18n: {
    vueI18n: {
      fallbackLocale: "en",
      messages: {
        en: require(`./${srcDir}/locales/en/translations.json`),
      },
    },
  },
  styleResources: {
    scss: ["@/assets/style/_variables.scss"],
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    disableServerSide: true,
    disabled: !isProduction,
    config: {
      debug: isDebugEnabled,
      tracesSampleRate: 1.0,
      environment: isProduction ? "production" : env === "dev" ? "development" : env,
    },
  },
  "google-gtag": {
    id: process.env.GTAG_ID, // required
    config: {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      // this is the config options for `gtag
      // check out official docs: https://developers.google.com/analytics/devguides/collection/gtagjs/
      anonymize_ip: true, // anonymize IP
      send_page_view: isProduction, // might be necessary to avoid duplicated page track on page reload
      linker: {
        domains: ["checkout.zksync.io", "checkout-rinkeby.zksync.io", "ropsten-rinkeby.zksync.io", "web.app"],
      },
    },
    debug: isDebugEnabled, // enable to track in dev mode
    disableAutoPageTrack: !isProduction, // disable if you don't want to track each page route with router.afterEach(...)
    // optional you can add more configuration like [AdWords](https://developers.google.com/adwords-remarketing-tag/#configuring_the_global_site_tag_for_multiple_accounts)
  },
  // Fonts loader https://www.npmjs.com/package/nuxt-webfontloader
  webfontloader: {
    google: {
      families: ["Fira+Sans:300,400,500,600", "Fira+Sans+Condensed:200,400,500,600", "Fira+Code:300"],
    },
  },
  tailwindcss: {
    mode: "jit",
    config: {
      ...zkTailwindDefault,
      purge: {
        enabled: process.env.NODE_ENV === "production",
        content: [
          `${srcDir}/components/**/*.vue`,
          `${srcDir}/blocks/**/*.vue`,
          `${srcDir}/blocks/**/*.vue`,
          `${srcDir}/layouts/**/*.vue`,
          `${srcDir}/pages/**/*.vue`,
          `${srcDir}/plugins/**/*.{js,ts}`,
          "./node_modules/matter-zk-ui/components/**/*.vue",
          "./node_modules/matter-zk-ui/blocks/**/*.vue",
          "./node_modules/matter-zk-ui/blocks/**/*.vue",
          "./node_modules/matter-zk-ui/layouts/**/*.vue",
          "./node_modules/matter-zk-ui/pages/**/*.vue",
          "./node_modules/matter-zk-ui/plugins/**/*.{js,ts}",
          "./node_modules/matter-zk-ui/nuxt.config.{js,ts}",
        ],
      },
    },
  },

  /*
   ** Build configuration
   */
  build: {
    ...nuxtBuildConfig,
  },
  generate: {
    dir: "public",
    fallback: "404.html",
    devtools: !isProduction,
  },
};
