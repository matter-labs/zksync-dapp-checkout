// noinspection ES6PreferShortImport

import {Configuration, NuxtConfig} from "@nuxt/types";
import {NuxtOptionsEnv} from "@nuxt/types/config/env";
import {ToastAction, ToastIconPack, ToastObject, ToastOptions, ToastPosition} from "vue-toasted";

import {CURRENT_APP_NAME, ETHER_NETWORK_CAPITALIZED, ETHER_PRODUCTION, GIT_REVISION_SHORT, VERSION} from "./src/plugins/build";

require("dotenv").config();

const tailwindDefault = require("tailwindcss/defaultTheme");

const srcDir = "./src/";

const env = process.env.APP_ENV ?? "dev";
const isProduction: boolean = ETHER_PRODUCTION && env === "prod";
const pageTitle: string = CURRENT_APP_NAME.toString() ?? "zkSync Wallet";
const pageImg = "/Cover.jpg";

const pageTitleTemplate = `${ETHER_NETWORK_CAPITALIZED} v.${VERSION}:${GIT_REVISION_SHORT}`;

const pageDescription: string = process.env.SITE_DESCRIPTION as "";
const pageKeywords = process.env.SITE_KEYWORDS as "";

const config: NuxtConfig = {
    components: ["@/components/", {path: "@/blocks/", prefix: "block"}],
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
        "@nuxtjs/google-fonts",
        "nuxt-typed-vuex",
        "@nuxtjs/tailwindcss",
        ["@nuxtjs/dotenv", {path: __dirname}],
        [
            "@nuxt/typescript-build",
            {
                typescript: {
                    typeCheck: {
                        async: true,
                        eslint: {
                            config: [".eslintrc.js", "tsconfig-eslint.json"],
                            files: "**/*.{ts,js,vue,scss}",
                        },
                        files: "**/*.{ts,vue}",
                    },
                },
            },
        ],
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
        "@nuxtjs/dotenv", "@nuxt/http", "@nuxtjs/toast", "@nuxtjs/google-gtag", "@inkline/nuxt", "@nuxtjs/sentry"],
    toast: <ToastOptions>{
        singleton: true,
        keepOnHover: true,
        position: "bottom-right" as ToastPosition,
        duration: 4000,
        className: "zkToastMain",
        iconPack: "fontawesome" as ToastIconPack,
        action: <ToastAction>{
            text: "Close",
            class: "zkToastActionClose",
            icon: "fa-times-circle",
            onClick: (_e: Event, toastObject: ToastObject): void => {
                toastObject.goAway(100);
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
                    `nuxt.config.{js,ts}`,
                ],
            },
            theme: {
                borderColor: {
                    light: "#e1e4e8",
                    gray: "#8d9aac",
                },
                backgroundColor: {
                    white: "#ffffff",
                    white2: "#fbfbfb",
                    white3: "#f4f5f7",
                    violet: "#5436d6",
                },
                textColor: {
                    white: "#ffffff",
                    gray: "#8d9aac",
                    dark: "#243955",
                    dark2: "#4e566d",
                    black2: "#3c4257",
                    black: "#000000",
                    violet: "#5436D6",
                    lightviolet: "#7860df",
                    red: "#F25F5C",
                    green: "#057A55",
                    yellow: "#fbbf24",
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
                maxWidth: {
                    ...tailwindDefault.maxWidth,
                    xxs: "15rem",
                },
                fontFamily: {
                    ...tailwindDefault.fontFamily,
                    firaCode: ["Fira Code", "sans-serif"],
                    firaCondensed: ["Fira Sans Condensed", "sans-serif"],
                },
                screens: {
                    ...tailwindDefault.screens,
                    lg: "1101px",
                },
                /* transitionTimingFunction: {
                  ...tailwindDefault.transitionTimingFunction,
                  ease: "ease",
                }, */
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
            variants: {
                extend: {
                    visibility: ['hover', 'focus'],
                    flex: ['hover', 'focus'],
                }
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
        transpile: ["oh-vue-icons"], // [v.2.4.0]: oh-vue-icons package
        hardSource: isProduction,
        ssr: false,
        extractCSS: {
            ignoreOrder: true,
        },
        extend: (config: Configuration) => {
            config.node = {
                fs: "empty",
            };
        },
    },
    buildOptimisations: {
        profile: env !== "prod" ? "risky" : "experimental",
        features: {
            postcssNoPolyfills: isProduction,
            hardSourcePlugin: isProduction,
        },
        esbuildLoaderOptions: "esnext",
    },
    googleFonts: {
        prefetch: true,
        preconnect: true,
        preload: true,
        display: "swap",
        families: {
            "Fira+Sans": [400, 600],
            "Fira+Sans+Extra+Condensed": [400, 600],
            "Fira+Code": [400],
        },
    },
    generate: {
        dir: "public",
        fallback: "404.html",
        devtools: env !== "prod",
    }
};
export default config;