import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    sequence: {
        type: Number,
        default: 0,
    },
});

counterSchema.statics.getNextSequence = async function (sequenceName) {
    const counter = await this.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence: 1 } },
        { returnDocument: 'after', upsert: true }
    );
    return counter.sequence;
};

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;