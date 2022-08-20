// Lukso specific store to use lukso libs and contracts

// import { ethers } from 'ethers';
import extension from 'extensionizer';

const { API } = extension.extension.getBackgroundPage();

const state = () => ({
  UPAddress: API.getState().UPAddress,
  KMAddress: API.getState().KMAddress,
  // RENAME
  currentDisplayAddress: '0x964D8aC207EF2B7Eda11Fdf1cc500B2F78364515',
  isFromVault: false,
  vaultsAddresses: [],
});
const mutations = {
  UPAddress(state, value) {
    state.UPAddress = value;
  },
  KMAddress(state, value) {
    state.KMAddress = value;
  },
};
const actions = {
  ['changeCurrentDisplayAddress']: async (
    { rootState, dispatch, commit, state },
    { accountAddress }
  ) => {
    let isVault = state.vaultsAddresses.find((v) => v === accountAddress);

    commit('isFromVault', isVault);
    commit('currentDisplayAddress', accountAddress);
    await dispatch('getLuskoAssets');
  },
  ['fetchProfile']: async ({ rootState, dispatch, state }) => {
    const fetchProfile = await API.fetchProfile(rootState.address);
    console.log('fetchProfile: ', fetchProfile);

    dispatch('updateLuskoStore');
    return fetchProfile;
  },
  ['fetchVaults']: async ({ rootState, dispatch, state }) => {
    const fetchVaults = await API.fetchVaults(rootState.address);
    console.log('fetchVaults: ', fetchVaults);

    return fetchVaults;
  },
  ['createUniversalProfile']: async ({ rootState, dispatch, state }) => {
    const deployedContracts = await API.createUniversalProfile(
      rootState.address
    );
    console.log('deployedContracts: ', deployedContracts);

    const myUPAddress = deployedContracts.LSP0ERC725Account.address;
    console.log('my Universal Profile address: ', myUPAddress);

    dispatch('updateLuskoStore');
    return deployedContracts;
  },
  ['importUniversalProfile']: async (
    { rootState, dispatch, state },
    UPAddressToImport
  ) => {
    const deployedContracts = await API.importUniversalProfile(
      rootState.address,
      UPAddressToImport
    );
    console.log('deployedContracts: ', deployedContracts);

    const myUPAddress = deployedContracts.LSP0ERC725Account.address;
    console.log('my Universal Profile address: ', myUPAddress);

    dispatch('updateLuskoStore');
    return deployedContracts;
  },

  ['mintLSP7Tokens']: async ({ rootState, dispatch, state }) => {
    const mintLSP7Tokens = await API.mintLSP7Tokens(rootState.address);
    console.log('mintLSP7Tokens: ', mintLSP7Tokens);

    dispatch('updateLuskoStore');
    return mintLSP7Tokens;
  },

  ['createVaultOnUP']: async ({ rootState, dispatch, state }) => {
    console.log('Action createVaultOnUP: ');

    let newVaultAddress = await dispatch('createVault');
    console.log('newVaultAddress: ', newVaultAddress);

    let resultSetVaultUP = await dispatch('setVaultAddressUP', newVaultAddress);
    console.log('resultSetVaultUP: ', resultSetVaultUP);

    await dispatch('updateLuskoStore');
    return newVaultAddress;
  },

  ['createVault']: async ({ rootState, dispatch, state }) => {
    const createVault = await API.createVault(rootState.address);
    console.log('createVault: ', createVault);

    return createVault;
  },
  ['setVaultAddressUP']: async (
    { rootState, dispatch, state },
    vaultAddress
  ) => {
    const setVaultAddressUP = await API.setVaultAddressUP(vaultAddress);
    console.log('setVaultAddressUP: ', setVaultAddressUP);

    return setVaultAddressUP;
  },

  ['balanceOf']: async (
    { rootState, dispatch, state },
    { accountAddress, tokenAddress }
  ) => {
    const createVault = await API.balanceOf(accountAddress, tokenAddress);
    console.log('createVault: ', createVault);

    return createVault;
  },
  ['transferLSP7Token']: async (
    { rootState, dispatch, state },
    { fromAccountAddress, toAccountAddress, tokenAddress, amount, isFromVault }
  ) => {
    const transferLSP7Token = await API.transferLSP7Token(
      state.currentDisplayAddress,
      toAccountAddress,
      tokenAddress,
      amount,
      state.isFromVault
    );
    console.log('transferLSP7Token: ', transferLSP7Token);

    dispatch('getLuskoAssets');

    return transferLSP7Token;
  },
  ['transferLSP8Token']: async (
    { rootState, dispatch, state },
    { fromAccountAddress, toAccountAddress, tokenAddress, tokenId }
  ) => {
    const transferLSP8Token = await API.transferLSP8Token(
      state.currentDisplayAddress,
      toAccountAddress,
      tokenAddress,
      tokenId,
      state.isFromVault
    );
    console.log('transferLSP8Token: ', transferLSP8Token);
    dispatch('getLuskoAssets');

    return transferLSP8Token;
  },
  ['getMetadata']: async (
    { rootState, dispatch, commit, state },
    { assetAddress, ownerAddress, tokenId, assetType }
  ) => {
    const getMetadata = await API.getMetadata(
      assetAddress,
      ownerAddress,
      tokenId,
      assetType
    );
    console.log('getMetadata: ', getMetadata);

    return getMetadata;
  },
  ['getLuskoAssets']: async ({ commit, dispatch, state }) => {
    console.log('getLuskoAssets:');

    // 1st get vaults
    let vaultList = await dispatch('fetchVaults');
    console.log('vaultList: ', vaultList);

    const assetsList = await API.getAssetsOfAddress(
      state.currentDisplayAddress
    );
    console.log('assetsList: ', assetsList);
    const assetsMetadataList = [];
    for (let i = 0; i < assetsList.length; i++) {
      const element = assetsList[i];
      console.log('element: ', element);

      assetsMetadataList.push(
        await dispatch('getMetadata', {
          ...element,
          ownerAddress: state.currentDisplayAddress,
        })
      );
    }

    commit('assets', assetsMetadataList, { root: true });

    return assetsMetadataList;
  },

  updateLuskoStore: ({ rootState, dispatch, commit, state }) => {
    commit('UPAddress', API.getState().UPAddress);
    commit('KMAddress', API.getState().KMAddress);
    dispatch('getLuskoAssets');
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
