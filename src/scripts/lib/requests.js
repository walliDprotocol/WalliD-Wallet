/**
 * RequestAPI Method object fields:
 *
 * -> level: the access level required in order to access and execute the method;
 * -> executor: an array with the execution path of the method: [<controller_module>, <controller_function>]
 * -> main_controller: flag indicating ig the method to execute is defined in the AppController. If the flag
 * is present, the executor field will be an array containing only one element with the format [<app_controller_function>].
 * -> popup: flag indicating if a popup window should be presented to the user upon calling the method.
 */

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
  // Remove for v1.1
  // wallid_token: {
  //   main_controller: true,
  //   level: 1,
  //   executor: ['getAuthorizationToken'],
  // },
  wallid_identities: {
    popup: false,
    level: 0,
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
    args: 5,
  },
  wallid_import_cred: {
    main_controller: true,
    level: 1,
    executor: ['importCredential'],
    args: 7,
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
    args: 3,
  },

  wallid_import_social_profile: {
    main_controller: true,
    level: 1,
    executor: ['importSocialProfile'],
    args: 4,
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
    executor: ['isOnboardingComplete'],
  },
  wallid_list: {
    main_controller: true,
    level: 1,
    executor: ['getList'],
    // params: [listType]
  },

  wallid_export: {
    popup: false,
    level: 2,
    main_controller: true,
    executor: ['exportAsset'],
  },
};

export function getRequestDetails(method) {
  if (RequestAPIMethods[method] == undefined) {
    return Promise.reject('Invalid method call');
  }

  return Promise.resolve(RequestAPIMethods[method]);
}
