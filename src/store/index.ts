import { ActionTree, GetterTree, MutationTree } from "vuex/types";

export const state = () => ({
  /**
   * Used to handle modals and simplify the code
   */
  currentModal: false as String | false,
  step: "main" as string,
  darkMode: false,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  currentModal(state) {
    return state.currentModal;
  },
  step(state) {
    return state.step;
  },
  darkMode(state) {
    return state.darkMode;
  },
};

export const mutations: MutationTree<RootState> = {
  setStep(state, step: string) {
    state.step = step;
  },
  setCurrentModal(state, modalName: false | string) {
    state.currentModal = modalName;
  },
  setDarkMode(state, darkModeState: boolean) {
    state.darkMode = darkModeState;
  },
};

export const actions: ActionTree<RootState, RootState> = {
  openModal({ commit }, modalName) {
    commit("setCurrentModal", modalName);
  },
  closeActiveModal({ commit }) {
    commit("setCurrentModal", false);
  },
};
