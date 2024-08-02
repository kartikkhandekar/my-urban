const { Schema, model } = require('mongoose')

const cartSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  services: [{
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  totalPrice: {
    type: Number,
  }
}, { timestamps: true })

const Cart = model('Cart', cartSchema)

module.exports = Cart
