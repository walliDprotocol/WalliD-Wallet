const RequestAPIMethods = {
    'wallid_connect': {
        popup: true,
        level: 0
    },
    'wallid_disconnect': {
        popup: false,
        level: 1,
        executor: ['connections', 'removeConnected']
    },
    'wallid_token': {
        popup: true,
        level: 1
    },
    'wallid_identities':{
        popup: false,
        level: 1,
        executor: ['identities', 'getIDTsList']
    },
    'wallid_extract': {
        popup: true,
        level: 1
    },
    'wallid_import': {
        popup: true,
        level: 1
    },
    'wallet_address': {
        popup: false,
        level: 1,
        executor: ['wallet', 'getAddress']
    },
    'wallet_encrypt': {
        popup: true,
        level: 1
    },
    'wallet_decrypt': {
        popup: true,
        level: 1
    },
    'wallet_sign_erc191': {
        popup: false,
        level: 1,
        executor: ['wallet', 'signERC191Message']
    }
}

export function getRequestDetails(method) {
    if(RequestAPIMethods[method] == undefined) {
        return Promise.reject('Invalid method call')
    }

    return Promise.resolve(RequestAPIMethods[method])
}