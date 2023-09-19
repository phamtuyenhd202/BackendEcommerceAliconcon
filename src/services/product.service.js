'use strict'

const { BadRequestError } = require('../core/error.response')
const { product, clothing, electronic, furniture } = require('../models/product.model')
const { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unPublishProductByShop } = require('../models/repository/product.repo')

//defince Factory class to create product
class ProductFactory {

    static productRegitstry = {}

    static productRegitsterType ( type, classRef ){
        return ProductFactory.productRegitstry[type] = classRef
    }
    static async createProduct( type, payload ){
        const productClass = ProductFactory.productRegitstry[type]
        if(!productClass) throw new BadRequestError(`Invalid product Type ${type}`)

        return new productClass(payload).createProduct()
    }

    //PUT

    //puclish product
    static async publishProductByShop({product_shop, product_id}){
        return await publishProductByShop({product_shop, product_id})
    }

    //unpublish product
    static async unPublishProductByShop({product_shop, product_id}){
        return await unPublishProductByShop({product_shop, product_id})
    }

    //END PUT

    //QYERY

    //find all drafts for shop
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isDraft : true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    // find all publish for shop
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0}){
        const query = { product_shop, isPublished : true }
        return await findAllPublishForShop({ query, limit, skip })
    }
} 

//defince base product class
class Product {
    constructor ({
        product_name, product_thumb, product_description, product_price, 
        product_quantity, product_type, product_shop, product_attributes
    }){
        this.product_name = product_name
        this.product_thumb =product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct ( product_id ){
        return await product.create({ ...this, _id: product_id})
    }
}

//defince sub-class for different product types Clothing

class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing) throw BadRequestError('Create new clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw BadRequestError('Create new product error')

        return newProduct
    }
}

//defince sub-class for different product types Electronic

class Electronic extends Product {
    async createProduct(){
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw BadRequestError('Create new clothing error')
       
        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw BadRequestError('Create new product error')
        
        return newProduct
    }
}

class Furniture extends Product {
    async createProduct(){
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) BadRequestError('Create new Furniture error')

        const newProduct = super.createProduct(newFurniture._id)
        if(!newProduct) BadRequestError('Create new product error')

        return newProduct
    }
}

//regitster product type

ProductFactory.productRegitsterType('Electronic', Electronic)
ProductFactory.productRegitsterType('Clothing', Clothing)
ProductFactory.productRegitsterType('Furniture', Furniture)


module.exports = ProductFactory