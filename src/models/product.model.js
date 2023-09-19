'use strict'

const { mongoose, Schema, Types } = require('mongoose'); // Erase if already required
const slugify = require('slugify')
const DOCUMENT_NAME = 'product'
const COLLECTION_NAME = 'products'

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    product_name: { type:String, required:true, },
    product_thumb: { type:String, required:true, },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required:true, },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: {type: Types.ObjectId, ref: 'shop'},
    product_attributes: { type: Schema.Types.Mixed, required:true, },
    //more
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        //lam trong 4.3343434 => 4.3
        set: (val) => Math.round(val * 10) /10,
    },
    product_variations: {type: Array, default: []},
    isDraft: { type: Boolean, default: true, index: true, select: false},
    isPublished: { type: Boolean, default: false, index: true, select: false},
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// documemt middelware: run before .save() and create().....
productSchema.pre('save', function( next ){
    this.product_slug = slugify(this.product_name, { lower: true})
    next()
})


//define the product type = clothing

const clothingSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: Types.ObjectId, ref: 'shop'},
},{
    collection:'clothes',
    timestamps: true
})

//define the product type = electronic

const electronicSchema = new Schema({
    manufacturer: {type: String, required: true},
    model: String,
    color: String,
    product_shop: {type: Types.ObjectId, ref: 'shop'},
},{
    collection:'electronics',
    timestamps: true
})



const furnitureSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: Types.ObjectId, ref: 'shop'},
},{
    collection:'furnitures',
    timestamps: true
})
 


//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    electronic: mongoose.model('electronic', electronicSchema),
    clothing: mongoose.model('clothing', clothingSchema),
    furniture: mongoose.model('furniture', furnitureSchema)
}



