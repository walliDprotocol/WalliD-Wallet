const RequestAPIMethods = {
  wallid_connect: {
    popup: true,
    level: 0,
  },
  wallid_disconnect: {
    popup: false,
    level: 1,
    executor: ["connections", "removeConnected"],
  },
  wallid_token: {
    popup: true,
    level: 1,
  },
  wallid_identities: {
    popup: false,
    level: 1,
    executor: ["identities", "getIDTsList"],
  },
  wallid_extract: {
    popup: true,
    level: 1,
  },
  wallid_import: {
    popup: true,
    level: 1,
  },
  wallid_import_cred: {
    popup: true,
    level: 1,
  },
  wallid_import_sign: {
    popup: true,
    level: 1,
  },
  wallid_set_provider: {
    popup: false,
    level: 1,
    executor: ['configurations', 'setProvider']
  },
  wallet_address: {
    popup: false,
    level: 1,
    executor: ["wallet", "getAddress"],
  },
  wallet_encrypt: {
    popup: true,
    level: 1,
  },
  wallet_decrypt: {
    popup: true,
    level: 1,
  },
  wallet_sign_erc191: {
    popup: true,
    level: 1
  },
  wallet_sign: {
    popup: true,
    level: 1,
  },
  wallet_ec_sign: {
    popup: true,
    level: 1,
  },
};

export function getRequestDetails(method) {
  if (RequestAPIMethods[method] == undefined) {
    return Promise.reject("Invalid method call");
  }

  return Promise.resolve(RequestAPIMethods[method]);
}
