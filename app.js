require("dotenv").config();
const express = require("express");
const prisma = require("./db/prisma");
const routes = require('./routes')

const app = express()

app.use(express.json())
app.use (express.urlencoded({extended:true}))

app.use(express.static('public'));


app.use('/api',routes)


module.exports = {app,prisma};