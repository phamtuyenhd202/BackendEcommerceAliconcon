'use strict'

const { S3Client } = require('@aws-sdk/client-s3')

const s3Config = {
    region: 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_BUTKET_NAME_KEY,
        secretAccessKey: process.env.AWS_BUTKET_ACCESS_KEY
    }
}
module.exports = new S3Client(s3Config)