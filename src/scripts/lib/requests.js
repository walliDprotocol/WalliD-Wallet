const RequestAPIMethods = {
    'wallid_connect': { popup: true },
    'wallid_disconnect': {
        popup: false,
        executor: ['connections', 'removeConnected']
    },
    'wallid_extract': { popup: true },
    'wallet_address': {
        popup: false,
        executor: ['wallet', 'getAddress']
    },
    'wallet_encrypt': { popup: true },
    'wallet_decrypt': { popup: true }
}

export function getRequestDetails(method) {
    if(RequestAPIMethods[method] == undefined) {
        return Promise.reject('Invalid method call')
    }

    return Promise.resolve(RequestAPIMethods[method])
}