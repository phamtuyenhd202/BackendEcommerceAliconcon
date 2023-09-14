'use strict'

const { findById } = require('../services/apiKey.service')
const crypto = require('node:crypto')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION:'authorization'
}


const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            return res.status(403).json({
                message: 'Forbindden Error'
            })
        }

        // check objKey
        const  objKey = await findById( key )
        if(!objKey){
            return res.status(403).json({
                message: 'Forbindden Error'
            })
        }
        req.objKey = objKey
        return next()
        
    } catch (error) {
        
    }
}



// check permission
const  permission = ( permission ) => {
    return (req, res, next) => {
        // console.log('vvvvvvvvvvvvvvv::::::::::', req.objKey.permissions)
        if(!req.objKey.permissions){
            return res.status(403).json({
                message: 'permission denied'
            })
        }

        // console.log('permission:: ', req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            return res.status(403).json({
                message: 'permission denied'
            })
        }

        return next()
    }
}


module.exports = {
    apiKey,
    permission

}