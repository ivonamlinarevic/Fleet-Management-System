const mongoose = require('mongoose');

// Definicija modela vozila
const vehicleSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['car', 'van', 'truck'],
        required: true,
    },
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    availabilityStatus: {
        type: String,
        enum: ['available', 'reserved', 'maintenance'],
        default: 'available',
    },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
