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
};

const validateEditProfileData = (req) => {
    const allowedFields = ["firstName", "lastName", "email", "password", "age", "about", "skills"];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedFields.includes(field)
    );
    return isEditAllowed
}


module.exports = {
    validatSignUpData,
    validateEditProfileData,
};