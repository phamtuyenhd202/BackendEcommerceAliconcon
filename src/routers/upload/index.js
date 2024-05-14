'use strict'
const express = require('express')
const router = express.Router()
const uploadController = require('../../controllers/upload.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const {uploadDisk} = require('../../configs/multer.config')



//authentication
router.use(authenticationV2)

//handlerRefreshToken
router.post('/product', asyncHandler(uploadController.uploadFile ))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb ))

  

module.exports = router