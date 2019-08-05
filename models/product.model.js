const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    imagePath: {type:String, required: true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
}, {
        timestamps: true
 
});


// Export the model
module.exports = mongoose.model('Product', ProductSchema);
