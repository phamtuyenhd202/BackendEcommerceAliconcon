'use strict'
const express = require('express')
const router = express.Router()
const ProductController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')


// search a published product
router.get('/search/:keySearch', asyncHandler(ProductController.getListSearchProduct))
router.get('/:product_id', asyncHandler(ProductController.findProduct))
router.get('', asyncHandler(ProductController.findAllProduct))

//authentication
router.use(authenticationV2)

//handlerRefreshToken
router.post('', asyncHandler(ProductController.createProduct))
router.patch('/:product_id', asyncHandler(ProductController.updateProduct))
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))

router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(ProductController.getAllPublishForShop))


module.exports = router