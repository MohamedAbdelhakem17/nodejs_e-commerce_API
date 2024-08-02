const mongoose = require("mongoose");

const supCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, 
        required: [true, "You must insert Sup Category Name"],
        minlength: [2, "Sup category name must be great than 2 char"],
        maxlength: [32, "Sup category name must be less than 32 char"],
        unique: [true, "Category must be unique"],
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Must insert Category ID"]
    }
}, { timestamps: true })

const SupCategoryModel = mongoose.model("Supcategory", supCategorySchema)
module.exports = SupCategoryModel