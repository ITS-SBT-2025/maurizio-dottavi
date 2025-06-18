const crypto=require('crypto');

function generatePassword (password) {

    let salt = crypto.randomBytes(32).toString('hex');
    let hash = crypto.pbkdf2Sync(password, salt,1000,64, 'sha512').toString('hex');
    return {salt, hash};
}

function validatePassword (password, hashStored, salt) {

    let hashtoVerify = crypto.pbkdf2Sync(password, salt,1000,64, 'sha512').toString('hex');
    return hashtoVerify == hashStored;
}

module.exports.generatePassword = generatePassword;
module.exports.validatePassword = validatePassword;

