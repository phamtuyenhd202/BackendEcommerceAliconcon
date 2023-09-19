'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findById } = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
            /*
                khi dùng signUp level maxxxxx thêm tên thuật toán
            */
        //const accessToken = JWT.sign(payload, privateKey, {   

        const accessToken = JWT.sign(payload, publicKey, {
            /*
                khi dùng signUp level maxxxxx thêm tên thuật toán
            */
            // algorithm: 'RS256', 
            expiresIn: '2 days'
        })
        
        const refreshToken = JWT.sign(payload, privateKey, {
            // tương tự
            // algorithm: 'RS256',    
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err){
                console.log('error verify:: ', err)
            }else{
                console.log('decode verify:: ', decode)
            }
        })
        return {accessToken, refreshToken}

    } catch (error) {
        
    }
}

const authentication = asyncHandler( async (req, res, next) => {
    /*
        1. check userId missing?
        2. get accessToken
        3. verifyToken
        4. check user in DBs?
        5. check keyStore with this userId?
        6. Ok all return next
    */
    //1
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')


    //2
    const keyStore = await findById( userId )
    if(!keyStore) throw new NotFoundError('Not Found KeyStore')


    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')

        req.keyStore = keyStore
        
        return next()
    } catch (error) {
        throw error
    }
})

const authenticationV2 = asyncHandler( async (req, res, next) => {
    /*
        1. check userId missing?
        2. get accessToken
        3. verifyToken
        4. check user in DBs?
        5. check keyStore with this userId?
        6. Ok all return next
    */
    //1
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request')

    //2
    const keyStore = await findById( userId )
    if(!keyStore) throw new NotFoundError('Not Found KeyStore')

    //3
    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
            
            
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            
            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')
    
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')

        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}


module.exports = {
    createTokenPair,
    authentication,
    authenticationV2,
    verifyJWT,

}