require("dotenv").config();

const tailwindDefault = require("tailwindcss/defaultTheme");

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
        content: "/icon.png",
      },
      { hid: "theme-color", name: "theme-color", content: "#4e529a" },
      {
        hid: "msapplication-TileColor",
        property: "msapplication-TileColor",
        content: "#4e529a",
      },
    ],
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
  plugins: ["@/plugins/main"],

  router: {
    middleware: [],
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxt/typescript-build",
    "@nuxtjs/tailwindcss",
    ["@nuxtjs/dotenv", { path: __dirname }]
  ],

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
        url: "https://zksync.io",
        title: pageTitle,
        site_name: pageTitle,
        description: pageDescription,
        img: "https://zksync.io/social.jpg",
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
      onClick: (event, toastObject) => {
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
  inkline: {
    config: {
      autodetectVariant: true,
    },
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    config: {
      tracesSampleRate: 1.0,
    },
  },
  styleResources: {
    scss: "@/assets/style/_variables.scss",
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
    /* cssPath: '@/assets/style/tailwind.min.css', */
    config: {
      future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
      },
      purge: {
        enabled: process.env.NODE_ENV === "production",
        content: [
          `${srcDir}/components/**/*.vue`,
          `${srcDir}/blocks/**/*.vue`,
          `${srcDir}/blocks/**/*.vue`,
          `${srcDir}/layouts/**/*.vue`,
          `${srcDir}/pages/**/*.vue`,
          `${srcDir}/plugins/**/*.{js,ts}`,
          `nuxt.config.{js,ts}`
        ],
      },
      theme: {
        borderColor: {
          light: "#E1E4E8",
          gray: "#8D9AAC",
        },
        backgroundColor: {
          white: "#FFFFFF",
          white2: "#FBFBFB",
          white3: "#F4F5F7",
          violet: "#5436D6",
        },
        textColor: {
          white: "#FFFFFF",
          gray: "#8D9AAC",
          dark: "#243955",
          dark2: "#4E566D",
          black2: "#3C4257",
          black: "#000",
          violet: "#5436D6",
          red: "#F25F5C",
          green: "#057A55",
        },
        fontSize: {
          ...tailwindDefault.fontSize,
          xxs: [
            "0.65rem",
            {
              lineHeight: "0.75rem",
            },
          ],
        },
        fontFamily: {
          ...tailwindDefault.fontFamily,
          'firaCode': ['Fira Code', 'sans-serif'],
          'firaCondensed': ['Fira Sans Condensed', 'sans-serif'],
        },
        /* extend: {
          width: {
            '72': '18rem',
            'max-content': 'max-content'
          },
          height: {
            '72': '18rem',
            'max-content': 'max-content'
          },
          spacing: {
            '72': '18rem',
            '84': '21rem',
            '96': '24rem',
          },
        }, */
      },
      /* variants: {
        extends: {
          fontFamily: {
            firaCode: ["Fira Code", "sans-serif"],
            firaCondensed: ["Fira Sans Condensed", "sans-serif"],
          },
        },
      }, */
      plugins: [],
    },
  },
  /*
   ** Build configuration
   */
  build: {
    ssr: false,
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
