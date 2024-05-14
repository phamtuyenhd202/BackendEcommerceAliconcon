'use strict'

const { inventory } = require("../inventory.model")
const { Types } = require('mongoose')
const { convertToObjectIdMongodb } = require('../../utils/index')
const inventoryModel = require("../inventory.model")

const insertInventory = async ({
    productId, shopId, stock, location = 'unKnow'
}) => {
    return await inventory.create({
        inven_productId: new Types.ObjectId(productId),
        inven_shopId: new Types.ObjectId(shopId),
        inven_stock: stock,
        inven_location: location,
    })
}

const reservationInventory = async ({productId, quantity, cartId}) => {
    const query = {
        inven_productId: convertToObjectIdMongodb(productId),
        inven_stock: {$gte: quantity}  
    },
    updateSet ={
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservation: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    },
    options = {upsert: true, new: true}

    return await inventoryModel.updateOne(query, updateSet)
}

module.exports = {
    insertInventory,
    reservationInventory
}