'use strict'
const { NotFoundError, BadRequestError } = require('../core/error.response')
const orderModel = require('../models/order.model')
const {findCartById} = require('../models/repository/cart.repo')
const { checkProductByServer } = require('../models/repository/product.repo')
const { getDiscountAmount } = require('./discount.service')
const { acquireLock, releaseLock } = require('./redis.service')

class CheckoutService{
    /*
        cartId,
        userId,
        shop_order_ids:[
            {
                shopId,
                shop_discounts: [],
                item_products: [
                    price,
                    quantity,
                    producId
                ]
            },
            {
                shopId,
                shop_discount: [
                    {
                        "shopId",
                        "discountId",
                        codeId: []
                    }
                ],
                item_products: [
                    price,
                    quantity,
                    productId
                ]
            }
        ]

    */
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }){
        //check cartId
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError('Cart does not exists!')

        //check order
        const checkout_order = {
            totalPrice: 0, //tong tien hang
            freeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong tien hang discount giam gia
            totalCheckout: 0, //tong tien thanh toan
        },
        shop_order_ids_new = []

        //tinh tong tien bill
        for(let i=0; i<shop_order_ids.length; i++){
            const {shopId, shop_discounts = [], item_products = []} = shop_order_ids[i]
            // check product available
            const checkoutProductServer = await checkProductByServer(item_products)
            if(!checkoutProductServer[0]) throw new BadRequestError('Order wrong!!!')

            //tong tien don hang
            const checkoutPrice = checkoutProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // tong tien truoc khi xu ly 
            checkout_order.totalPrice =+ checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, //tong tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice, //tong tien sau khi ap dung giam gia
                item_products: checkoutProductServer,
            }

            // neu shop_discount ton tai > 0, check xem co hop le hay khong
            if(shop_discounts.length > 0){
                //gia su chi co 1 discount 
                // get amount discount
                const {totaPrice = 0, discount = 0 } = await getDiscountAmount({
                    code: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkoutProductServer,
                })
                // tong discoun giam gia 
                checkout_order.totalDiscount += discount
                //neu tien giam gia lon hon 0
                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            
            //tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)

        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        }

    }

    //order

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment= {}
    }){
        const {shop_order_ids_new, checkout_order} = CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })
        //check lai mot lan nua xem co vuot qua ton kho hay khong
        //get new array products

        const products = shop_order_ids_new.flasMap(order => order.item_products)
        console.log(`[1]:::: `, products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const {productId, quantity} = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if(keyLock){
                await releaseLock(keyLock)
            }
        }
        //check lai neu co 1 san pham het hang trong kho
        if(acquireProduct.includes(false)){
            throw new BadRequestError('Mot san pham da dc cap nhat, vui long quay lai gio hang..!')
        }

        const newOrder = orderModel.create({
            order_user: userId,
            order_checkout: checkout_order,
            order_shopping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        //neu insert thanh cong thi remove product ra khoi card
        if(newOrder){
            //remove product in my card

        }


        return newOrder
    }
    /*
        1.query Order [User]
    */
    static async getOrdetById(){

    }
    /*
        2.query Order using Id [User]
    */
    static async getOneOrderByUser(){

    }
    /*
        3.cancel Order [User]
    */
    static async cancelOrderByUser(){

    }
    /*
        4. update Order status\ [Shop/ Admin]
    */
    static async updateOrderStatusByShop(){

    }

}

module.exports = CheckoutService