const userModel = require('../models/usermodel');


module.exports.createUser = async({
    firstname,lastname,email,password, institution, address, designation, contact, totalNumberPhysical
}) => {
    if(!firstname || !email || !password ){
        throw new Error('All fields are required');
    }

    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        institution,
        address,
        designation,
        contact,
        totalNumberPhysical
    })

    return user
}