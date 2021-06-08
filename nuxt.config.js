require("dotenv").config();

const zkTailwindDefault = require("matter-zk-ui/tailwind.config");

const isProduction = process.env.APP_CURRENT_NETWORK === "mainnet";
const pageTitle = `${process.env.SITE_TITLE} | ${process.env.APP_CURRENT_NETWORK.toString().charAt(0).toUpperCase()}${process.env.APP_CURRENT_NETWORK.slice(1)}`;
const pageDescription = process.env.SITE_DESCRIPTION;
const pageKeywords = process.env.SITE_KEYWORDS;
const srcDir = "src";

export default {
  ssr: false,
  target: "static",
  srcDir: `${srcDir}/`,
  vue: {
    config: {
      productionTip: isProduction,
      devtools: !isProduction,
    },
  },
  env: {
    ...process.env,
  },

  /*
   ** Headers of the page
   */
  head: {
    name: pageTitle,
    titleTemplate: pageTitle,
    meta: [
      {
        hid: "keywords",
        name: "keywords",
        content: pageKeywords,
      },
      {
        hid: "author",
        name: "author",
        content: "https://matter-labs.io",
      },
      { "http-equiv": "pragma", content: "no-cache" },
      { "http-equiv": "cache-control", content: "no-cache , no-store, must-revalidate" },
      { "http-equiv": "expires", content: "0" },
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: pageDescription,
      },
      {
        hid: "msapplication-TileImage",
        name: "msapplication-TileImage",
        content: "/favicon-dark.png",
      },
      { hid: "theme-color", name: "theme-color", content: "#4e529a" },
      {
        hid: "msapplication-TileColor",
        property: "msapplication-TileColor",
        content: "#4e529a",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon-dark.png" }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#8c8dfc",
    continuous: true,
  },
  /*
   ** Global CSS
   */
  css: ["@/assets/style/main.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["@/plugins/main", "@/plugins/setCheckoutData"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  router: {
    middleware: ["wallet"],
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxt/typescript-build", "@nuxtjs/tailwindcss", ["@nuxtjs/dotenv", { path: __dirname }], "matter-zk-ui"],

  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/dotenv",
    "@nuxtjs/pwa",
    "@nuxtjs/axios",
    "@nuxtjs/toast",
    "@nuxtjs/google-gtag",
    "nuxt-webfontloader",
    [
      "nuxt-i18n",
      {
        locales: [
          {
            code: "en",
            iso: "en_US",
            file: "en/translations.json",
          },
        ],
        defaultLocale: "en",
        langDir: "./locales/",
      },
    ],
    [
      "nuxt-social-meta",
      {
        url: "https://checkout.zksync.io",
        title: pageTitle,
        site_name: pageTitle,
        description: pageDescription,
        img: "/social.jpg",
        locale: "en_US",
        twitter: "@zksync",
        twitter_card: "https://zksync.io/social.jpg",
        themeColor: "#4e529a",
      },
    ],
    "@nuxtjs/sentry",
  ],
  webfontloader: {
    google: {
      families: ["Fira+Sans:300,400,500,600", "Fira+Sans+Condensed:200,400,500,600", "Fira+Code:300"],
    },
  },
  toast: {
    singleton: true,
    keepOnHover: true,
    position: "bottom-right",
    duration: 4000,
    iconPack: "fontawesome",
    action: {
      text: "OK",
      onClick: (_, toastObject) => {
        toastObject.goAway(100);
      },
    },
  },
  i18n: {
    vueI18n: {
      fallbackLocale: "en",
      messages: {
        en: require(`./${srcDir}/locales/en/translations.json`),
      },
    },
  },
  styleResources: {
    scss: "@/assets/style/_variables.scss",
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    config: {
      tracesSampleRate: 1.0,
    },
  },
  "google-gtag": {
    id: process.env.GTAG_ID,
    config: {
      anonymize_ip: true, // anonymize IP
      send_page_view: true, // might be necessary to avoid duplicated page track on page reload
    },
    debug: false, // enable to track in dev mode
    disableAutoPageTrack: false, // disable if you don't want to track each page route with router.afterEach(...).
  },
  tailwindcss: {
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
          `nuxt.config.{js,ts}`,
        ],
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    ssr: false,
    // target: "static",
    /* extractCSS: {
      ignoreOrder: true,
    }, */
    extend(config) {
      config.node = {
        fs: "empty",
      };
    },
  },
  generate: {
    dir: "public",
    fallback: "404.html",
  },
  pwa: {
    workbox: {
      pagesURLPattern: "/_nuxt/",
    },
  },
};
