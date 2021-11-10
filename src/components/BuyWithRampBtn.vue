<template>
    <zk-defbtn class="rampBtn px-1" v-if="isRampSupported" @click="buyWithRamp()">
        <img class="mr-2" src="/RampLogo.svg" alt="Ramp">
        <span>{{text}} <span class="font-medium"> RAMP</span></span>
    </zk-defbtn>
</template>

<script lang="ts">
import Vue from "vue";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";
import { rampConfig } from "@/plugins/build";

export default Vue.extend({
    props: {
        text: {
            type: String,
            default: "Buy with",
            required: false,
        }
    },
    computed: {
        config(): {
            url: string | undefined;
            hostApiKey: string | undefined;
        } | null {
            return rampConfig[this.$store.getters["zk-provider/network"]];
        },
        address(): string {
            return this.$store.getters["zk-account/address"];
        },
        isRampSupported(): boolean {
            return !!this.config;
        },
    },
    methods: {
        buyWithRamp() {
            if (!this.isRampSupported) {
                throw new Error("Ramp is not supported on this environment.");
            }
            new RampInstantSDK({
                hostAppName: "zkSync Wallet",
                hostLogoUrl: window.location.origin + "/favicon-dark.png",
                variant: "hosted-auto",
                swapAsset: "ZKSYNC_ETH,ZKSYNC_DAI,ZKSYNC_USDT,ZKSYNC_USDC",
                userAddress: this.address,
                ...this.config,
            })
            // Weird typing error
            // @ts-ignore
            .on('PURCHASE_SUCCESSFUL', (event) => {
                console.log("Ramp PURCHASE_SUCCESSFUL", event);
                this.$store.dispatch("checkout/requestUsedTokensEthereumBalance", true);
                this.$store.dispatch("zk-account/updateAccountState", true);
            }).show();
        },
    },
});
</script>