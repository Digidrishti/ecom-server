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



const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  categoryName: String,
  description: {
    type: String,
    minlength: 3,
  },
  discount: {
    type: Number,
    minlength: 1,
    maxlength: 2,
  },
  image: {                    
    type: String,
  },
  created_on: { type: Date, default: Date.now },
  productTypes: [
    // categoryName: String,
    // productName: String,
    // productType: ,
    // productPrice: req.body.productPrice,
    // productQuantity: req.body.productQuantity,
    // productWeight: req.body.productWeight,
    // images: images 
  ],
});

module.exports = mongoose.model('ProductCategory', productCategorySchema);




// var mongoose = require('mongoose');
// var schema = new mongoose.Schema({
//     firstName: {
//         type: String,
//         required: true,
//     },
//     lastName: {
//         type: String,
//         required: true
//     },
//     grade: {
//         type: String,
//         required: true
//     },
//     dob: {
//         type: String,
//         required: true
//     },
//     genderControl: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     phone: {
//         type: String,
//         required: true
//     },
//     address: {
//         type: String,
//         required: true
//     },
//     status:{
//         type : Boolean,
//         default : true
//     },
//     image: {                    
//         type: String,
//     },
// });
// var student = new mongoose.model('StudentData', schema);
// module.exports = student;