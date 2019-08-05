const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ContactSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
}, {
        timestamps: true

    });

// Export the model
module.exports = mongoose.model('Contact', ContactSchema);


