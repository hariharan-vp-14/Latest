const userParticipantModel = require('../models/userpart.model');

module.exports.createUserParticipant = async({
    firstname, lastname, email, password, eduInfo, age, institution, disabilityType
}) => {
    if(!firstname || !email || !password ){
        throw new Error('All required fields are needed');
    }

    const user = await userParticipantModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        eduInfo,
        age,
        institution,
        disabilityType
    });

    return user;
};