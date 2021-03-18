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
    // @ts-ignore: Unreachable code error
    this.$toast.success(messageText, {
      ...state.canonicalConfig, ...{
        icon: {
          name: "fa-check",
        }
      }
    });
  },

  error({ dispatch, state }, messageText) {
    // @ts-ignore: Unreachable code error
    this.$toast.error(messageText, {
      ...state.canonicalConfig, ...{
        icon: {
          name: "fa-times-circle",
        },
        duration: null
      }
    });
  },

  info({ dispatch, state }, messageText) {
    // @ts-ignore: Unreachable code error
    this.$toast.info(messageText, {
      ...state.canonicalConfig, ...{
        icon: {
          name: "fa-times-circle",
        }
      }
    });
  },
};