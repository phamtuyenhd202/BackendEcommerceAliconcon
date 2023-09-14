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
const { Types } = require('mongoose');
class KeyTokenService{
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken}) => {
        try {
            //level 0
            // const toKens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return toKens ? toKens.publicKey : null

            //level maxxxxxx
            const filter = { user: userId }
            const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken }
            const options = { upsert: true, new : true }

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options )

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findById = async ( userId ) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) })
    }

    static deleteById = async ( id ) => {
        return await keytokenModel.deleteOne({ _id: id })
    }

    static findByRefreshTokenUsed = async ( refreshToken ) => {
        return await keytokenModel.findOne( {refreshTokensUsed: refreshToken} ).lean()
    }

    static findByRefreshToken = async ( refreshToken ) => {
        return await keytokenModel.findOne({ refreshToken })
    }

    static deleteKeyById = async ( userId ) => {
        return await keytokenModel.deleteOne({ user: userId })
    }
}

module.exports = KeyTokenService


