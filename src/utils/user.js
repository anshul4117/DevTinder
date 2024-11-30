const validatore = require('validator');

const validatSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName || lastName)) {
        throw new Error('Name is not valid');
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error('firstName should be 4-50 characters');
    } else if (!validatore.isEmail(email)) {
        throw new Error('Email is not valid');
    } else if (!validatore.isStrongPassword(password)) {
        throw new Error('Password is not Strong');
    }
}


module.exports = validatSignUpData;