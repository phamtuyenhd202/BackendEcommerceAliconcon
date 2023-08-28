'use strict'
// function create keyToken vesion for level maxxxxxxxxxxxx

// const keytokenModel = require("../models/keytoken.model")

// class KeyTokenService{
//     static createKeyToken = async ({ userId, publicKey }) => {
//         try {
            
//             const publicKeyString = publicKey.toString()
//             const toKens = await keytokenModel.create({
//                 user: userId,
//                 publicKey: publicKeyString
//             })

//             return toKens ? toKens.publicKey : null
//         } catch (error) {
//             return error
//         }
//     }
// }

// module.exports = KeyTokenService


const keytokenModel = require("../models/keytoken.model")

class KeyTokenService{
    static createKeyToken = async ({ userId, publicKey, privateKey}) => {
        try {
            
            const toKens = await keytokenModel.create({
                user: userId,
                publicKey,
                privateKey
            })

            return toKens ? toKens.publicKey : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService


