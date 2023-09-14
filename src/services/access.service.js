'use strict'
// access service signUp vesion for level maxxxxxxxx
// const shopModel = require("../models/shop.model")
// const bcrypt = require('bcrypt')
// const crypto = require('crypto')
// const KeyTokenService = require("./keyToken.service")
// const { createTokenPair } = require("../auth/authUtils")
// const { Console } = require("console")
// const { getInfoData } = require("../utils")


// const roleShop = {
//     SHOP: 'SHOP',
//     WRITER: 'WRITER',
//     EDITER: 'EDITOR',
//     ADMIN: 'ADMIN'
// }

// class AccessService {
//     static  signUp = async ({ name, email, password }) => {
//         try {
//             //step 1: check email exists??
//             console.log("1******************************")
//             const hodelShop = await shopModel.findOne({ email })
//             console.log("1")
         
//             if(hodelShop){
//                 return {
//                     code: 'xxx',
//                     message: 'Shop already registered'
//                 }
//             }
//             console.log("1******************************")
            

//             const passwordHash = await bcrypt.hash(password, 10)
//             const newShop = await shopModel.create({
//                 name, email, password: passwordHash, roles: [roleShop.SHOP]
//             })
        
            

//             if(newShop){
//                 // created privateKey,  publicKey
//                 const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
//                     modulusLength: 4096,
//                     publicKeyEncoding: {
//                         type: 'pkcs1',
//                         format: 'pem'
//                     },
//                     privateKeyEncoding: {
//                         type: 'pkcs1',
//                         format: 'pem'
//                     }

//                 })
//                 console.log({ privateKey, publicKey }) // save collection keyStore
        
//                 const publicKeyString = await KeyTokenService.createKeyToken({
//                     userId: newShop._id,
//                     publicKey
//                 })
                
    
//                 if(!publicKeyString){
//                     return {
//                         code: 'xxx',
//                         message: 'publicKeyString error'
//                     }
//                 }
                
//                 const publicKeyObject = crypto.createPublicKey( publicKeyString )
//                 // create token pair
//                 const tokens = await createTokenPair({userId: newShop._id, email}, publicKeyString, privateKey)
//                 console.log('Sreate Token Success', tokens)
                
    
//                 return {
//                     code: 201,
//                     metadata: {
//                         shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
//                         tokens
//                     }
//                 }
//             }

//             return {
//                 code: 200,
//                 metadata: null
                
//             }
           

//         } catch (error) {
//             return{
//                 code: 'xxx',
//                 message: error.message,
//                 status: 'error'
//             }
//         }
//     }
// }
// module.exports = AccessService

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const { createTokenPair } = require("../auth/authUtils")
const { Console } = require("console")
const { getInfoData } = require("../utils")
const { BadRequestError,  } = require("../core/error.response")

//service------------------
const KeyTokenService = require("./keyToken.service")
const { findByEmail } = require("./shop.service")
const { AuthFailureError } = require("../core/error.response")


const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITER: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    
   static login = async ({ email, password, refreshToken = null }) => {
    /*
    cách bước sevice 
        1. check email
        2. match password
        3. create privateKey and publicKey
        4. generate token
        5. get data return login
    */
        //1
        const foundShop = await findByEmail({ email })
        if(!foundShop)  throw new BadRequestError('Shop not regitered')
        //2
        const match = await bcrypt.compare(password, foundShop.password)
        if(!match) throw new AuthFailureError('Authentication error')
        //3
        // create privateKey and publicKey
        const  privateKey = crypto.randomBytes(64).toString('hex')
        const  publicKey = crypto.randomBytes(64).toString('hex')
        //4. generate token
   
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
          refreshToken: tokens.refreshToken,
          publicKey,
          privateKey,
          userId: foundShop._id,
        })

        //5 get data return login
        return {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }      
   }

   //logout::::

    static logout = async (keyStore) => {
        console.log('delKey::::', 123)
        const delKey = await KeyTokenService.deleteById( keyStore._id )
        console.log('delKey::::', { delKey })
        return delKey

    }

    static  signUp = async ({ name, email, password }) => {
        
            //step 1: check email exists??
            console.log("1******************************")
            const hodelShop = await shopModel.findOne({ email })
            console.log("1")
         
            if(hodelShop){
                throw new BadRequestError('Error: Shop already  regitered!')
            }
            
            

            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [roleShop.SHOP]
            })
        
            

            if(newShop){             
                //create privateKey and publicKey
                const  privateKey = crypto.randomBytes(64).toString('hex')
                const  publicKey = crypto.randomBytes(64).toString('hex')
                 
                console.log({ privateKey, publicKey }) // save collection keyStore

                
        
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey, 
                    privateKey,
                    
                })
                   
                if(!keyStore){
                    return {
                        code: 'xxx',
                        message: 'keyStore error'
                    }
                }

                // create token pair
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                console.log('Sreate Token Success', tokens)

    
                return {
                    shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }

            return {
                code: 200,
                metadata: null
                
            }
           
    }
}
module.exports = AccessService

