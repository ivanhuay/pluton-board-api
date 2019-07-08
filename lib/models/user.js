'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String
    },
    bio: String,
    externalId: {
        type:Number,
        index: true
    },
    profileImage: String,
    url: String,
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    access_token: String,
    latestLogin:{
        type: Date,
        default: Date.now()
    }
}, {
    timestamps: true
});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.toJSON = function() {
    let obj = this.toObject();
    Reflect.deleteProperty(obj, 'password');
    Reflect.deleteProperty(obj, 'access_token');
    return obj;
};

userSchema.pre('save', function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
    }
    return next();
});


module.exports = mongoose.model('User', userSchema);
