'use strict'

const {
    listNotiByUser
} = require('../services/notification.service')

const { SuccessResponse, CREATED } = require("../core/success.response")

class NotificationController{

    listNotiByUser = async (req, res, next) =>{
        new SuccessResponse({
            message: 'Get listNotiByUser success!',
            metadata: await listNotiByUser( req.query )
        }).send(res)
    }
}

module.exports = new NotificationController()