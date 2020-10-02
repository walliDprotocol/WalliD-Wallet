
const InitState = {
    identities: [],
}

export default class IdentitiesController {
    #identities

    constructor(identities = []) {
        this.#identities = identities
    }

    serialize() {
        if(this.#identities.length == 0) {
            return JSON.stringify([])
        }

        return JSON.stringify(this.#identities)
    }

    static deserialize(_ids) {
        if(!_ids || (!Array.isArray(_ids) && typeof _ids != 'string') || _ids.length == 0) {
            return new IdentitiesController()
        }
        let identities = JSON.parse(_ids)
        return new IdentitiesController(identities)
    }

    addIdentity(idt, data, ow) {
        return new Promise((resolve, reject) => {
            const index = this.#identities.findIndex(id => id.idt == idt)
            if(index != -1 && ow) {
                this.#identities.splice(index, 1, { idt, data })
            }
            else if(index != -1) {
                return reject(`Identity type ${idt} already exists`)
            }
            this.#identities.push({ idt, data })
            return resolve()
        })
    }

    deleteIdentity(idt) {
        return Promise.resolve(this.#identities.findIndex(id => id.idt == idt))
            .then(index => { if(index != -1) this.#identities.splice(index, 1) })
    }
}