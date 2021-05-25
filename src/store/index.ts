import { ActionTree, GetterTree, MutationTree } from "vuex";

export const state = () => ({
  /**
   * Used to handle modals and simplify the code
   */
  currentModal: false as string | false,
});

export type RootState = ReturnType<typeof state>;

export const getters: GetterTree<RootState, RootState> = {
  currentModal(state) {
    return state.currentModal;
  },
};

export const mutations: MutationTree<RootState> = {
  setCurrentModal(state, modalName: false | string) {
    state.currentModal = modalName;
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