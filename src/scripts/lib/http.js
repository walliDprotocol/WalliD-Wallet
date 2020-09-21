function queryParams(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

export function get(url, headers, query) {
    const config = {
        method: 'GET'
    }

    if(query) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(query);
    }

    return fetch(url, config)
        .then(response => response.json())
        .catch(err => Promise.reject(err))
}

export function post(url, options) {
    const config = {
        method: 'POST',
        body: options.data? JSON.stringify(options.data) : undefined,
        headers: options.data? { 'Content-Type' : 'application/json' } : undefined
    }

    if(options.query) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(options.query);
    }

    return fetch(url, config)
        .then(response => Promise.resolve(response.json())
            .then(data => Promise.resolve({
                ok: response.ok,
                status: response.status,
                body: data
            })))
        .catch(err => Promise.reject(err))
}

