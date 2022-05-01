const express = require('express');
const { findUserByEmail, findUserById } = require('../../dao/userDao');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { addTodo, getTodoDetailsById, getTodoDetailsForUserId, updateTodo, completeTodo, deleteTodo } = require('../../dao/todoRepo');
const auth = require('../../middlewares/auth');

// Add todo
router.post('/add',auth,async(req,res)=>{
    try {
        const {title,description,dueDate,userId} = req.body;
        let user = await findUserById(userId);
        if(!user){
            return res.status(400).send({"message" : "Invalid Request"});
        }

        let result = await addTodo({
            id : uuidv4(),
            title,
            description,
            dueDate,
            userId,
            status : 'PENDING',
            createdAt : new Date().toISOString()
        })
        console.log(result)
        return res.status(200).send(result);
    } catch (error) {
        console.log(error)
        return res.status(500).send("Internal Server error");
    }
})

//Get Todo Details by Id
router.get('/:id',auth,async(req,res)=>{
    try {
        let todoId = req.params.id;
        let todo = await getTodoDetailsById(todoId);
        if(!todo){
            return res.status(400).send({"message" : "Invalid Todo Id"});
        }
        return res.status(200).send(todo);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server error");
    }
})

// Get Todo Details for user
router.get('/user/:id',auth, async(req,res)=>{
    try {
        let userId = req.params.id;
        let filters = req.query;
        console.log(filters);
        let todoList = await getTodoDetailsForUserId(userId,filters);
        return res.status(200).send(todoList);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server error");
    }
})

// Update Todo 
router.put('/update',auth,async(req,res)=>{
    try {
        let todoId = req.body.id;
        if(!getTodoDetailsById(todoId)){
            return res.status(400).json({"message" : "Invalid todo"})
        }
        let updateResult = await updateTodo(req.body);
        if(updateResult){
            return res.status(200).send({"success" : updateResult});
        }
        return res.status(400).send({"success" : updateResult});
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server error');
    }
})

// Complete todo
router.put('/complete/:id',auth,async(req,res)=>{
    try {
        let todoId = req.params.id;
        if(!(await getTodoDetailsById(todoId))){
            return res.status(400).json({"message" : "Invalid Todo"});
        }
        let completeResult = await completeTodo(todoId);
        if(completeResult){
            return res.status(200).send({"success" : completeResult})
        }
        return res.status(400).send({"success" : completeResult})
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
})

router.delete('/delete/:id',auth,async(req,res)=>{
    try {
        let todoId = req.params?.id;
        if(!(await getTodoDetailsById(todoId))){
            return res.status(400).json({"message" : "Invalid Todo"});
        }
        let deleteTodoResult = await deleteTodo(todoId);
        return res.status(deleteTodoResult ? 200 : 400).send({"success" : deleteTodoResult});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
})

module.exports = router;