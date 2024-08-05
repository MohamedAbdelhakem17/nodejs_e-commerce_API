const mongoose = require("mongoose");

const {ObjectId} = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Must insert product title"],
        minlength: [3, "Product title must be more than 3 char"],
        maxlength: [100, "Product title must be less than 100 char"],
    },
    slug: {
        type: String,
        required:true, 
        lowercase: true
    },
    description: {
        type: String,
        required: [true, "Must insert product description"],
        minlength: [20, "Product description must be more than 20 char"]
    },
    price: {
        type: Number,
        required: [true, "Must insert product price"],
        max: [200000, "Over price limit"]
    },
    priceAfterDiscount: {
        type: Number,
        required: false
    },
    colors: {
        type: [String]
    },
    sold: {
        type: Number,
        default: 0
    },
    imageCover: {
        type: String,
        required: [true, 'Product Image cover is required'],
    },
    images: {
        type: [String]
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: [true, "Must select product category"]
    },
    subCategorys: [
        {
            type: ObjectId,
            ref: "Subcategory"
        }
    ],
    brand: {
        type: ObjectId,
        ref: "Brand"
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Rating must be below or equal 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
