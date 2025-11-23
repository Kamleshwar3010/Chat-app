const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/register').then(() => console.log("Sucessfull")).catch((err) => console.log(err));
const regsechema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength:3,
    },
    gender: {
        type: Object,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength:10,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
        min:10,
        maxlength:10
    },
    pass: {
        type: String,
        required: true
    },
    conpass: {
        type: String,
        required: true
    },

})
const Regmodel=new mongoose.model("Regmodel",regsechema);
module.exports=Regmodel;