const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat.js');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        required: 'need a better name',
        trim: true
    },
    createdBy: {
        type: String,
        required: 'who are you', 
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        required: true,
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'], 
        default: 'Large'
    },
    toppings: [],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    },
        {
            toJSON: {
                virtuals: true,
                getters: true
            },
            id: false
        }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

const Pizza = model('Pizza', PizzaSchema); // create the Pizza model using the PizzaSchema

module.exports = Pizza; // export the Pizza model