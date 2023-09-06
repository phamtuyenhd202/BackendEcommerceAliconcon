'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
            /*
                khi dùng signUp level maxxxxx thêm tên thuật toán
            */
        //const accessToken = JWT.sign(payload, privateKey, {   

        const accessToken = JWT.sign(payload, privateKey, {
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

module.exports = {
    createTokenPair,
}