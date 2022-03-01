const { Schema, model } = require('mongoose');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String, 
        default: 'Large'
    },
    toppings: []
});

const Pizza = model('Pizza', PizzaSchema); // create the Pizza model using the PizzaSchema

module.exports = Pizza; // export the Pizza model