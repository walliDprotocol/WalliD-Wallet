'use strict'

import { get, post } from './http'

const API_VERSION = 'v1'

export function getAuthenticationChallenge(wallet) {
    //const url = `https://api.wallid.io/api/${API_VERSION}/auth`
    const url = `http://localhost:3001/api/auth`
    const data = { wallet }
    return post(url, { data }).catch(e => Promise.reject('ERR_WALLID_API'))
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