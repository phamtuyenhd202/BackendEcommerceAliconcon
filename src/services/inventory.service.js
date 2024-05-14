'use strict'

const { BadRequestError } = require('../core/error.response')
const {inventory} = require('../models/inventory.model')
const { getProductById } = require('../models/repository/product.repo')

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        loction = '28, Xuan La, Tay Ho, Ha Noi'
    }) {
        const product = getProductById(productId)
        if(!product) throw new BadRequestError('The product does not exists!')

        const query = {inven_shopId: shopId, inven_productId: productId},
        updateSet = {
            $inc: {inven_stock: stock},
            $set: {inven_location: location}
        },
        options = {upsert: true, new: true}
        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService