const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let BlogSchema = new Schema({
    imagePath: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, required: true }
}, {
        timestamps: true

    });

// Export the model
module.exports = mongoose.model('Blog', BlogSchema);


