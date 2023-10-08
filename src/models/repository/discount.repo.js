'use strict'

const { getSelectData,unGetSelectData } = require("../../utils")

const findAllDiscountCodeUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model
}) => {
    const skip = (page - 1) * limit 
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}

    const documemts = await model.find( filter )
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

    return documemts 

}


const findAllDiscountCodeSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, select, model
}) => {
    const skip = (page - 1) * limit 
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}

    const documemts = await model.find( filter )
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return documemts 

}

const checkDiscountExists = async ({model, filter}) => {
    return await model.findOne(filter).lean()
}

const updateDiscountById = async ({
    _id,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(_id, bodyUpdate, {new: isNew})
}
module.exports = {
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect,
    checkDiscountExists,
    updateDiscountById,

}