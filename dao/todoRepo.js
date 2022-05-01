const connection = require('../db/connection');
const  util  = require('util');
const moment = require('moment');
const query = util.promisify(connection.query).bind(connection);

const addTodo =async (todoRequest) =>{
    try {
        console.log(todoRequest);
        const {id,title,description,dueDate,status,userId,createdAt} = todoRequest;
        let insertQuery = await query(`insert into todo values('${id}','${title}','${description}','${userId}','${status}','${createdAt}','${null}')`);
        console.log("insertQuery");
        return true;
    } catch (error) {
        console.log(error);
    }
}

const getTodoDetailsById = async(id) => {
    try {
        let getTodoQuery = await query(`select * from todo where id='${id}'`);
        return getTodoQuery[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getTodoDetailsForUserId = async(userId,filters) =>{
    try {
        const {date,status} = filters;
        let getTodoQuery = await query(`select * from todo where userId='${userId}' and status='${status}' and DATE_FORMAT(createdAt,'%m-%d-%Y')=DATE_FORMAT('${date}','%m-%d-%Y')`);
        return getTodoQuery;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const updateTodo = async(todoDetails) => {
    try {
        const {id,title,description,dueDate} = todoDetails;
        let updateTodoQuery = await query(`update todo set title='${title}', description='${description}',updatedAt='${new Date()}' where id='${id}'`);
        return true;        
    } catch (error) {
        console.log(error);
        return false;
    }

}

const completeTodo = async(id) =>{
    try {
        let completeTodoQuery = await query(`update todo set status='COMPLETED', updatedAt='${new Date()}' where id='${id}';`);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const deleteTodo = async(id) => {
    try {
        let deleteTodoQuery = await query(`delete from todo where id='${id}';`);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
module.exports = {
    addTodo,
    getTodoDetailsById,
    getTodoDetailsForUserId,
    updateTodo,
    completeTodo,
    deleteTodo
}