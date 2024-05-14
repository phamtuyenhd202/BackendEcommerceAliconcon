'use strict'
const express = require('express')
const router = express.Router()
const NotificationController = require('../../controllers/notification.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

router.use(authenticationV2)
//create discount code
router.get('', asyncHandler(NotificationController.listNotiByUser))



module.exports = router