'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

const getInfoData = ( { fileds = [], object = {} } ) => {
    return _.pick( object, fileds )
}

// ['a', 'b'] => {a:1, b:1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

// ['a', 'b'] => {a:0, b:0}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(k => {
        if(obj[k] === null)
            delete obj[k]
    })
    return obj
}

const updateNestedObjectParser = obj => {
    const final = {}
    Object.keys(obj || {}).forEach(k => {
        if(typeof obj[k] === 'object' && !Array.isArray(obj[k])){
            const subObj = updateNestedObjectParser(obj[k])
            Object.keys(subObj).forEach(sk => {
                final[`${k}.${sk}`] = subObj[sk]
            })
        }else{
            final[k] = obj[k]
        }
    }) 
    return final
}

const  findObjectById = (arr, id) => {
    
    return arr.find(obj => obj.productId === id);
  } 

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb,
    findObjectById,
}