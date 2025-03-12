const mongoose = require("mongoose");
const UserScheme = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true
        },
        password:{
            type: String
        },
        veryficationAtemps:{
            type: Number,
            default: 3
        },
        code:{
            type: Number
        },
        role:{
            enum: ["user", "admin"],
            type: String,
            default: "user"
        },
        status:{
            enum: [0,1],
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)
module.exports = mongoose.model("userModel", UserScheme)