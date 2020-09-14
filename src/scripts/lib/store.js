import extension from 'extensionizer'


class MemoryStore {
    #state

    constructor (initState = {}) {
        this.#state = initState
    }

    getState() {
        return this._getState()
    }

    putState(newState) {
        this._putState(newState)
    }

    updateState(partialState) {
        // if non-null object, merge
        if (partialState && typeof partialState === 'object') {
            const state = this.getState()
            const newState = { ...state, ...partialState }
            this.putState(newState)
        // if not object, use new value
        } else {
            this.putState(partialState)
        }
    }

    _getState() {
        return this.#state
    }

    _putState(newState) {
        this.#state = newState
    }
}

export default class StateStore extends MemoryStore {
    #local

    constructor(initState = {}) {
        super(initState)
        this.#local = extension.storage.local
    }

    putLocal(data) {
        return Promise.resolve(this.#local.set(data))
    }

    getLocal(key) {
        return new Promise((resolve, _) => {
            this.#local.get(null, data => {
                console.log('getLocal', data)
                resolve(key? data[key] : data)
            })
        })
    }

    clearLocal() {
        return Promise.resolve(this.#local.clear())
    }

    removeLocal(key) {
        return Promise.resolve(this.#local.remove(key))
    }

    delete(key) {
        return Promise.resolve(this.updateState({ [key]: null }))
    }
} 