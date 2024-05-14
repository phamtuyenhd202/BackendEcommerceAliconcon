'use strict'

const CheckoutService = require('../services/checkout.service')

const { SuccessResponse } = require("../core/success.response")

class CheckoutController{
    checkoutReview = async (req, res, next) =>{
        new SuccessResponse({
            message: 'checkout success!',
            metadata: await CheckoutService.checkoutReview( req.body )
        }).send(res)
    }

    //order
    orderByUser = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Order product success!',
            metadata: await CheckoutService.orderByUser( req.body )
        }).send(res)
    }
}

module.exports = new CheckoutController()