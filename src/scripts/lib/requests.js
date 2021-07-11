const RequestAPIMethods = {
  wallid_connect: {
    popup: true,
    level: 0,
  },
  wallid_disconnect: {
    popup: false,
    level: 1,
    executor: ['connections', 'removeConnected'],
  },
  wallid_token: {
    main_controller: true,
    level: 1,
    executor: ['getAuthorizationToken'],
  },
  wallid_identities: {
    popup: false,
    level: 1,
    executor: ['identities', 'getIDTsList'],
  },
  wallid_extract: {
    popup: false,
    level: 2,
    executor: ['identities', 'extractIdentity'], //CHANGE
  },
  wallid_import: {
    popup: false,
    main_controller: true,
    level: 1,
    executor: ['importIdentity_v2'],
  },
  wallid_import_cred: {
    main_controller: true,
    level: 1,
    executor: ['importCredential'],
  },
  wallid_export_cred: {
    main_controller: true,
    level: 1,
    executor: ['exportCredential'],
  },
  wallid_import_sign: {
    main_controller: true,
    level: 1,
    executor: ['importCredentialSign'],
  },

  wallid_import_social_profile: {
    main_controller: true,
    level: 1,
    executor: ['importSocialProfile'],
  },
  wallid_set_provider: {
    level: 1,
    executor: ['configurations', 'setProvider'],
  },
  wallet_address: {
    level: 1,
    executor: ['wallet', 'getAddress'],
  },
  wallet_encrypt: {
    level: 2,
    executor: ['wallet', 'encryptData'],
  },
  wallet_decrypt: {
    level: 2,
    executor: ['wallet', 'decryptData'],
  },
  wallet_sign_erc191: {
    level: 2,
    executor: ['wallet', 'signERC191Message'],
  },
  wallet_sign_ec: {
    level: 2,
    executor: ['wallet', 'signECMessage'],
  },
  wallet_sign: {
    level: 2,
    executor: ['wallet', 'signEthereumMessage'],
  },

  wallet_verify: {
    level: 2,
    executor: ['wallet', 'verifyEthereumSignedMessage'],
  },
  wallid_open: {
    popup: true,
    level: 1,
  },
  generateSeedPhrase: {
    main_controller: true,
    create: true,
    level: 0,
    executor: ['generateSeedPhrase'],
  },
  createNewVault: {
    main_controller: true,
    create: true,
    level: 0,
    executor: ['createNewVault'],
  },
  unlockApp: {
    main_controller: true,
    create: true,
    level: 0,
    executor: ['unlockApp'],
  },
  wallid_onboarding: {
    main_controller: true,
    create: true,
    level: 0,
    executor: ['getState'],
  },
};

export function getRequestDetails(method) {
  if (RequestAPIMethods[method] == undefined) {
    return Promise.reject('Invalid method call');
  }

  return Promise.resolve(RequestAPIMethods[method]);
}
