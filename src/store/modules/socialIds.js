import { SHARE_PROFILE } from '../actions';
import axios from 'axios';

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
  [SHARE_PROFILE]: ({ rootState, commit, state }, body) => {
    return new Promise((resolve, reject) => {
      rootState.debug('Action SHARE_PROFILES');
      rootState.debug('Body: ', body);
      let url = 'https://dca.wallid.io/api/v1/social-profile/share';
      axios(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
      }).then((res) => {
        rootState.debug(res);
        resolve(res);
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
