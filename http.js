const express = require("express")
const app = express()
const http = require("http").createServer(app)

const cors = require('cors')

//rotas
const router = require("./src/routes/routes")

app.use(cors())

app.use("/", router);

module.exports = { http }
