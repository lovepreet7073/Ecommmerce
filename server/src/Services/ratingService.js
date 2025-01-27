const Rating = require('../models/ratingModel');
const productService = require('./productService')


const createRating = async(req,user)=>{
const product = await productService.findProductById(req.productId)
const rating  = new Rating({
    product:product._id,
    user:user._id,
    rating:req.rating,
    createdAt:new Date()
})
return await rating.save();
}


const getProductRating = async(productId)=>{
    return await Rating.find({product:productId});
}

module.exports = {
    createRating,
    getProductRating
}

