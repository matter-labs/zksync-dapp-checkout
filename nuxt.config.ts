import { NuxtConfig, Configuration } from "@nuxt/types";
import { NuxtOptionsEnv } from "@nuxt/types/config/env";
import { ToastObject } from "vue-toasted/types";

//noinspection ES6PreferShortImport
import { CURRENT_APP_NAME, ETHER_NETWORK_CAPITALIZED, ETHER_PRODUCTION, GIT_REVISION_SHORT, VERSION, ZK_IS_BETA, ZK_LIB_VERSION } from "./src/plugins/build";

// @ts-ignore
import * as zkTailwindDefault from "matter-zk-ui/tailwind.config.js";

const srcDir = "./src/";

const env = process.env.APP_ENV ?? "dev";
const isProduction: boolean = ETHER_PRODUCTION && env === "prod";
const pageTitle: string = CURRENT_APP_NAME.toString() ?? "zkSync Checkout";
const pageImg = "/Cover.jpg";

const pageTitleTemplate = `${ETHER_NETWORK_CAPITALIZED}${ZK_IS_BETA ? "-beta" : ""} v.${VERSION} | zksync: v.${ZK_LIB_VERSION}`;

const pageDescription: string = process.env.SITE_DESCRIPTION ?? "";
const pageKeywords = process.env.SITE_KEYWORDS ?? "";

const config: NuxtConfig = {
  components: ["@/components/", { path: "@/blocks/", prefix: "block" }],
  telemetry: false,
  ssr: false,
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

  /*
   ** Headers of the page
   */
  head: {
    title: pageTitle as string | undefined,
    titleTemplate: `%s | ${pageTitleTemplate}`,
    htmlAttrs: {
      lang: "en",
      amp: "true",
    },
    meta: [
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
        content: "/social.jpg",
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

      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
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

  router: {
    middleware: ["wallet"],
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "nuxt-build-optimisations",
    "@nuxtjs/style-resources",
    "@nuxtjs/tailwindcss",
    [
      "@nuxt/typescript-build",
      {
        typescript: {
          typeCheck: {
            async: true,
            stylelint: {
              config: [".stylelintrc"],
              files: "src/**.scss",
            },
            eslint: {
              config: [".eslintrc.js", "tsconfig-eslint.json"],
              files: "**/*.{ts,js,vue}",
            },
            files: "**/*.{ts,vue}",
          },
        },
      },
    ],
    ["@nuxtjs/dotenv", { path: __dirname }],
    "matter-zk-ui",
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios", "@nuxtjs/toast", "@nuxtjs/google-gtag", "nuxt-webfontloader", "@nuxtjs/sentry"],
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
      onClick: (_: unknown, toastObject: ToastObject) => {
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
    scss: ["@/assets/style/vars/*.scss"],
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    disableServerSide: true,
    config: {
      tracesSampleRate: 1.0,
      environment: env === "prod" ? "production" : env === "dev" ? "development" : env,
    },
  },
  "google-gtag": {
    id: process.env.GTAG_ID,
    config: {
      anonymize_ip: true, // anonymize IP
      send_page_view: true, // might be necessary to avoid duplicated page track on page reload
    },
    debug: env !== "prod", // enable to track in dev mode
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
    ssr: false,
    extend: (config: Configuration) => {
      config.node = {
        fs: "empty",
      };
    },
  },
  /* buildOptimisations: {
    profile: env !== "prod" ? "risky" : "experimental",
    features: {
      postcssNoPolyfills: isProduction,
      hardSourcePlugin: isProduction,
    },
    esbuildLoaderOptions: "esnext",
  }, */
  generate: {
    dir: "public",
    fallback: "404.html",
    devtools: env !== "prod",
  },
};
export default config;
