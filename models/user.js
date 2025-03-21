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
            type: String
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
        },
        name:{
            type: String
        },
        surnames:{
            type: String
        },
        nif:{
            type: String
        },
        company:{
            name:{type: String},
            cif:{type: String, unique: true},
            street:{type: String},
            number:{type: Number},
            postal:{type: Number},
            city:{type: String},
            province:{type: String},
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)
module.exports = mongoose.model("userModel", UserScheme)