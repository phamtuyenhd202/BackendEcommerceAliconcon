'use strict'
const express = require('express')
const router = express.Router()
const InventoryController = require('../../controllers/inventory.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

router.use(authenticationV2)
//create discount code
router.post('', asyncHandler(InventoryController.addStockToInventory))


module.exports = router