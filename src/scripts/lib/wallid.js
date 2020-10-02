'use strict'

import { get, post } from './http'
import StateStore from './store'

const API_VERSION = 'v1'

const store = new StateStore()

export function getAuthenticationChallenge(wallet, idt, operation) {
    const url = `https://api.wallid.io/api/${API_VERSION}/auth`
    const query = {
        client_id: 'wallid-web-dev',
        client_secret: 'password'
    }
    const data = { wallet, idt, operation }

    return post(url, { data, query })
}
  
export function buildAuthorizationToken_v1(token, signature) {
    let authToken = token + ':' + signature
    return Promise.resolve(btoa(authToken))
}

export function extractIdentity(auth_token) {
    const url = `https://api.wallid.io/api/${API_VERSION}/extract`
    const headers = {
        'WalliD-Authorization': auth_token
    }

    return get(url, { headers })
}

export function importIdentity_v1(data, ) {
    return Promise.resolve(store.getLocal('identities'))
        //.then(identities => identities.p)
    //store.putLocal({ ids})
}