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
    accountModalOpened: undefined,
    previousRoute: undefined,
    currentModal: undefined,
    step: "main",
    darkMode: false,
    lastScroll: undefined,
  };

export type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {
  currentModal: (state) => state.currentModal,
  getAccountModalState: (state): string | undefined => state.accountModalOpened,
  getPreviousRoute: (state): Route | undefined => state.previousRoute,
  step: (state): string => state.step,
  darkMode: (state): boolean => state.darkMode,
  storedScrollPosition: (state): number | undefined => state.lastScroll,
});

export const mutations = mutationTree(state, {
  setStep(state, step: string) {
    state.step = step;
  },
  storeCurrentScrollPosition(state, incomingPosition: number | undefined = undefined): void {
    state.lastScroll = incomingPosition ? incomingPosition : undefined;
  },
  setDarkMode(state, darkModeState: boolean): void {
    state.darkMode = darkModeState;
  },
  setCurrentModal(state, modalName: string): void {
    state.currentModal = modalName;
  },
  setPreviousRoute(state, route: Route): void {
    state.previousRoute = route;
  },
  removeCurrentModal(state): void {
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