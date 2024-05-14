'use strict'

const InventoryService = require('../services/inventory.service')

const { SuccessResponse, CREATED } = require("../core/success.response")

class InventoryController{
    addStockToInventory = async (req, res, next) =>{
        new CREATED({
            message: 'Create new cart addStockToInventory success!',
            metadata: await InventoryService.addStockToInventory( req.body )
        }).send(res)
    }
}

module.exports = new InventoryController()