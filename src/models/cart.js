import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [
            {
                id_product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity:{
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }
})

cartSchema.pre('finOne', function(){
    this.populate('products.id_product')
})
const cartModel = model('carts', cartSchema);

export default cartModel