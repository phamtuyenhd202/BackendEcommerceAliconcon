'use strict'
const express = require('express')
const router = express.Router()
const CheckoutController = require('../../controllers/checkout.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')


//create discount code
router.post('/review', asyncHandler(CheckoutController.checkoutReview))


module.exports = router