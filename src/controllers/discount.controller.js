'use strict'

const DiscountService = require('../services/discount.service')

const { CREATED ,SuccessResponse } = require("../core/success.response")

class DiscountController{
    //create discount code
    createDiscountCode = async (req, res, next) => {
        new CREATED({
            message: 'create discount code',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)  
    }

    //update discount code
    updateDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'update discount code',
            metadata: await DiscountService.updateDiscountCode(req.params.codeId, {...req.body} )
        }).send(res)  
    }

    //get all discount code of shop
    getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'get all discount code by shop success',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)  
    }

    //get discount amount
    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'get discount amount success',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }

    //get discount code with product
     getAllDiscountCodeWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'get discount code with product success',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res)  
    }

    //get discount code with product
    delelteDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'get discount code with product success',
            metadata: await DiscountService.deleteDiscountCode({
                shopId: req.user.userId,
                code: req.params.code
            })
        }).send(res)  
    }


}

module.exports = new DiscountController()