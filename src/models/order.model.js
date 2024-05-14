'use strict'

const {model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const OrdertSchema = new Schema({
    order_userId: {type: Number, required: true},
    order_checkout: {type: Object, default: {}},
    /*
        order_checkout{
            totalPrice,
            totalApplyDiscount,
            freeship
        } 
    */
   order_shipping: {type: Object, default: {}},
   /*
        order_shipping{
            street,
            city,
            state,
            country
        }
   */
  order_payment: {type: Object, default: {}},
  order_products: {type: Array, required: true},
  order_trackingNumber: {type: String, default: '#0000118052023'},
  order_status: {type: String, enum: ['pending', 'comfirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'}
},{
    collection: COLLECTION_NAME,
    timestamps:{
        createdAt: 'createOn',
        updatedAt: 'modifiedOn'
    }
})


module.exports = {
    cart: model(DOCUMENT_NAME, OrdertSchema)
}