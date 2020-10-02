import * as bip39 from 'bip39'


export function generate() {
    return bip39.generateMnemonic()
}

export function validate(mnemonic) {
    return bip39.validateMnemonic(mnemonic)
}