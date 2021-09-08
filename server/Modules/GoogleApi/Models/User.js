const mongoose = require('mongoose');
const modelName = 'User';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    googleAuth: {
        type: String,
        default: ''
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    deleted:{
        type: Boolean,
        default: false
    },
    deletedAt:{
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model(modelName, userSchema);