import Vue from "vue";
import Vuex from "vuex";
import {
  REFRESH_STATE,
  LOCK_WALLET,
  CANCEL_REQUEST,
  CREATE_NEW_WALLET,
  UNLOCK_WALLET,
  AUTHORIZE_REQUEST,
} from "./actions";

const { API } = chrome.extension.getBackgroundPage();

Vue.use(Vuex);

export default new Vuex.Store({
  //initial state
  state: {
    address: API.getState().address,
    completedOnboarding: true, //API.getState().completedOnboarding,
    connections: API.getState().connections,
    hasPermissionsRequests: true, //this.$API.getState().hasPermissionsRequests
    initialized: API.getState().initialized,
    debug: null,
    pendingRequests: [
      {
        id: 1,
        type: "connection",
        params: {
          url: "https://www.wallid.io/",
          icon: "https://www.wallid.io/favicon.ico",
          name: "wallid.io",
          description: "Site wallid",
        },
      },
    ],
    unlocked: API.getState().unlocked,
  },
  getters: {
    address: (state) => state.address,
    completedOnboarding: (state) => state.completedOnboarding,
    getRequest: (state) => state.pendingRequests[0],
    hasPermissionsRequests: (state) => state.hasPermissionsRequests,
    hideAppHeader: (state) => state.hasPermissionsRequests,
    unlocked: (state) => state.unlocked,
    state: (state) => state,
  },
  actions: {
    [CREATE_NEW_WALLET]: ({ commit, dispatch }, password) => {
      console.log("Action CREATE_NEW_WALLET");
      return new Promise((resolve, reject) => {
        API.createNewVault(API.generateSeedPhrase(), password)
          .then(API.unlockApp(password))
          .then(() => resolve(dispatch(REFRESH_STATE)))
          .catch((e) => {
            reject(e);
          });
      });
    },
    [REFRESH_STATE]: ({ commit }) => {
      console.log("Action REFRESH_STATE");
      commit("updateAddress", API.getState().address);
      commit("updateUnlocked", API.getState().unlocked);
      commit("updateInitialized", API.getState().initialized);
      commit("updateConnections", API.getState().connections);
    },
    [AUTHORIZE_REQUEST]: (
      { state, commit, dispatch },
      { request, notification }
    ) => {
      return new Promise((resolve, reject) => {
        console.log("Action AUTHORIZE_REQUEST");
        state.debug("URL: ", request.params.url);
        state.debug("Connections: ", state.connections);

        API.approvePendingConnection(request.params.url)
          .then(() => {
            //Close window if its a notification popup
            notification ? window.close() : "";
          })
          .catch((e) => {
            console.error("Error Authorizing request: ", e);
          });

        dispatch(REFRESH_STATE);
        state.debug("Connections: ", state.connections);
      });
    },
    [CANCEL_REQUEST]: (
      { commit, dispatch, state },
      { request, notification }
    ) => {
      console.log("Action CANCEL_REQUEST");

      const arrayRemove = function(arr, id, value) {
        return arr.filter(function(ele) {
          return ele[id] != value;
        });
      };

      commit(
        "updatePendingRequests",
        arrayRemove(state.pendingRequests, "id", request.id)
      );
      dispatch(REFRESH_STATE);

      //Close window if its a notification popup
      notification ? window.close() : "";
    },
    [UNLOCK_WALLET]: ({ commit, dispatch }, password) => {
      return new Promise((resolve, reject) => {
        console.log("Action UNLOCK_WALLET");
        API.unlockApp(password)
          .then(() => resolve(dispatch(REFRESH_STATE)))
          .catch((e) => {
            reject(e);
          });
      });
    },
    [LOCK_WALLET]: ({ commit, dispatch }) => {
      console.log("Action LOCK_WALLET");
      API.lockApp().then(() => dispatch(REFRESH_STATE));
    },
  },
  mutations: {
    updateConnections(state, value) {
      state.connections = value;
    },
    updatePendingRequests(state, value) {
      // state.pendingRequests = value;
      state.pendingRequests.shift();
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
    appendLogger(state, logger) {
      state.debug = logger;
    },
  },
});
