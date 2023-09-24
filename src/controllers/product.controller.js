'use strict'

const ProductService = require("../services/product.service")

const shopModel = require('../models/shop.model')
const { SuccessResponse } = require("../core/success.response")

class ProductController{

    //handlerRefresh Token
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new product success!!',
            metadata: await ProductService.createProduct( req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)  
    }

    //publish product
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update publish product success!!',
            metadata: await ProductService.publishProductByShop({ 
                product_shop: req.user.userId,  
                product_id: req.params.id
            })
        }).send(res)
    }

    //unPublish product
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update unPublish product success!!',
            metadata: await ProductService.unPublishProductByShop({ 
                product_shop: req.user.userId,  
                product_id: req.params.id
            })
        }).send(res)
    }

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update unPublish product success!!',
            metadata: await ProductService.updateProduct(
                req.body.product_type,
                req.params.product_id,
                { ...req.body, product_shop: req.user.userId }
                
            )
        }).send(res)
    }

    //QUERY
    /**
     * 
     * @desc Get all Drafts for shop 
     * @param {Number} limit 
     * @param {Number} skip 
     * @return { JSON }  
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list draft success!!',
            metadata: await ProductService.findAllDraftsForShop({ product_shop: req.user.userId })
        }).send(res) 
    }


    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list publish success!!',
            metadata: await ProductService.findAllPublishForShop({ product_shop: req.user.userId })
        }).send(res) 
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search publish product success!!',
            metadata: await ProductService.searchProduct(req.params)
        }).send(res) 
    }

    findAllProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list all publish product success!!',
            metadata: await ProductService.findAllProduct(req.query)
        }).send(res) 
    }
    
    findProduct = async (req, res, next) => {
        new SuccessResponse({
          message: 'get info detail Product successfully',
          metadata: await ProductService.findProduct({
            product_id: req.params.product_id,
          }),
        }).send(res)
      }
    //END QUERY
}
module.exports = new ProductController()