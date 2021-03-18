import { ActionTree } from "vuex";
import { RootState } from "~/store";

export const state = () => ({
  canonicalConfig: <any>{
    type: "default",
    icon: null as any,
    action: {
      text: "OK",
      onClick: (event: any, toastObject: { goAway: (arg0: number) => void; }) => {
        toastObject?.goAway(100);
      },
    },
  }
});

export type ToasterModuleState = ReturnType<typeof state>;

export const actions: ActionTree<ToasterModuleState, RootState> = {
  message({ commit, state }, messageText) {
    // @ts-ignore: Unreachable code error
    this.$toast.show(messageText, state.canonicalConfig);
  },
  success({ commit, state }, messageText) {
    let config = state.canonicalConfig;
    config.icon = {
      name: "fa-check",
    };

    // @ts-ignore: Unreachable code error
    this.$toast.success(messageText, config);
  },

  error({ dispatch, state }, messageText) {
    let config = state.canonicalConfig;
    config.icon = {
      name: "fa-times-circle",
    };
    config.duration = null;
    // @ts-ignore: Unreachable code error
    this.$toast.error(messageText, config);
  },

  info({ dispatch, state }, messageText) {
    let config = state.canonicalConfig;
    config.icon = {
      name: "fa-times-circle",
    };

    // @ts-ignore: Unreachable code error
    this.$toast.info(messageText, config);
  },
};