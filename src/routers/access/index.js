'use strict'
const express = require('express')
const router = express.Router()
const AccessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
//signUp
router.post('/shop/signup', asyncHandler(AccessController.signUp))
//login
router.post('/shop/login', asyncHandler(AccessController.login))
//authentication
router.use(authenticationV2)

//logout
router.post('/shop/logout', asyncHandler(AccessController.logout))
//handlerRefreshToken
router.post('/shop/handlerRefreshToken', asyncHandler(AccessController.handlerRefreshTokenV2))
 

module.exports = router