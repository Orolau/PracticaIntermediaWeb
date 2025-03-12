const express = require("express")
const cors = require("cors");
require('dotenv').config();
const dbConnect = require("./config/mongo.js");
const router = require('./routes/index.js')

const app = express();

app.use(cors());
app.use(express.json())

app.use("/api", router);

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log("Servidor escuchando en el puerto " + port);
    dbConnect();
})