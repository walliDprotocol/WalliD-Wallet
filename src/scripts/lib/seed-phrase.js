import * as bip39 from 'bip39'


function generate() {
    return bip39.generateMnemonic()
}

function validate(mnemonic) {
    return bip39.validateMnemonic(mnemonic)
}

export default { generate, validate }