const mongoose = require('mongoose');


const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "You must insert a Brand name"],
        unique: [true, "Brand must be unique"],
        minlength: [2, "Brand name must be more than 2 characters"],
        maxlength: [32, "Brand name must be less than 32 characters"]
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String
}, { timestamps: true })

const BrandModel = mongoose.model("Brand", CategorySchema)

module.exports = BrandModel