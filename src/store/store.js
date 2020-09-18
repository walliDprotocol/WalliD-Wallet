import Vue from "vue";
import Vuex from "vuex";
import {
  REFRESH_STATE,
  LOCK_WALLET,
  CANCEL_REQUEST,
  CREATE_NEW_WALLET,
  UNLOCK_WALLET,
  AUTHORIZE_REQUEST,
  CONNECT,
  DISCONNECT,
} from "./actions";

const { API } = chrome.extension.getBackgroundPage();

Vue.use(Vuex);

export default new Vuex.Store({
  //initial state
  state: {
    address: API.getState().address,
    completedOnboarding: true, //API.getState().completedOnboarding,
    connections: [
      {
        url: "https://www.wallid.io/",
        icon: "https://www.wallid.io/favicon.ico",
        name: "wallid.io",
        description: "Site wallid",
      },
    ], //API.getState().connections,
    initialized: API.getState().initialized,
    request:
      //  API.getNextNotification(),
      {
        type: "wallid_connect",
        nonce: 1,
        data: {
          url: "https://www.wallid.io/",
          icon: "https://www.wallid.io/favicon.ico",
          name: "wallid.io",
          description: "Site wallid",
        },
        callback: "",
      },
    debug: null,
    unlocked: API.getState().unlocked,
  },
  getters: {
    address: (state) => state.address,
    completedOnboarding: (state) => state.completedOnboarding,
    connections: (state) => state.connections,

    getRequest: (state) => state.request,
    hideAppHeader: (state) => state.getRequest,
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

    [CONNECT]: ({ commit, state }, { params }) => {
      return new Promise((resolve, reject) => {
        console.log("Action CONNECT");
        state.debug("URL: ", params.url);
        state.debug("Connections: ", state.connections);
        // state.debug("Notification: ", state.notification);

        // API.approvePendingConnection(params.url)
        //   .then(() => {
        //     //Close window if its a notification popup
        //     state.notification ? window.close() : "";
            resolve(true);
          // })
          // .catch((e) => {
          //   console.error("Error Authorizing request: ", e);
          //   // reject(false);
          //   resolve(true);

          // });
      });
    },

    [AUTHORIZE_REQUEST]: (
      { state, commit, dispatch },
      { params, type, notification }
    ) => {
      return new Promise((resolve, reject) => {
        console.log("Action AUTHORIZE_REQUEST");
        state.notification = notification;
        state.debug("Params: ", params);
        state.debug("Connections: ", state.connections);

        switch (type) {
          case "wallid_connect":
            resolve(dispatch(CONNECT, { params })).catch((e) => {
              resolve(e);
            });
            break;

          default:
            break;
        }

        dispatch(REFRESH_STATE);
        state.debug("Connections: ", state.connections);
      });
    },
    [CANCEL_REQUEST]: (
      { commit, dispatch, state },
      { request, notification }
    ) => {
      console.log("Action CANCEL_REQUEST");

      commit("updatePendingRequests");
      dispatch(REFRESH_STATE);

      //Close window if its a notification popup
      notification ? window.close() : "";
    },

    [DISCONNECT]: ({ commit, state }, url) => {
      return new Promise((resolve, reject) => {
        console.log("Action DISCONNECT");
        state.debug("URL: ", url);
        state.debug("Connections: ", state.connections);

        API.removeConnected(url)
          .then(() => {
            // resolve(commit("updateConnections", API.getState().connections));
            resolve(state.connections.shift());
          })
          .catch((e) => {
            console.error("Error Disconnecting site: ", e);
            resolve(state.connections.shift());
          });
      });
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
    updatePendingRequests(state) {
      state.request = API.getNextNotification();
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
