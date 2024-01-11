const mongoose = require('mongoose');
const items = require('../Utils/items');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: [items.a, items.b, items.c, items.c, items.d, items.e, items.f, items.g, items.h],
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 0,
  },
  prevCount:{
    type: Number,
    default: 0
  },
  totalCount:{
    type: Number,
    default: 0
  },
  usage:{
    type: Number,
    default: 0
  }, 
  cost:{
    type: Number, 
    default: 1000
  }, 
  commission:{
    type: Number,
    default: 0.2
  }
});

itemSchema.virtual('totalItems').get(function () {
  return this.currentItems + this.newlyAddedItems;
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;