const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete")

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
            enum: ["user", "admin", "guest"],
            type: String,
            default: "user"
        },
        status:{
            enum: [0,1],
            type: Number,
            default: 0
        },
        name:{
            type: String,
            default: ""
        },
        surnames:{
            type: String,
            default: ""
        },
        nif:{
            type: String,
            default: ""
        },
        company:{
            name:{type: String},
            cif:{type: String},
            street:{type: String},
            number:{type: Number},
            postal:{type: Number},
            city:{type: String},
            province:{type: String},
        },
        url: {
            type: String
        },
        address:{
            street: {type: String},
            number: {type: Number},
            city: {type: String},
            postal: {type: Number},
            province: {type: String},
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

UserScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("userModel", UserScheme)