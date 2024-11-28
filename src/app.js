const express = require('express');
const app = express();


app.use(
    "/user",
    (req,res,next)=>{
        console.log("Handling the route user 1")
        next();
        res.send("Hello User");
    },
    (req,res,next)=>{
        console.log("Handling the route user 2")
        // res.send("2nd User");
        next();
    },
    (req,res,next)=>{
        console.log("Handling the route user 3")
        // res.send("3nd User");
        next()
    },
    (req,res,next)=>{
        console.log("Handling the route user 4")
        // res.send("4nd User");
        next()
    },
    (req,res,next)=>{
        console.log("Handling the route user 5")
        // res.send("5nd User");
        next()
    },
)


app.listen(3000,()=>{
    console.log('server is running on port 3000');
})