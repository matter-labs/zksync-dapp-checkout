import { ActionTree, GetterTree, MutationTree } from "vuex";

export const state = () => ({
  /**
   * Used to handle modals and simplify the code
   */
  currentModal: false as String | false,
  darkMode: false,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  currentModal(state) {
    return state.currentModal;
  },
  darkMode(state) {
    return state.darkMode;
  },
};

export const mutations: MutationTree<RootState> = {
  setCurrentModal(state, modalName: false | String) {
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
