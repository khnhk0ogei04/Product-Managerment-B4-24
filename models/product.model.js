const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const { Schema } = mongoose;
const productSchema = new Schema({
    title: String,
    product_category_id: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    createdBy: String,
    updatedBy: String,
    deletedBy: String,
    deleted: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    }
},  {
        timestamps: true // Auto add createdAt and updatedAt
    }
);
const Product = mongoose.model("Product", productSchema, "products");
module.exports = Product;