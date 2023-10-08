'use strict'
const express = require('express')
const router = express.Router()
const DiscountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

//get amount
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
//get discount code by shop
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodeWithProduct))

//handlerRefreshToken
router.use(authenticationV2)

//create discount code
router.post('/create', asyncHandler(DiscountController.createDiscountCode))
//update discount code
router.patch('/update/:codeId', asyncHandler(DiscountController.updateDiscountCode))
//get discount code by shop
router.get('/', asyncHandler(DiscountController.getAllDiscountCode))


module.exports = router