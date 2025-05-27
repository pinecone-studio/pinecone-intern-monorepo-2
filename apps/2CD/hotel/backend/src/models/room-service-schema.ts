//eslint-disable-next-line unicorn/filename-case
import mongoose from 'mongoose';

const RoomServiceSchema = new mongoose.Schema({
    bathroom: {
        type: [String],
        required: true
    },
    accesibility: {
        type: [String],
        required: true
    },
    entertainment: {
        type: [String],
        required: true
    },
    foodAndDrink: {
        type: [String],
        required: true
    },
    bedroom: {
        type: [String],
        required: true
    },
});

export const RoomService = mongoose.model('RoomService', RoomServiceSchema);