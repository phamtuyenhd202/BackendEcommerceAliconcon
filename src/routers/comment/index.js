'use strict'
const express = require('express')
const router = express.Router()
const CommentController = require('../../controllers/comment.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

router.use(authenticationV2)
//create discount code
router.post('', asyncHandler(CommentController.createComment))
router.delete('', asyncHandler(CommentController.deleteComment))
router.get('', asyncHandler(CommentController.getCommentsByParentId))


module.exports = router