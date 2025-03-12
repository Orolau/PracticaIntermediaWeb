const { default: mongoose } = require('mongoose');
const mogoose = require ('mongoose');
const dbConnect = () =>{
    const db_uri = process.env.DB_URI;
    mogoose.set('strictQuery', false)
    try {
        mogoose.connect(db_uri)
    } catch (error) {
        console.error("Error conectando a la BD: ", error)
    }
    mongoose.connection.on("connected", () => console.log("conectado a la base de datos"))
}
module.exports = dbConnect;