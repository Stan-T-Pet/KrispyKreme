import validator from "email-validator";

export const validateEmail = (email) => {
    //use validator to check email is formated correctly
    if (!email || !validator.validate(email)) {
        return "Email is empty or invalid format.";
    }
    //email cant exceed 50 chars
    if (email.length > 50) {
        return "Email must not exceed 50 characters.";
    }
    return null;
};

export const validatePassword = (password) => {
    if (!password) {
        return "Password is required.";
    }
    // pass must be more than 6 chars and less than 50
    if (password.length < 6 || password.length > 50) {
        return "Password needs to be longer than 6 chars but less than 50.";
    }
    return null;
};

export const validateConfirmation = (value, confirmValue, fieldName) => {
    if (value !== confirmValue) {
        return `${fieldName} do not match.`;
    }
    return null;
};