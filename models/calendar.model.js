const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CalendarSchema = new Schema({
    timestamp: { type: Number, required: true },
    year: { type: Number, required: true },
    published: { type: Boolean, required: true },
    title: { type: String, required: false },
    description: { type: String, required: false }
}, {
    timestamps: true
});

// Export the model
module.exports = mongoose.model('Calendar', CalendarSchema);
