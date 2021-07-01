import { SHARE_PROFILE } from '../actions';

const { API } = chrome.extension.getBackgroundPage();

const state = {
  LOGOS_FOLDER: 'wallid-template-logos/',
  photos: [],
};
const mutations = {
  photoUpload: (state, value) => {
    state.photos.push({ url: value });
  },
};
const actions = {
  [SHARE_PROFILE]: ({ rootState, commit, state }, data) => {
    return new Promise((resolve, reject) => {
      rootState.debug('Action SHARE_PROFILE');
      rootState.debug('Data: ', data);
      API.signPrivateKey(data.url)
        .then((res) => {
          rootState.debug(res);
          let url = 'https://demo.dca.wallid.io/api/v1/proof/share';
          data.url_sig = res;
          axios(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            data: data,
          }).then((res) => {
            rootState.debug(res);
            resolve(res);
          });
        })
        .catch((e) => {
          console.error(e);
          reject(e);
        });
    });
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
