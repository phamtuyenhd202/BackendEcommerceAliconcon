'use strict'

const {
    createComment,
    getCommentsByParentId,
    deleteComment,
} = require('../services/comment.service')

const { SuccessResponse, CREATED } = require("../core/success.response")

class CommentController{
    createComment = async (req, res, next) =>{
        new CREATED({
            message: 'Create new comment success!',
            metadata: await createComment( req.body )
        }).send(res)
    }

    deleteComment = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Delete comment success!',
            metadata: await deleteComment( req.body )
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Get comment success!',
            metadata: await getCommentsByParentId( req.query )
        }).send(res)
    }
}

module.exports = new CommentController()