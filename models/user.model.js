const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

var userSchema = new Schema({
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: {
        type: Boolean, default: false
    }
}, {
        timestamps: true

    });
//creating encrypted password
userSchema.methods.encryptPassword = function (password) {  
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password); //current user
};
// Export the model
module.exports = mongoose.model('User', userSchema);