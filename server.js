require("dotenv").config();
const express = require("express");
const prisma = require("./db/prisma");


const app = express()

app.get("/",(req,res)=>{
res.send("Welcome")
})

const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`server running on port ${port}`))