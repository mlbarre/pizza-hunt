const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const replySchema = new Schema(
    {
        // set custom id to avoid cusfusion with parent comment_id
        replyBody: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        writtenBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },
        toJSON: {
            getters: true
            },
    }
);

const commentSchema = new Schema({
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    replies: [replySchema],
    toJSON: {
        virtuals: true, 
        getters: true,
        },
        id: false
    
});

commentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;