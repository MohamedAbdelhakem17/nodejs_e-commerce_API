const mongoose = require('mongoose');


const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "You must insert a category name"],
        unique: [true, "Category must be unique"],
        minlength: [3, "Category name must be more than 3 characters"],
        maxlength: [32, "Category name must be less than 32 characters"]
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String
}, { timestamps: true })

const CategoryModel = mongoose.model("Category", CategorySchema)

module.exports = CategoryModel