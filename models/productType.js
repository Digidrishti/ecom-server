// const mongoose = require("mongoose");

// const ProductCategory = 
//   mongoose.Schema({
//     productCategory: {
//         type: String,
//         minlength: 3,
//         maxlength: 20,
        
//     },
//     description: {
//         type: String,
//         minlength: 3,
//         maxlength: 20,
//       },
//     image: {
//         type: String,
//         minlength: 3,
//         maxlength: 255,
//     },
//     discount: {
//         type: Number,
//         minlength: 1,
//         maxlength: 2,
//     },
//     created_on: { type: Date, default: Date.now },
//   })

// module.exports = mongoose.model('ProductCategory',ProductCategory);

// models/ProductType.js



// models/ProductCategory.js
const mongoose = require('mongoose');

// const productTypeSchema = new mongoose.Schema({
//   typeName: String,
//   category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' }
// });

const productTypeSchema = new mongoose.Schema({
  categoryName: String,
  productName: String,
  productType: String,
  productPrice: String,
  productQuantity: String,
  productWeight: String,
 
  images: [{
    type: String // Assuming images will be stored as URLs
  }],
  created_on: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProductType', productTypeSchema);