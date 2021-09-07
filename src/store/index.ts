import * as provider from "@/store/provider";
import * as tokens from "@/store/tokens";
import * as checkout from "@/store/checkout";
import * as transaction from "@/store/transaction";
import * as wallet from "@/store/wallet";
import { ZKIRootState } from "@/types/lib";
import { actionTree, getAccessorType, getterTree, mutationTree } from "typed-vuex";
import { Route } from "vue-router/types";

export const state = () =>
  <ZKIRootState>{
    accountModalOpened: false,
    previousRoute: <Route | undefined>undefined,
    /**
     * Used to handle modals and simplify the code
     */
    currentModal: <string | undefined>undefined,
    step: "main" as string,
    darkMode: false,
  };

export type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {
  currentModal: (state) => state.currentModal,
  getAccountModalState: (state) => state.accountModalOpened,
  getPreviousRoute: (state) => state.previousRoute,
  step: (state) => state.step,
  darkMode: (state) => state.darkMode,
});

export const mutations = mutationTree(state, {
  setStep(state, step: string) {
    state.step = step;
  },
  setDarkMode(state, darkModeState: boolean) {
    state.darkMode = darkModeState;
  },
  setCurrentModal(state, modalName: string) {
    state.currentModal = modalName;
  },
  setPreviousRoute(state, route: Route) {
    state.previousRoute = route;
  },
  removeCurrentModal(state) {
    state.currentModal = undefined;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    openModal({ commit }, modalName: string): void {
      commit("setCurrentModal", modalName);
    },
    closeActiveModal({ commit }): void {
      commit("removeCurrentModal");
    },
  },
);

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    provider,
    checkout,
    tokens,
    transaction,
    wallet,
  },
});