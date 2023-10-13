'use strict'
const { NotFoundError, BadRequestError } = require('../core/error.response')
const {findCartById} = require('../models/repository/cart.repo')
const { checkProductByServer } = require('../models/repository/product.repo')
const { getDiscountAmount } = require('./discount.service')

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
                console.log('dfsdfdsf::::', shop_discounts[0].codeId,
                    userId,
                    shopId,
                    checkoutProductServer)

                const {totaPrice = 0, discount = 0 } = await getDiscountAmount({
                    code: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkoutProductServer,
                })
                console.log('{totaPrice = 0, discount = 0 } ', {totaPrice, discount} )
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


}

module.exports = CheckoutService