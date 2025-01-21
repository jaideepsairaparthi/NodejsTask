let mysql2 = require("mysql2");


let connection = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"Prabhas143@?",
    database:"databaseConnection"
});

connection.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("hi connected to mysql");  
    }
})

module.exports=connection;