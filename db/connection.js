const mysql = require('mysql');
const connection = mysql.createConnection({
    host:'todo-app.c040ghe6dqee.us-east-2.rds.amazonaws.com',
    user : 'admin',
    password : 'adminmaster',
    database : 'todo_app',
    port:3306
},(err)=>{
    console.log(err);
});

module.exports = connection;
