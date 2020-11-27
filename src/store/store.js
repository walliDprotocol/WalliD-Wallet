import Vue from "vue";
import Vuex from "vuex";
import {
  IMPORT,
  REFRESH_STATE,
  LOCK_WALLET,
  CANCEL_REQUEST,
  CREATE_NEW_WALLET,
  UNLOCK_WALLET,
  AUTHORIZE_REQUEST,
  CONNECT,
  ENCRYPT,
  DECRYPT,
  DISCONNECT,
  ACCESS_LEVEL,
  GET_TOKEN,
  REVEAL_SEED_PHRASE,
  REVEAL_PRIV_KEY,
  UPDATE_CONNECTED,
  GENERATE_NEW_SEED_PHRASE,
  SIGN_ERC,
  SIGN,
  IMPORT_CRED,
} from "./actions";

const { API } = chrome.extension.getBackgroundPage();

Vue.use(Vuex);

export default new Vuex.Store({
  //initial state
  state: {
    address: API.getState().address,
    completedOnboarding: API.getState().initialized,
    connections: API.getState().connections,
    connected: false,
    initialized: API.getState().initialized,
    identities: API.getState().identities,
    credentials: API.getState().credentials,
    request: API.getNextRequest(),
    debug: null,
    unlocked: API.getState().unlocked,
  },
  getters: {
    address: (state) => state.address,
    completedOnboarding: (state) => state.completedOnboarding,
    connections: (state) => state.connections,
    connected: (state) => state.connected,
    getRequest: (state) => state.request,
    unlocked: (state) => state.unlocked,
    state: (state) => state,
    identities: (state) => state.identities,
    credentials: (state) => state.credentials,
  },
  actions: {
    // []: ({ commit, state }) => {
    //   return new Promise((resolve, reject) => {
    //     API.currentTab(resolve);
    //   }).then((site) => {
    //     state.debug("Current site: ", site);
    //     state.debug("Existing connections: ", state.connections);
    //     if (state.connections) {
    //       let connectedSite = state.connections.find((e) => {
    //         return state.getDomain(e.url) == state.getDomain(site.url) ? e : "";
    //       });
    //       if (connectedSite) {
    //         commit("updateConnected", connectedSite);
    //       }
    //     }
    //   });
    // },

    [UPDATE_CONNECTED]: ({ commit, state }) => {
      return new Promise((resolve, reject) => {
        API.currentTab(resolve);
      }).then((site) => {
        state.debug("Current site: ", site);
        state.debug("Existing connections: ", state.connections);
        if (state.connections) {
          let connectedSite = state.connections.find((e) => {
            return state.getDomain(e.url) == state.getDomain(site.url) ? e : "";
          });
          if (connectedSite) {
            commit("updateConnected", connectedSite);
          }
        }
      });
    },

    [ACCESS_LEVEL]: ({ commit, state }, { url, level }) => {
      return new Promise((resolve, reject) => {
        API.accessControl(url, level).then((res) => {
          resolve(res);
        });
      });
    },

    [GET_TOKEN]: ({ commit, state }, { idt, operation }) => {
      return new Promise((resolve, reject) => {
        console.log("Action GET_TOKEN");
        state.debug("Data: ", idt, operation);
        API.getAuthorizationToken(idt, operation)
          .then((res) => {
            console.log(res);
            resolve(res);
          })
          .catch((e) => {
            console.error(e);
            reject(e);
          });
      });
    },

    [CREATE_NEW_WALLET]: ({ commit, dispatch }, { seed, password }) => {
      console.log("Action CREATE_NEW_WALLET");
      return new Promise((resolve, reject) => {
        API.createNewVault(seed, password)
          .then((res) => {
            dispatch(REFRESH_STATE);
          })
          .then(() => resolve(seed))
          .catch((e) => {
            reject(e);
          });
      });
    },

    [GENERATE_NEW_SEED_PHRASE]: ({ commit, dispatch }, password) => {
      console.log("Action GENERATE_NEW_SEED_PHRASE");
      return new Promise((resolve, reject) => {
        let seed = API.generateSeedPhrase();
        resolve(seed);
      });
    },

    [REVEAL_SEED_PHRASE]: ({ commit, dispatch }, password) => {
      console.log("Action REVEAL_SEED_PHRASE");
      return new Promise((resolve, reject) => {
        API.verifyPassword(password)
          .then((result) => {
            if (result) {
              resolve(API.getState().mnemonic());
            } else {
              reject("Wrong Password");
            }
          })
          .catch((e) => {
            reject(e);
          });
      });
    },

    [REVEAL_PRIV_KEY]: ({ commit, dispatch }, password) => {
      console.log("Action REVEAL_PRIV_KEY");
      return new Promise((resolve, reject) => {
        API.verifyPassword(password)
          .then((result) => {
            if (result) {
              resolve(API.getState().key());
            } else {
              reject("Wrong Password");
            }
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    [REFRESH_STATE]: ({ commit, dispatch }) => {
      console.log("Action REFRESH_STATE");
      commit("updateAddress", API.getState().address);
      commit("updateUnlocked", API.getState().unlocked);
      commit("updateConnections", API.getState().connections);
      commit("updateOnboarding", API.getState().initialized);
      commit("updateIdentities", API.getState().identities);
      commit("updateCredentials", API.getState().credentials);

      dispatch(UPDATE_CONNECTED);
      // Add Refresh connection ( function on MainContainer.vue created() )
    },

    [CONNECT]: ({ commit, state }, { origin, name }) => {
      return new Promise((resolve, reject) => {
        console.log("Action CONNECT");
        state.debug("URL: ", origin);
        state.debug("Connections: ", state.connections);
        // state.debug("Notification: ", state.notification);
        let icon = origin + "/favicon.ico";
        API.approveConnection(origin, icon, name)
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            console.error(e);
            reject(e);
          });
      });
    },
    [ENCRYPT]: ({ commit, state }, { data }) => {
      return new Promise((resolve, reject) => {
        console.log("Action ENCRYPT");
        state.debug("Data: ", data);
        API.encryptData(data)
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            console.error(e);
            reject(e);
          });
      });
    },
    [IMPORT_CRED]: ({ commit, state }, data) => {
      return new Promise((resolve, reject) => {
        console.log("Action IMPORT_CRED");
        state.debug("Data: ", data);
        let ow = true;
        API.importCredential(
          data.id,
          data.credName,
          data.caName,
          data.userData,
          data.status,
          ow,
          data.expDate
        )
          .then((res) => {
            console.log(res);
            resolve(res);
          })
          .catch((e) => {
            console.error(e);
            reject(e);
          });
      });
    },
    [IMPORT]: ({ commit, state }, { idt, data, ow = true, expDate }) => {
      return new Promise((resolve, reject) => {
        console.log("Action IMPORT");
        state.debug("idt: ", idt);
        state.debug("Data: ", data);
        state.debug("ow: ", ow);

        API.importIdentity_v2(idt, data, ow, expDate)
          .then((res) => {
            resolve(res);
          })
          .catch((e) => {
            console.error(e);
            reject(e);
          });
      });
    },
    [DECRYPT]: ({ commit, state }, { data }) => {
      return new Promise((resolve, reject) => {
        console.log("Action DECRYPT");
        state.debug("Data: ", data);
        API.decryptData(data)
          .then((res) => {
            console.log(res);
            resolve(res);
          })
          .catch((e) => {
            console.error(e);
            reject(e);
          });
      });
    },

    [SIGN_ERC]: ({ state, commit, dispatch }, { data }) => {
      return new Promise((resolve, reject) => {
        console.log("Action SIGN_ERC");
        state.debug("Data: ", data);
        API.createERC191Signature(state.address, data)
          .then((res) => {
            console.log(res);
            resolve(res);
          })
          .catch((e) => {
            console.error(e);
            reject(e);
          });
      });
    },

    [SIGN]: ({ state, commit, dispatch }, { data }) => {
      return new Promise((resolve, reject) => {
        console.log("Action SIGN");
        state.debug("Data: ", data);
        API.signPrivateKey(data)
          .then((res) => {
            console.log(res);
            resolve(res);
          })
          .catch((e) => {
            console.error(e);
            reject(e);
          });
      });
    },

    [AUTHORIZE_REQUEST]: (
      { state, commit, dispatch },
      { data, type, callback, origin }
    ) => {
      return new Promise((resolve, reject) => {
        console.log("Action AUTHORIZE_REQUEST");
        state.debug("Params: ", data);
        state.debug("Type: ", type);
        state.debug("Origin: ", origin);
        state.debug("userData: ", data.userData);

        commit("clearPendingRequests");

        switch (type) {
          case "wallet_sign":
            dispatch(SIGN, { data }).then((res) => {
              console.log(res);
              resolve(callback(null, res));
            });
            break;
          case "wallet_sign_erc191":
            dispatch(SIGN_ERC, { data }).then((res) => {
              console.log(res);
              resolve(callback(null, res));
            });
            break;
          case "wallid_token":
            dispatch(GET_TOKEN, { idt: data[0], operation: data[1] }).then(
              (res) => {
                console.log(res);
                resolve(callback(null, res));
              }
            );
            break;
          case "wallid_connect":
            dispatch(CONNECT, { origin }).then((res) => {
              console.log(res);
              resolve(callback(null, res));
            });
            break;

          case "wallet_encrypt":
            dispatch(ENCRYPT, { data }).then((res) => {
              console.log(res);
              resolve(callback(null, res));
            });
            break;

          case "wallet_decrypt":
            dispatch(DECRYPT, { data }).then((res) => {
              let _res = JSON.parse(res);
              resolve(callback(null, _res));
            });
            break;

          case "wallid_import":
            dispatch(IMPORT, {
              idt: data.idt,
              data: data.data,
              expDate: data.expDate,
            })
              .then((res) => {
                console.log("res import:", res);
                resolve(callback(null, true));
              })
              .catch(() => resolve(callback("REJECTED")));

            break;
          case "wallid_import_cred":
            dispatch(IMPORT_CRED, {
              id: data.id,
              credName: data.data.credName,
              caName: data.data.caName,
              status: data.data.status,
              userData: data.data,
              expDate: data.expDate,
            })
              .then((res) => {
                console.log("res import:", res);
                resolve(callback(null, true));
              })
              .catch(() => resolve(callback("REJECTED")));

            break;

          default:
            break;
        }
      })
        .then(() => {
          dispatch(REFRESH_STATE);
          state.debug("Connections: ", state.connections);
        })
        .catch((err) => {
          throw err;
        });
    },
    [CANCEL_REQUEST]: (
      { commit, dispatch, state },
      { request, notification, callback }
    ) => {
      return new Promise((resolve, reject) => {
        console.log("Action CANCEL_REQUEST", callback);
        resolve(callback("REJECTED"));

        commit("updatePendingRequests");
        dispatch(REFRESH_STATE);
      });
    },

    [DISCONNECT]: ({ commit, state }, url) => {
      return new Promise((resolve, reject) => {
        console.log("Action DISCONNECT");
        state.debug("URL: ", url);
        state.debug("Connections: ", state.connections);

        API.removeConnected(url)
          .then(() => {
            commit("updateConnections", API.getState().connections);
            if (url == state.connected.url) {
              commit("updateConnected", false);
            }
            resolve();
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
        API.verifyPassword(password).then((res) => {
          if (res) {
            API.unlockApp(password)
              .then(() => resolve(dispatch(REFRESH_STATE)))
              .catch((e) => {
                reject(e);
              });
          } else {
            reject("Wrong password");
          }
        });
      });
    },
    [LOCK_WALLET]: ({ commit, dispatch }) => {
      console.log("Action LOCK_WALLET");
      API.lockApp().then(() => dispatch(REFRESH_STATE));
    },
  },
  mutations: {
    updateCredentials(state, value) {
      state.credentials = value;
    },
    updateIdentities(state, value) {
      state.identities = value;
    },
    updateOnboarding(state, value) {
      state.completedOnboarding = value;
    },
    updateConnected(state, value) {
      console.log("store", value);
      state.connected = value;
    },
    updateConnections(state, value) {
      state.connections = value;
    },
    clearPendingRequests(state) {
      state.request = null;
    },
    updatePendingRequests(state) {
      state.request = API.getNextRequest();
    },
    updateAddress(state, value) {
      state.address = value;
    },
    updateUnlocked(state, value) {
      state.unlocked = value;
    },
    appendLogger(state, logger) {
      state.debug = logger;
    },
    appendgetDomain(state, getDomain) {
      state.getDomain = getDomain;
    },
  },
});
