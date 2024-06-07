const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null), // can be empty or null values
        mobileno: Joi.number().required().integer().min(1000000000).max(9999999999) // Adjusted for a 10-digit mobile number
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), // so that rating is not accepted above 5 or below 1 via server side
        comment: Joi.string().required(),
    }).required(),
});
