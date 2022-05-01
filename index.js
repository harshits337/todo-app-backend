const express = require("express");
const connection = require("./db/connection");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

connection.connect();

app.use("/rest/api/user",require("./routes/api/user"));
app.use("/rest/api/todo",require("./routes/api/todo"));

app.listen(PORT,()=>{
    console.log(`Server started on Port ${PORT}`);
})