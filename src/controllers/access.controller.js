'use strict'

const AccessService = require("../services/access.service")

const shopModel = require('../models/shop.model')
const { CREATED, SuccessResponse } = require("../core/success.response")

class AccessController{
    //login
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)

        // return res.status(200).json({metadata: await AccessService.login(req.body)})
    }

    signUp = async (req, res, next) =>{
        
        new CREATED({
            message: 'Reagistered OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)
        // return res.status(201).json(await AccessService.signUp(req.body))

    }
}

module.exports = new AccessController()