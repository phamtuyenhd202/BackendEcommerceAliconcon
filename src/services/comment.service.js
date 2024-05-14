'use strict'

const { NotFoundError } = require('../core/error.response')
const Comment = require('../models/comment.model')
const { getProductById } = require('../models/repository/product.repo')
const { convertToObjectIdMongodb } = require('../utils')

// key feature: comment service
// 1. add comment [user, shop]
// 2. get a list of comments [User, Shop]
// 3. delete a comment [User, Shop, Admin]

class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }){
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })
        let rightValue
        if(parentCommentId){
            //reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if(!parentComment) throw new NotFoundError('parent comment not found')

            rightValue = parentComment.comment_right
            //updateMany comments
            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: {$gte: rightValue}
            },{
                $inc: {comment_right: 2}
            })

            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: {$gt: rightValue}
            },
            {
                $inc: {comment_left: 2}
            })
        }else{
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectIdMongodb(productId),
            }, 'comment_right', {sort: { comment_right: -1} })
            if(maxRightValue){
                rightValue = maxRightValue.right +1
            }else{
                rightValue = 1
            }
        }
        //insert to comment
        comment.comment_left= rightValue
        comment.comment_right= rightValue + 1
        await comment.save()
        return comment
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit= 50, 
        offset = 0, //skip
    }){
        if(parentCommentId){
            const parent = await Comment.findById(parentCommentId)
            if(!parent) throw new NotFoundError('Not found comment product parent')
            const {comment_left, comment_right} = parent
            const comments = await Comment.find({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: {$gt: comment_left},
                comment_right: {$lte: comment_right}
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })
            return comments
        }

        const parent = Comment.findById(parentCommentId)
            if(!parent) throw new NotFoundError('Not found comment product parent')

            const comments = await Comment.find({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_parentId: parentCommentId
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })
            console.log('comments::::', comments)
            return comments
    }

    static async deleteComment({ commentId, productId }){
        //check product exists in the database
        const foundProduct = getProductById(productId)
        if(!foundProduct) throw new NotFoundError('Product not found')

        // xac dinh gia tri left right
        const comment = await Comment.findById(commentId)
        if(!comment) throw new NotFoundError('Comment not fond')

        const leftValue = comment.comment_left 
        const rightValue = comment.comment_right

        // tinh chieu rong comment
        const width = rightValue - leftValue + 1
        // xoa tat ca commentID con
        await Comment.deleteMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: {$gte: leftValue, $lte: rightValue }
        })
        // cap nhat la gia tri right vaf left con lai
        await Comment.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_right: {$gt: rightValue}
        },{
            $inc: {comment_right: -width}
        })
        
        await Comment.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: {$gt: leftValue},
        },{
            $inc: {comment_left: -width}
        })

        
        return true
    }

}
module.exports= CommentService