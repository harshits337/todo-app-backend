const connection = require('../db/connection');
const  util  = require('util');
const query = util.promisify(connection.query).bind(connection);

const findUserByEmail = async (email) =>{
    try {
        let user = await query(`select * from users where email='${email}'`);
        return user.length !== 0 ? user[0] : null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const findUserById = async(userId) =>{
    try {
        let user = await query(`select * from users where id='${userId}'`);
        return user.length !== 0 ? user[0] : null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const insertUser = async(userDetails) => {
    try {
        let result = await query(`insert into users values('${userDetails.uuid}','${userDetails.firstName}','${userDetails.lastName}','${userDetails.email}','${userDetails.dob}','${userDetails.type}','${userDetails.password}')`);
        console.log(result);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    findUserByEmail,
    insertUser,
    findUserById
};