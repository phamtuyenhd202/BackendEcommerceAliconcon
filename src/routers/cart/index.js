'use strict'
const express = require('express')
const router = express.Router()
const CartService = require('../../controllers/cart.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

router.post('', asyncHandler(CartService.addToCart))
router.delete('', asyncHandler(CartService.delete))
router.post('/update', asyncHandler(CartService.update))
router.get('', asyncHandler(CartService.listToCart))

module.exports = router