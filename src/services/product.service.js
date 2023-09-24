'use strict'

const { BadRequestError } = require('../core/error.response')
const { product, clothing, electronic, furniture } = require('../models/product.model')
const {removeUndefinedObject, updateNestedObjectParser} = require('../utils/index')
const { 
    findAllDraftsForShop, 
    publishProductByShop, 
    findAllPublishForShop, 
    unPublishProductByShop, 
    searchProduct,
    findAllProduct,
    findProduct,
    updateProductById,

} = require('../models/repository/product.repo')

const {
    insertInventory,
} = require('../models/repository/inventory.repo') 

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

    static async updateProduct(type, product_id, payload){
        const productClass = ProductFactory.productRegitstry[type]
        if(!productClass) throw new BadRequestError(`Invalid product type ${type}`)

        return new productClass(payload).updateProduct(product_id)
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
    //search a product
    static async searchProduct({keySearch}){
        return await searchProduct({keySearch})
    }

    //find all product 
    static async findAllProduct({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}, }){
        return await findAllProduct({ limit, sort, page, filter,
        select: ['product_name', 'product_price', 'product_thumb', 'product_ratingsAverage']
        })
    }

    //find a product detial
    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
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
        const newProduct = await product.create({ ...this, _id: product_id})
        if(newProduct){
            //add product_stock in inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }

        return newProduct
    }
    
    // update product
    async updateProduct(product_id, payload){
        return await updateProductById({product_id, payload, model: product})
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

    async updateProduct( product_id ){

        //1. remove attr has null, undefined
        const objectParams = removeUndefinedObject(this)
        //2. xem update o cho nao
        if(objectParams.product_attributes){
            //update child
            await updateProductById({
                product_id, 
                payload: updateNestedObjectParser(objectParams.product_attributes), 
                model: clothing})
        }

        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct
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

    async updateProduct( product_id ){

        //1. remove attr has null, undefined
        const objectParams = removeUndefinedObject(this)
        //2. xem update o cho nao
        if(objectParams.product_attributes){
            //update child
            await updateProductById({
                product_id, 
                payload: updateNestedObjectParser(objectParams.product_attributes), 
                model: electronic})
        }

        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct
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

    async updateProduct( product_id ){

        //1. remove attr has null, undefined
        const objectParams = removeUndefinedObject(this)
        //2. xem update o cho nao
        if(objectParams.product_attributes){
            //update child
            await updateProductById({
                product_id, 
                payload: updateNestedObjectParser(objectParams.product_attributes), 
                model: furniture})
        }

        const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

//regitster product type

ProductFactory.productRegitsterType('Electronic', Electronic)
ProductFactory.productRegitsterType('Clothing', Clothing)
ProductFactory.productRegitsterType('Furniture', Furniture)


module.exports = ProductFactory