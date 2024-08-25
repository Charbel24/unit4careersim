require("dotenv").config();
const express = require("express");
const prisma = require("./db/prisma");
const routes = require('./routes')

const app = express()

app.use(express.json())
app.use (express.urlencoded({extended:true}))


app.use('/api',routes)


const port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`server running on port ${port}`))