const mongoose = require("mongoose");

const supCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "You must insert Sup Category Name"],
        minlength: [3, "Sup category name must be great than 3 char"],
        maxlength: [32, "Sup category name must be less than 32 char"],
        unique: [true, "Category must be unique"],
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId , 
        ref: "Category", 
        required:[true , "Must insert Category ID"]
    }
}, { timestamps: true })

const SupCategoryModel = mongoose.model("Supcategory", supCategorySchema)
module.exports = SupCategoryModel