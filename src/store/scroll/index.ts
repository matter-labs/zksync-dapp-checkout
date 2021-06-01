import { GetterTree, MutationTree } from "vuex";
import { RootState } from "~/store";

export const state = () => ({
  lastScroll: false as false | number,
  lastPath: "" as string,
});

export type ScrollModuleState = ReturnType<typeof state>;

export const mutations: MutationTree<ScrollModuleState> = {
  setLastScroll(state, lastScroll: number) {
    if (!lastScroll) {
      state.lastScroll = false;
    } else {
      state.lastScroll = lastScroll;
    }
  },
  setLastPath(state, lastPath: string) {
    state.lastPath = lastPath;
  },
};

export const getters: GetterTree<ScrollModuleState, RootState> = {
  getLastScroll(state): false | number {
    return state.lastScroll;
  },
  getLastPath(state): string {
    return state.lastPath;
  },
};
