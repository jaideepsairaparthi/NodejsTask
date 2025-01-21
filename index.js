let connection=require("./SqlConnection");
let express = require("express");
let bcrypt = require("bcrypt");
let seckey = "abcdefghijklmnopqrstuvwxyz0123456789"
let jsonwebtoken= require("jsonwebtoken")
let app = express();
app.use(express.json());
app.post("/register",(req,res)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            res.send({
                msg:err.message,
                statusCode:400
            })
        }else{
            req.body.password=hash
            connection.query("select * from userdata where user=?",[req.body.user],(err,data)=>{
                if(err){
                    res.end({
                        msg:err.message
                    })
                }
                else{
                    console.log(data);
                    if(data.length>0){
                        res.send({
                            msg:"User already Exists"
                        });
                    }
                    else{
                        connection.query(`insert into userdata (user, password, email, dob)
 values (?, ?, ?, ?)`,[req.body.user, req.body.password, req.body.email, req.body.dob],(err,data)=>{
                if(err){
                    res.send({
                        msg:err.message,
                        statuscode:400
                    })
                }
                else{
                    res.send({
                        msg:"registered successfully",
                        data:data,
                        statuscode:200
                    })
                }
            })
                    }
                    
                }
            })
        }
    })
});
app.post("/login",(req,res)=>{
    connection.query("select * from userdata where user=?",[req.body.user],(err,data)=>{
        if(err){
            res.send({
                msg:err.message,
                statusCode:400
            })
        }else{
            if(data.length>0){
                bcrypt.compare(req.body.password,data[0].password,(err,result)=>{
                    if(err){
                        res.send({
                            msg:err.message,
                            statusCode:400 
                        })
                    }else{
                        var usercheck = req.body.user==data[0].user;
                        if(usercheck && result){
                            let token = jsonwebtoken.sign({id:data[0].id},seckey)
                            res.send({
                                msg:"successfully logged",
                                token: token,
                                statusCode:200
                            });
                        }
                        else{
                            res.send({
                                msg:"invalid syntax",
                                statusCode:200
                            });
                        }
                    }
                })
            }
        }
       })
});

app.listen(3000,()=>{
    console.log("hi server started");
})