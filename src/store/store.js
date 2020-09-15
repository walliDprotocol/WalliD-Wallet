import Vue from "vue";
import Vuex from "vuex";
import { REFRESH_STATE, LOCK_WALLET, CANCEL_REQUEST } from "./actions";

const { API } = chrome.extension.getBackgroundPage();

Vue.use(Vuex);

export default new Vuex.Store({
  //initial state
  state: {
    address: API.getState().address,
    completedOnboarding: true, //API.getState().completedOnboarding,
    hasPermissionsRequests: true, //this.$API.getState().hasPermissionsRequests
    initialized: API.getState().initialized,
    pendingRequests: [{ id: 1 }],
    unlocked: API.getState().unlocked,
  },
  getters: {
    address: (state) => state.address,
    completedOnboarding: (state) => state.completedOnboarding,
    hasPermissionsRequests: (state) => state.hasPermissionsRequests,
    hideAppHeader: (state) => state.hasPermissionsRequests,
    unlocked: (state) => state.unlocked,
    state: (state) => state,
  },
  actions: {
    [REFRESH_STATE]: ({ commit }) => {
      console.log("Action REFRESH_STATE");
      commit("updateAddress", API.getState().address);
      commit("updateUnlocked", API.getState().unlocked);
      commit("updateInitialized", API.getState().initialized);
    },

    [CANCEL_REQUEST]: ({ commit, dispatch, state }, value) => {
      console.log("Action CANCEL_REQUEST");

      const arrayRemove = function(arr, id, value) {
        return arr.filter(function(ele) {
          return ele[id] != value;
        });
      };

      commit(
        "updatePendingRequests",
        arrayRemove(state.pendingRequests, "id", value)
      );
      dispatch(REFRESH_STATE);
    },
    [LOCK_WALLET]: ({ commit, dispatch }) => {
      console.log("Action LOCK_WALLET");
      API.lockApp();
      dispatch(REFRESH_STATE);
    },
  },
  mutations: {
    updatePendingRequests(state, value) {
      state.pendingRequests = value;

      if (state.pendingRequests.length == 0) {
        console.log("No more requests");
        state.hasPermissionsRequests = false;
      }
    },
    updateAddress(state, value) {
      state.address = value;
    },
    updateUnlocked(state, value) {
      state.unlocked = value;
    },
    updateInitialized(state, value) {
      state.initialized = value;
    },
  },
});
