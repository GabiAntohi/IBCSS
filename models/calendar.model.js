const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CalendarSchema = new Schema({
    month: { type: String, required: true },
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
}, {
    timestamps: true
});

// Export the model
module.exports = mongoose.model('CalendarSchema', CalendarSchema);
