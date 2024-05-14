'use strict'

const { result } = require('lodash')
const { cloudinary } = require('../configs/cloudinary.config')

//1. upload from url image


const uploadImageFromUrl = async () =>{
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltw83g08wmbu11'
        const folderName = 'product/8409'
        const newFileName = 'testdemo'

        const result = await cloudinary.uploader.upload(urlImage, {
            public_id : newFileName,
            folder : folderName,
            }
        )

        console.log(result)
        return result
    } catch (error) {
        console.log('Erorr loading Image::', error)
    }

}

//2. upload from image local
const uploadImageFromLocal = async ({
    path,
    folderName = 'product/8409',
}) =>{
      
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id : 'thumb',
            folder : folderName
            
            }
        )

        console.log(result)
        return {
            image_url: result.secure_url,
            shop_id: 8409,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg'
            })
        }
    } catch (error) {
        console.log('Erorr loading Image::', error)
    }

}

module.exports = { 
    uploadImageFromUrl,
    uploadImageFromLocal
}

